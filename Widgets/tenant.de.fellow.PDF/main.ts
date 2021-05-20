import {ChangeDetectorRef, Component, HostListener, Input, NgModule, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SohoListViewModule} from "@infor/sohoxi-angular";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IWidgetComponent, IWidgetContext, IWidgetInstance, IWidgetSettingMetadata, WidgetSettingsType} from "lime";
import {assets} from "./assets";
import {tasksAPIPayload} from './assets';
import {DomSanitizer, SafeHtml, SafeUrl} from "@angular/platform-browser";
import {HttpClient, HttpHeaders} from "@angular/common/http";

interface MainMenuItem {
    AKTUALISIEREN: { icon: SafeHtml, label: string },
    WEITERLEITEN: { icon: SafeHtml, label: string },
    TRENNEN: { icon: SafeHtml, label: string },
    BEARBEITEN: { icon: SafeHtml, label: string },
    EAKTE: { icon: SafeHtml, label: string },
    HWSCXS: { icon: SafeHtml, label: string }
}

interface ListItem {
    index: number;
    taskId: number;
    checked: boolean;
    date: string;
    sender: string;
    cashRegister: string,
    lastName: string,
    firstName: string,
    entrance: string,
    selected: boolean,
    url: string;
    fileName: string;
    pid: string; // used when we try to update form attributes
    aclId: string;
    aclName: string;
}

interface EakteListItem {
    index: number;
    date: string;
    document: string;
    am: string;
    hinweis: string;
    vordruck: string;
    user: string;
    pdfLink: string;
    selected: boolean;
}

interface VerticalListItem {
    date: string;
    rollover: boolean;
}

interface UsersList {
    Email: string;
    FirstName: string;
    LastName: string;
    PersonId: string;
    Status: number;
    Title: string;
    UpdatedDate: string;
    UserGUID: string;
    UserId: number;
    UserName: string;
    IsColemanUser: boolean;
    ProfilePhoto: any;
    ProfilePhotoPath: any;
}

interface Task {
    created: String,
    escalated: Boolean,
    itemType: String,
    message: String
}

interface SocketDataPacket {
    data: Task[],
    resultCode: Number
}

@Component({
    template: `
        <div class="parent-layout">
            <!--  Top Button Row   -->
            <div class="icon-row">
                <div style="cursor: pointer" (click)="showEakte = false; prepareData()">
                    <div><img [src]="topMenuItems.AKTUALISIEREN.icon" class="main-menu-icon-image"/></div>
                    <div class="header-label">{{topMenuItems.AKTUALISIEREN.label}}</div>
                </div>
                <div style="cursor: pointer" (click)="openDialog()">
                    <div><img [src]="topMenuItems.WEITERLEITEN.icon" class="main-menu-icon-image"/></div>
                    <div class="header-label">{{topMenuItems.WEITERLEITEN.label}}</div>
                </div>
                <div style="cursor: pointer">
                    <div><img [src]="topMenuItems.TRENNEN.icon" class="main-menu-icon-image"/></div>
                    <div class="header-label">{{topMenuItems.TRENNEN.label}}</div>
                </div>
                <div style="cursor: pointer" [ngClass]="{'setFocus' : showForm}" (click)="editForm()">
                    <div><img [src]="topMenuItems.BEARBEITEN.icon"
                              class="main-menu-icon-image"/></div>
                    <div class="header-label">{{topMenuItems.BEARBEITEN.label}}</div>
                </div>
                <div style="cursor: pointer" [ngClass]="{'setFocus' : showEakte}"
                     (click)="showEakte = true; showForm = false; fetchEakteData()">
                    <div><img [src]="topMenuItems.EAKTE.icon" class="main-menu-icon-image"/></div>
                    <div class="header-label">{{topMenuItems.EAKTE.label}}</div>
                </div>
                <div style="cursor: auto">
                    <div><img [src]="topMenuItems.HWSCXS.icon" class="main-menu-icon-image"/></div>
                    <div class="header-label">{{topMenuItems.HWSCXS.label}}</div>
                </div>
            </div>

            <!-- First Tab -->
            <ng-container *ngIf="!showEakte">
                <div style="width: 100%; display: flex; padding: 10px; overflow: auto; background-color: #f0f0f0;">
                    <div style="width: 50%; overflow: auto; display: grid; padding-top: 20px; grid-template-rows: 20px auto;">
                        <div class="grid-header">
                            <div style="width: 10%; text-align: center" (click)="sortListBy('checked')">Vetr.<img
                                    [src]="sortIcon" class="sort"/></div>
                            <div style="width: 12%" (click)="sortListBy('date')">Datum<img [src]="sortIcon"
                                                                                           class="sort"/></div>
                            <div style="width: 13%" (click)="sortListBy('sender')">Absender<img [src]="sortIcon"
                                                                                                class="sort"/></div>
                            <div style="width: 20%" (click)="sortListBy('cashRegister')">Kassenzeichen<img
                                    [src]="sortIcon" class="sort"/></div>
                            <div style="width: 15%" (click)="sortListBy('lastName')">Nachname<img
                                    [src]="sortIcon" class="sort"/></div>
                            <div style="width: 15%" (click)="sortListBy('firstName')">Vorname<img [src]="sortIcon"
                                                                                                  class="sort"/></div>
                            <div style="width: 15%" (click)="sortListBy('entrance')">Eingang<img [src]="sortIcon"
                                                                                                 class="sort"/></div>
                        </div>
                        <div style="overflow: auto">
                            <div *ngIf="!inProgress && !error && sampleListItems.length === 0"
                                 style="padding-top: 25px; padding-left: 45%; opacity: 0.8">
                                No data found
                            </div>
                            <div *ngIf="error"
                                 style="padding-top: 25px; padding-left: 45%; opacity: 0.8">
                                Error while fetching tasks.
                            </div>
                            <div *ngIf="inProgress && parallelProcessing && !error" style="text-align: center">
                                <div class="lds-spinner">
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                    <div></div>
                                </div>
                            </div>
                            <div *ngIf="inProgress && !parallelProcessing && !error" style="display: flow-root">
                                <div class="progress">
                                    <div class="progress-bar" data-options="{'value': '0'}" id="progress-bar1"
                                         data-automation-id="progress-bar1-automation"
                                         aria-labelledby="pr-label1"></div>
                                </div>
                                <div>
                                    <span style="float: right">Please wait... {{percentage.toFixed(2)}}
                                        % completed.</span>
                                </div>
                            </div>
                            <div *ngFor="let item of sampleListItems;"
                                 style="display: flex; background: white; height: 30px; cursor: pointer; margin-top: 7px;"
                                 class="list-item"
                                 [style.background-image]="item.selected ? 'linear-gradient(0deg, #2b79a7 0%, #4ebbfb 50%, #2b79a7 100%)' : null"
                                 [style.color]="item.selected ? 'white' : 'black'"
                                 (click)="selectRow(item)">
                                <div style="width: 10%; margin: auto 0">
                                    <img style="margin: auto auto; display: block" [src]="checkMark" width="20"
                                         *ngIf="item.checked">
                                </div>
                                <div style="width: 12%; margin: auto 0">{{item.date}}</div>
                                <div style="width: 13%; margin: auto 0">{{item.sender}}</div>
                                <div style="width: 20%; margin: auto 0">{{item.cashRegister}}</div>
                                <div style="width: 15%; margin: auto 0">{{item.lastName}}</div>
                                <div style="width: 15%; margin: auto 0">{{item.firstName}}</div>
                                <div style="width: 15%; margin: auto 0">{{item.entrance}}</div>
                            </div>
                        </div>
                        <div *ngIf="showForm" style="padding-top: 10px">
                            <div class="form-container">
                                <div class="form-fields-container">
                                    <div class="field">
                                        <label>User</label>
                                        <input type="text" class="smaller-text-field search-icon"
                                               [(ngModel)]="selectedRow.sender">
                                    </div>

                                    <div class="field">
                                        <label></label>
                                        <span style="font-size:14px">Obermeier, Klaus</span>
                                    </div>

                                    <div class="field">
                                        <label>Kassenzeichen</label>
                                        <input type="text" class="smaller-text-field"
                                               [(ngModel)]="selectedRow.cashRegister">
                                    </div>
                                    <div>&nbsp;</div>

                                    <div class="field">
                                        <label>Nachname</label>
                                        <input type="text" class="smaller-text-field"
                                               [(ngModel)]="selectedRow.firstName">
                                    </div>

                                    <div class="field">
                                        <label>Vorname</label>
                                        <input type="text" class="smaller-text-field"
                                               [(ngModel)]="selectedRow.lastName">
                                    </div>

                                    <div class="field" style="grid-row:4; grid-column: 1 / -1">
                                        <label>Eingang</label>
                                        <input type="text" class="smaller-text-field"
                                               [(ngModel)]="selectedRow.entrance"
                                               style="width:90%">
                                    </div>

                                    <div class="field" style="grid-row:5; grid-column: 1 / -1">
                                        <label>Dokumentenbezeichnung</label>
                                        <input type="text" class="smaller-text-field search-icon"
                                               [disabled]="true"
                                               [(ngModel)]="selectedRow.fileName"
                                               style="width:90%">
                                    </div>
                                </div>
                                <div class="push-to-bottom">
                                    <div></div>
                                    <div>
                                        <button class="outlined-button" (click)="showForm = false">schließen</button>
                                    </div>
                                </div>
                                <div class="push-to-bottom">
                                    <div></div>
                                    <div>
                                        <button class="filled-button" (click)="showEakte = true; showForm = false">
                                            eAkte
                                        </button>
                                    </div>
                                    <div>
                                        <button [ngClass]="isFormValid() ? 'filled-button' : 'disabled-button'"
                                                (click)="saveForm()"
                                                [disabled]="!isFormValid()">
                                            Speichern
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="width: 50%; height: 100%; padding: 48px 20px 0 30px;">
                        <iframe *ngIf="selectedRow" [src]="selectedRowUrl" width="100%"
                                height="100%"
                                class="pdf-container-style"></iframe>
                    </div>
                </div>
            </ng-container>
            <ng-container *ngIf="showEakte">
                <div style="width: 100%; display: flex; padding: 10px; overflow: auto; background-color: #f0f0f0;">
                    <div style="width: 50%; overflow: auto;">
                        <div style="background-color: #f0f0f0; padding: 10px; font-size: 13px; font-weight: bold">
                            <div>Inhaltsverzeichnis von: Testfall Hugo, 01/10/1752, Kajutenweg 5, 31134 HILLDESHEIM
                            </div>
                            <div style="margin-top: 10px">Kassenzeichen: {{selectedRow.cashRegister}}</div>
                            <div style="width: 200px; margin-top: 10px">
                                <button class="filled-button">
                                    Inhaltsverzeichnis drücken
                                </button>
                            </div>
                        </div>
                        <div style="display: grid">
                            <div class="grid-header">
                                <div style="width: 20%;text-align: center">Datum/Uhrzeit</div>
                                <div style="width: 39%">Dokument</div>
                                <div style="width: 10%">am</div>
                                <div style="width: 10%">Hinweis</div>
                                <div style="width: 10%">Vordruck</div>
                                <div style="width: 11%">User</div>
                            </div>
                            <div style="overflow: auto">
                                <div *ngIf="sampleEakteItems.length === 0"
                                     style="padding-top: 25px; padding-left: 45%; opacity: 0.8">
                                    No data found
                                </div>
                                <div *ngFor="let item of sampleEakteItems;"
                                     style="display: flex; background: white; height: 30px; cursor: pointer; margin-top: 7px;"
                                     class="list-item"
                                     [style.background-image]="item.selected ? 'linear-gradient(0deg, #2b79a7 0%, #4ebbfb 50%, #2b79a7 100%)' : null"
                                     [style.color]="item.selected ? 'white' : 'black'"
                                     (click)="selectEakteRow(item)">
                                    <div style="width: 20%; text-align: center; margin: auto 0"
                                         class="ellipsis">{{item.date}}</div>
                                    <div style="width: 39%; margin: auto 0" class="ellipsis">{{item.document}}</div>
                                    <div style="width: 10%; margin: auto 0" class="ellipsis">{{item.am}}</div>
                                    <div style="width: 10%; margin: auto 0" class="ellipsis">{{item.hinweis}}</div>
                                    <div style="width: 10%; margin: auto 0" class="ellipsis">{{item.vordruck}}</div>
                                    <div style="width: 11%; margin: auto 0" class="ellipsis">{{item.user}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div style="width: 50%; height: 100%; padding: 15px 20px 0 30px;">
                        <iframe [src]="selectedEakteRowPDF" width="100%" height="100%"
                                class="pdf-container-style"></iframe>
                    </div>
                </div>
            </ng-container>
        </div>

        <div class="modal" id="modal-1">
            <div class="modal-content">

                <div class="modal-header" style="display: flex">
                    <div style="width: 50%">
                        <h3>Assigning User</h3>
                    </div>
                </div>

                <div class="modal-body">
                    <div class="field">
                        <label for="users" class="label">Users</label>
                        <select class="dropdown">
                            <option *ngFor="let user of users"
                                    [value]="user.UserGUID">{{user.FirstName}}&nbsp;{{user.LastName}}</option>
                        </select>
                    </div>
                    <div class="field">
                        <label for="description-max">Notes</label>
                        <textarea class="userNotes" class="textarea"></textarea>
                    </div>
                </div>
            </div>
        </div>
    `,
    styles: [`
        .parent-layout {
            display: grid;
            grid-template-rows: auto 1fr;
            height: 100%;
        }

        .icon-row {
            padding-top: 10px;
            padding-bottom: 10px;
            background-image: linear-gradient(0deg, #2b79a7 0%, #4ebbfb 50%, #2b79a7 100%);
            color: white;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
            text-align: center;
        }

        .header-label {
            text-align: center;
            margin-top: 5px;
            letter-spacing: 1px;
            -webkit-transform: scale(1, 1.5); /* chrome and safari */
            -moz-transform: scale(1, 1.5); /* opera */
        }

        .grid-header {
            /*width: calc(100% - 8px); !*excluding scroller width*! */
            width: 100%;
            display: flex;
            color: #909090;
            cursor: pointer;
        }

        .main-menu-icon-image {
            filter: invert(87%) sepia(98%) saturate(1%) hue-rotate(268deg) brightness(109%) contrast(97%);
            width: 50px;
        }

        .pdf-container-style {
            box-shadow: 0 10px 6px -6px #777;
        }

        .list-item:hover {
            box-shadow: 0 0 11px rgba(33, 33, 33, .2);
        }

        .setFocus {
            filter: invert(87%) sepia(98%) saturate(1%) hue-rotate(268deg) brightness(109%) contrast(97%);
        }

        .sort {
            width: 12px;
            margin-bottom: -3px;
            margin-left: 2px;
            opacity: 0.5;
        }

        .form-container {
            padding: 10px;
            display: grid;
            grid-template-columns: 1fr auto auto;
            gap: 1rem;
            background-color: white;
            height: 100%;
            box-shadow: 0 10px 6px -6px #777;
        }

        .form-fields-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
        }

        .smaller-text-field {
            font-size: 13px;
            height: 20px;
            width: 80%;
        }

        .push-to-bottom {
            display: grid;
            grid-template-rows: 1fr auto;
            gap: 1rem;
        }

        .outlined-button {
            width: 100%;
            border: 2px solid #2678a9;
            padding: 3px 6px;
            color: #2678a9;
            border-radius: 5px;
        }

        .outlined-button:hover {
            background-color: #2678a9;
            color: white;
        }

        .disabled-button {
            width: 100%;
            border: 2px solid #eeeeee;
            padding: 3px 6px;
            color: #ababab;
            border-radius: 5px;
            background-color: #eeeeee;
            cursor: auto;
        }

        .filled-button {
            width: 100%;
            border: 2px solid #2678a9;
            padding: 3px 6px;
            color: white;
            border-radius: 5px;
            background-color: #2678a9;
        }

        .filled-button:hover {
            background-color: white;
            color: cornflowerblue;
        }

        .ellipsis {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .search-icon {
            background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iYmxhY2siIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTUuNSAxNGgtLjc5bC0uMjgtLjI3QzE1LjQxIDEyLjU5IDE2IDExLjExIDE2IDkuNSAxNiA1LjkxIDEzLjA5IDMgOS41IDNTMyA1LjkxIDMgOS41IDUuOTEgMTYgOS41IDE2YzEuNjEgMCAzLjA5LS41OSA0LjIzLTEuNTdsLjI3LjI4di43OWw1IDQuOTlMMjAuNDkgMTlsLTQuOTktNXptLTYgMEM3LjAxIDE0IDUgMTEuOTkgNSA5LjVTNy4wMSA1IDkuNSA1IDE0IDcuMDEgMTQgOS41IDExLjk5IDE0IDkuNSAxNHoiLz48L3N2Zz4=") no-repeat right;
        }

        .progress {
            margin: 0 !important;
        }

        .lds-spinner {
            display: inline-block;
            position: relative;
            width: 40px;
            height: 40px;
        }

        .lds-spinner div {
            transform-origin: 40px 40px;
            animation: lds-spinner 1.2s linear infinite;
        }

        .lds-spinner div:after {
            content: " ";
            display: block;
            position: absolute;
            top: 15px;
            left: 38px;
            width: 3px;
            height: 15px;
            border-radius: 20%;
            background: linear-gradient(0deg, #2b79a7 0%, #4ebbfb 50%, #2b79a7 100%);
        }

        .lds-spinner div:nth-child(1) {
            transform: rotate(0deg);
            animation-delay: -1.1s;
        }

        .lds-spinner div:nth-child(2) {
            transform: rotate(30deg);
            animation-delay: -1s;
        }

        .lds-spinner div:nth-child(3) {
            transform: rotate(60deg);
            animation-delay: -0.9s;
        }

        .lds-spinner div:nth-child(4) {
            transform: rotate(90deg);
            animation-delay: -0.8s;
        }

        .lds-spinner div:nth-child(5) {
            transform: rotate(120deg);
            animation-delay: -0.7s;
        }

        .lds-spinner div:nth-child(6) {
            transform: rotate(150deg);
            animation-delay: -0.6s;
        }

        .lds-spinner div:nth-child(7) {
            transform: rotate(180deg);
            animation-delay: -0.5s;
        }

        .lds-spinner div:nth-child(8) {
            transform: rotate(210deg);
            animation-delay: -0.4s;
        }

        .lds-spinner div:nth-child(9) {
            transform: rotate(240deg);
            animation-delay: -0.3s;
        }

        .lds-spinner div:nth-child(10) {
            transform: rotate(270deg);
            animation-delay: -0.2s;
        }

        .lds-spinner div:nth-child(11) {
            transform: rotate(300deg);
            animation-delay: -0.1s;
        }

        .lds-spinner div:nth-child(12) {
            transform: rotate(330deg);
            animation-delay: 0s;
        }

        @keyframes lds-spinner {
            0% {
                opacity: 1;
            }
            100% {
                opacity: 0;
            }
        }
    `]
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDFComponent implements OnInit, IWidgetComponent {
    @Input() widgetContext: IWidgetContext;
    @Input() widgetInstance: IWidgetInstance;

    @HostListener('document:keydown', ['$event'])
    keypress(e: KeyboardEvent) {
        this.onKeyPress(e);
    }

    assets = assets;
    jQueryElement?: JQuery; //Reference to JQuery
    $ = $;
    checkMark: SafeHtml;

    topMenuItems: MainMenuItem;
    sampleListItems: ListItem[] = [];
    verticalItems: VerticalListItem[];
    lastSortAction: { property: string, direction: 'asc' | 'desc' };

    sortIcon: SafeHtml;

    selectedRow: ListItem;
    selectedRowUrl: SafeUrl;

    showForm = false;

    showEakte = false;
    sampleEakteItems: EakteListItem[]
    selectedEakteRow: EakteListItem;
    selectedEakteRowPDF: SafeUrl;

    token: string;
    loggedInuserData: any;

    // FOR WEITERLEITEN
    users: UsersList[] = [];
    selectedUserGUID: string;

    parallelProcessing = false;
    inProgress = false;
    error = false;
    percentage = 1;

    constructor(private readonly changeDetectionRef: ChangeDetectorRef,
                private fb: FormBuilder,
                private ds: DomSanitizer,
                private http: HttpClient) {
        setTimeout(() => {
            // @ts-ignore
            $('body').initialize('en-US');
        }, 200);
    }

    ngOnInit() {
        this.changeDetectionRef.markForCheck();
        this.checkMark = this.ds.bypassSecurityTrustUrl(assets.tick);
        this.sortIcon = this.ds.bypassSecurityTrustUrl(assets.sort);

        this.initializeHardcodeData();
        this.prepareData().catch();
    }

    // getSafeUrl(url: string) {
    //     return this.ds.bypassSecurityTrustResourceUrl(url);
    // }

    async prepareData() {
        if (this.inProgress) {
            console.log('operation already in progress');
            return;
        }
        this.inProgress = true;
        this.error = false;
        this.percentage = 0;

        // this.token = await this.refreshToken();
        /** GENERATING TOKEN **/
        try {
            this.token = await this.http.get("https://mingle-extensions.eu1.inforcloudsuite.com/grid/rest/security/sessions/oauth", {responseType: 'text'}).toPromise();
            console.log('token is ', this.token);
        } catch (err) {
            this.inProgress = false;
            this.error = true;
            console.error('prepareData: Error getting token.', err);
            return;
        }

        /** GETTING LOGGED IN USER DATA/GUID **/
        try {
            const apiResponse: any = await this.http.get('https://mingle-ionapi.eu1.inforcloudsuite.com/FELLOWCONSULTING_DEV/Mingle/api/v1/mingle/go/User/Detail', {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                })
            }).toPromise();
            this.loggedInuserData = apiResponse.UserDetailList[0];
            console.log('Logged In user data is ', this.loggedInuserData);
        } catch (err) {
            this.inProgress = false;
            this.error = true;
            console.error('prepareData: Error getting user detail list.', err);
            return;
        }

        /** GETTING LIST OF USERS FOR WEITERLEITEN **/
        this.http.get("https://mingle-ionapi.eu1.inforcloudsuite.com/FELLOWCONSULTING_DEV/Mingle/SocialService.Svc/User/a9c53b43-fa50-4913-9978-6889b2a80874/AllUsers", {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`
            })
        }).toPromise().then((apiResponse: any) => {
            this.users = apiResponse.UserDetailList;
            console.log('WEITERLEITEN: Users are ', this.users);
        }).catch(err => {
            console.error('WEITERLEITEN: Error while fetching users.', err);
        });

        if (this.parallelProcessing) {
            this.ParallelTaskCalls();
        } else {
            this.SeriesTaskCalls();
        }
    }

    async ParallelTaskCalls() {
        /** GETTING LISTS OF TASKS **/
        let tasks: any;
        try {
            tasks = await this.http.post(`https://mingle-ionapi.eu1.inforcloudsuite.com/FELLOWCONSULTING_DEV/Mingle/IONDataService.Svc/User/${this.loggedInuserData.UserGUID}/MingleFeeds`, tasksAPIPayload, {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                })
            }).toPromise();
        } catch (err) {
            this.inProgress = false;
            this.error = true;
            console.error('Error while fetching tasks.', err);
            $('body').toast({title: 'Error', message: 'Error while fetching tasks.'});
            return;
        }

        console.log('All tasks are ', tasks);
        this.sampleListItems = [];

        /** FETCHING DOC URL AND ALL OTHER DATA OF TASKS TO SHOW IN MAIN GRID **/
        if (tasks.Feeds.length === 0) {
            this.error = false;
            this.inProgress = false;
        }

        let errorCount = 0;
        for (let task of tasks.Feeds) {
            console.log('***** PROCESSING TASKID - ', task.MsgId);

            this.http.get('https://mingle-ionapi.eu1.inforcloudsuite.com/FELLOWCONSULTING_DEV/IONSERVICES/process/user/v1/task/' + task.MsgId, {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                })
            }).toPromise().then((taskDetail: any) => {
                console.log('Task detail for TASKID ', task.MsgId, ' is ', taskDetail);
                const query = taskDetail.parameters.filter((s: any) => s.name === 'Query')[0];

                if (!query || !query.serializedValue) {
                    console.error('Query|Serialized Value for TASKID ', task.MsgId, ' not found.');
                } else {
                    console.log('Serialized value for TASKID ', task.MsgId, ' is ', query.serializedValue);

                    this.http.get('https://mingle-ionapi.eu1.inforcloudsuite.com/FELLOWCONSULTING_DEV/IDM/api/items/search?$query=' + query.serializedValue + '&$offset=0&$limit=1&$includeCount=true', {
                        headers: new HttpHeaders({
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${this.token}`
                        })
                    }).toPromise().then((searchItemDoc: any) => {
                        console.log('Search item doc for TASKID ', task.MsgId, ' is ', searchItemDoc);
                        try {
                            task.kassenzeichen = searchItemDoc.items.item[0].attrs.attr.filter(
                                (val: any) => val.name === 'Kassenzeichen'
                            )[0].value;
                            console.log('Kassenzeichen fetched for TASKID ', task.MsgId, ' is ', task.kassenzeichen);
                        } catch (err) {
                            task.kassenzeichen = null;
                            console.error('Kassenzeichen for TASKID ', task.MsgId, ' not found.');
                        }
                        try {
                            task.pid = searchItemDoc.items.item[0].pid;
                            task.filename = searchItemDoc.items.item[0].filename;
                            task.aclId = searchItemDoc.items.item[0].acl.id;
                            task.aclName = searchItemDoc.items.item[0].acl.name;
                            task.url = searchItemDoc.items.item[0].resrs.res.filter((val: any) => val.mimetype === 'application/pdf')[0].url;
                            console.log('URL fetched for TASKID ', task.MsgId, ' is ', task.url);

                            task.sender = searchItemDoc.items.item[0].attrs.attr.filter(
                                (val: any) => val.name === 'Absender'
                            )[0].value;
                            console.log('Absender fetched for TASKID ', task.MsgId, ' is ', task.sender);

                            task.date = searchItemDoc.items.item[0].attrs.attr.filter(
                                (val: any) => val.name === 'Datum'
                            )[0].value;
                            console.log('Date fetched for TASKID ', task.MsgId, ' is ', task.date);

                            task.entrance = searchItemDoc.items.item[0].attrs.attr.filter(
                                (val: any) => val.name === 'Eingangsdatum'
                            )[0].value;
                            console.log('Eingangdatum (entrance) fetched for TASKID ', task.MsgId, ' is ', task.entrance);

                            const fullName = taskDetail.distributionUsers[taskDetail.distributionUsers.length - 1].fullName;
                            task.firstName = fullName.split(' ')[0];
                            task.lastName = fullName.split(' ')[1];
                            console.log('First name fetched for TASKID ', task.MsgId, ' is ', task.firstName);
                            console.log('Last name fetched for TASKID ', task.MsgId, ' is ', task.lastName);

                        } catch (err) {
                            console.error('pid|url|sender|date|entrance|firstName|lastName for TASKID ', task.MsgId, ' not found.');
                        }

                        if (task.kassenzeichen) {
                            console.log('TASKID ', task.MsgId, ' is perfectly fine.');
                            this.inProgress = false;
                            this.error = false;
                            this.sampleListItems.push({
                                index: this.sampleListItems.length,
                                taskId: task.MsgId,
                                checked: false,
                                date: task.date,
                                sender: task.sender,
                                cashRegister: task.kassenzeichen,
                                lastName: task.lastName,
                                firstName: task.firstName,
                                entrance: task.entrance,
                                selected: this.sampleListItems.length === 0 ? true : false,
                                url: task.url,
                                pid: task.pid,
                                aclId: task.aclId,
                                aclName: task.aclName,
                                fileName: task.filename
                            });
                            // will select first row
                            if (this.sampleListItems.length === 1) {
                                this.selectRow(this.sampleListItems[0]);
                            }
                            console.log(this.sampleListItems);
                        } else {
                            console.log('TASKID ', task.MsgId, ' has been rejected finally.');
                        }
                    }).catch(err => {
                        console.error('Error getting search item doc for TASKID ', task.MsgId, err);
                    });
                }
            }).catch(err => {
                errorCount = errorCount + 1;
                if (errorCount === tasks.Feeds.length) {
                    // services unavailable
                    this.error = true;
                    this.inProgress = false;
                }
                console.error('Error getting task detail for TASKID ', task.MsgId, err);
            });
        }
    }

    async SeriesTaskCalls() {
        this.inProgress = true;
        this.error = false;
        this.sampleListItems = [];

        this.updateProgress(4);
        /** GETTING LISTS OF TASKS **/
        let tasks: any;
        try {
            tasks = await this.http.post(`https://mingle-ionapi.eu1.inforcloudsuite.com/FELLOWCONSULTING_DEV/Mingle/IONDataService.Svc/User/${this.loggedInuserData.UserGUID}/MingleFeeds`, tasksAPIPayload, {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                })
            }).toPromise();
        } catch (err) {
            this.inProgress = false;
            this.error = true;
            console.error('Error while fetching tasks.', err);
            $('body').toast({title: 'Error', message: 'Error while fetching tasks.'});
            return;
        }
        this.updateProgress(10);

        console.log('All tasks are ', tasks);

        const perTaskPercentage = 90 / tasks.Feeds.length;

        for (let task of tasks.Feeds) {
            this.updateProgress(this.percentage + perTaskPercentage);

            console.log('***** PROCESSING TASKID - ', task.MsgId);

            let taskDetail: any;
            try {
                taskDetail = await this.http.get('https://mingle-ionapi.eu1.inforcloudsuite.com/FELLOWCONSULTING_DEV/IONSERVICES/process/user/v1/task/' + task.MsgId, {
                    headers: new HttpHeaders({
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${this.token}`
                    })
                }).toPromise();
            } catch (err) {
                console.error('Error getting task detail for TASKID ', task.MsgId, err);
            }
            if (!taskDetail) {
                console.log('Task detail for TASKID ', task.MsgId, ' not found.');
            } else {
                console.log('Task detail for TASKID ', task.MsgId, ' is ', taskDetail);
                const query = taskDetail.parameters.filter((s: any) => s.name === 'Query')[0];

                if (!query || !query.serializedValue) {
                    console.error('Query|Serialized Value for TASKID ', task.MsgId, ' not found.');
                } else {
                    console.log('Serialized value for TASKID ', task.MsgId, ' is ', query.serializedValue);

                    let searchItemDoc: any;
                    try {
                        searchItemDoc = await this.http.get('https://mingle-ionapi.eu1.inforcloudsuite.com/FELLOWCONSULTING_DEV/IDM/api/items/search?$query=' + query.serializedValue + '&$offset=0&$limit=1&$includeCount=true', {
                            headers: new HttpHeaders({
                                'Content-Type': 'application/json',
                                'Authorization': `Bearer ${this.token}`
                            })
                        }).toPromise();
                        console.log('Search item doc for TASKID ', task.MsgId, ' is ', searchItemDoc);
                        try {
                            task.kassenzeichen = searchItemDoc.items.item[0].attrs.attr.filter(
                                (val: any) => val.name === 'Kassenzeichen'
                            )[0].value;
                            console.log('Kassenzeichen fetched for TASKID ', task.MsgId, ' is ', task.kassenzeichen);
                        } catch (err) {
                            task.kassenzeichen = null;
                            console.error('Kassenzeichen for TASKID ', task.MsgId, ' not found.');
                        }
                        try {
                            task.pid = searchItemDoc.items.item[0].pid;
                            task.filename = searchItemDoc.items.item[0].filename;
                            task.aclId = searchItemDoc.items.item[0].acl.id;
                            task.aclName = searchItemDoc.items.item[0].acl.name;
                            task.url = searchItemDoc.items.item[0].resrs.res.filter((val: any) => val.mimetype === 'application/pdf')[0].url;
                            console.log('URL fetched for TASKID ', task.MsgId, ' is ', task.url);

                            task.sender = searchItemDoc.items.item[0].attrs.attr.filter(
                                (val: any) => val.name === 'Absender'
                            )[0].value;
                            console.log('Absender fetched for TASKID ', task.MsgId, ' is ', task.sender);

                            task.date = searchItemDoc.items.item[0].attrs.attr.filter(
                                (val: any) => val.name === 'Datum'
                            )[0].value;
                            console.log('Date fetched for TASKID ', task.MsgId, ' is ', task.date);

                            task.entrance = searchItemDoc.items.item[0].attrs.attr.filter(
                                (val: any) => val.name === 'Eingangsdatum'
                            )[0].value;
                            console.log('Eingangdatum (entrance) fetched for TASKID ', task.MsgId, ' is ', task.entrance);

                            task.firstname = searchItemDoc.items.item[0].attrs.attr.filter(
                                (val: any) => val.name === "Schuldnername"
                            )[0].value;
                            console.log('Firstname fetched for TASKID ', task.MsgId, ' is ', task.firstname);

                            task.lastname = searchItemDoc.items.item[0].attrs.attr.filter(
                                (val: any) => val.name === "Schuldnervorname"
                            )[0].value;
                            console.log('Lastname fetched for TASKID ', task.MsgId, ' is ', task.lastname);

                        } catch (err) {
                            console.error('pid|url|sender|date|entrance|firstName|lastName for TASKID ', task.MsgId, ' not found.');
                        }

                        if (task.kassenzeichen) {
                            console.log('TASKID ', task.MsgId, ' is perfectly fine.');
                            this.sampleListItems.push({
                                index: this.sampleListItems.length,
                                taskId: task.MsgId,
                                checked: false,
                                date: task.date,
                                sender: task.sender,
                                cashRegister: task.kassenzeichen,
                                lastName: task.lastname,
                                firstName: task.firstname,
                                entrance: task.entrance,
                                selected: this.sampleListItems.length === 0 ? true : false,
                                url: task.url,
                                pid: task.pid,
                                aclId: task.aclId,
                                aclName: task.aclName,
                                fileName: task.filename
                            });
                            // will select first row
                            if (this.sampleListItems.length === 1) {
                                this.selectRow(this.sampleListItems[0]);
                            }
                            console.log(this.sampleListItems);
                        } else {
                            console.log('TASKID ', task.MsgId, ' has been rejected finally.');
                        }
                    } catch (err) {
                        console.error('Error getting search item doc for TASKID ', task.MsgId, err);
                    }
                }
            }
        }
        this.inProgress = false;
    }

    updateProgress(progress: number) {
        this.percentage = progress;
        if ($('#progress-bar1').data('progress')) {
            $('#progress-bar1').data('progress').update(progress.toString());
        }
    }

    fetchEakteData() {
        if (this.selectedRow) {
            // fetch eakte data
            const url = `https://mingle-ionapi.eu1.inforcloudsuite.com/FELLOWCONSULTING_DEV/IDM/api/items/search?%24query=%2FEMA_Returns%5B%40Kassenzeichen%20%3D%20%22${this.selectedRow.cashRegister}%22%20AND%20%40Validiert_bool%20IS%20NOT%20NULL%20%5D&%24offset=0&%24limit=1000&%24includeCount=true&%24language=en-US`
            console.log('fetching eakte data from ', url);
            this.http.get(url, {
                headers: new HttpHeaders({
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${this.token}`
                })
            }).toPromise().then((apiResponse: any) => {
                console.log('eakte data is ', apiResponse);
                this.sampleEakteItems = [];
                apiResponse.items?.item?.forEach((val: any, index: number) => {
                    this.sampleEakteItems.push({
                        user: val.createdByName,
                        document: val.displayName,
                        vordruck: val.id,
                        hinweis: val.version,
                        am: val.pid,
                        date: new Date(val.createdTS).toLocaleString('de'),
                        index: index,
                        selected: index === 0 ? true : false,
                        pdfLink: val.resrs.res[0].url ? val.resrs.res[0].url : null
                    });
                });
                if (this.sampleEakteItems.length > 0) {
                    this.selectEakteRow(this.sampleEakteItems[0]);
                }
            }).catch(err => {
                console.error('Error getting eakte data.', err);
            });
        } else {
            $('body').toast({
                title: 'Error',
                message: 'No task is selected, please first select task to fetch eakte data.'
            });
        }
    }

    selectRow(item: ListItem) {
        if (this.selectedRow && this.selectedRow.index === item.index) {
            return;
        }
        this.selectedRow = JSON.parse(JSON.stringify(item));
        this.sampleListItems.forEach(val => {
            val.selected = false;
            if (val.index === item.index) {
                val.selected = true;
            }
        });
        this.selectedRowUrl = this.ds.bypassSecurityTrustResourceUrl(this.selectedRow.url);
        console.log('Selected row is ', this.selectedRow);
    }

    selectEakteRow(item: EakteListItem) {
        this.selectedEakteRow = JSON.parse(JSON.stringify(item));
        this.selectedEakteRowPDF = this.ds.bypassSecurityTrustResourceUrl(this.selectedEakteRow.pdfLink)
        this.sampleEakteItems.forEach(val => {
            val.selected = false;
            if (val.index === item.index) {
                val.selected = true;
            }
        });
    }

    editForm() {
        if (this.selectedRow && !this.showEakte) {
            this.showForm = true;
        }
    }

    isFormValid() {
        return (!!this.selectedRow.sender.trim() &&
            !!this.selectedRow.cashRegister.trim() &&
            !!this.selectedRow.firstName.trim() &&
            !!this.selectedRow.lastName.trim() &&
            !!this.selectedRow.entrance.trim() &&
            !!this.selectedRow.fileName.trim())
    }

    saveForm() {
        const FormAttributesUpdateBody: any = {
            item: {
                attrs: {
                    attr: [
                        {
                            name: 'Datum',
                            value: this.selectedRow.date.trim()
                        },
                        {
                            name: 'Absender',
                            value: this.selectedRow.sender.trim()
                        }, {
                            name: 'Kassenzeichen',
                            value: this.selectedRow.cashRegister.trim()
                        }, {
                            name: 'Eingangsdatum',
                            value: this.selectedRow.entrance.trim()
                        }, {
                            name: 'Schuldnername',
                            value: this.selectedRow.firstName.trim()
                        }, {
                            name: 'Schuldnervorname',
                            value: this.selectedRow.lastName.trim()
                        }]
                },
                resrs: {
                    res: []
                },
                acl: {
                    name: this.selectedRow.aclName
                },
                pid: this.selectedRow.pid
            }
        }

        console.log('attrArray to update is ', FormAttributesUpdateBody);

        this.http.put(`https://mingle-ionapi.eu1.inforcloudsuite.com/FELLOWCONSULTING_DEV/IDM/api/items/${this.selectedRow.pid}?%24checkout=true&%24checkin=true&%24merge=true`, FormAttributesUpdateBody, {
            responseType: 'text',
            headers: new HttpHeaders({
                'accept': 'application/xml;charset=utf-8',
                'Content-Type': 'application/json;charset=utf-8',
                'Authorization': `Bearer ${this.token}`,
            })
        }).toPromise().then((formAttributesUpdateApiResponse: any) => {
            console.log('form attributes updated ', formAttributesUpdateApiResponse);
            $('body').toast({title: 'Success', message: 'Successfully updated form attributes.'});
            this.sampleListItems.forEach((row, index) => {
                if (row.index === this.selectedRow.index) {
                    this.sampleListItems[index] = JSON.parse(JSON.stringify(this.selectedRow));
                }
            })
        }).catch(err => {
            console.error('Error while updating form attributes.', err);
            $('body').toast({title: 'Error', message: 'Error while updating form attributes.'});
        });
    }

    sortListBy(property: string) {
        let targetOrder: 'asc' | 'desc' = 'asc';
        if (this.lastSortAction && this.lastSortAction.property === property) {
            targetOrder = this.lastSortAction.direction === 'asc' ? 'desc' : 'asc';
        }
        this.lastSortAction = {
            property: property,
            direction: targetOrder
        };
        console.log(`Sorting by ${property} in ${targetOrder} order.`);
        this.sampleListItems.sort((a: any, b: any) => {
            if (targetOrder === 'asc') {
                return a[property] > b[property] ? 1 : -1;
            }
            return a[property] < b[property] ? 1 : -1;
        });
    }

    private onKeyPress(event: KeyboardEvent) {
        /* ************************************************* KEYDOWN ************************************************/
        if (event.key === 'ArrowDown') {
            if (this.showEakte && !this.selectedEakteRow) { // you're on eakte page
                this.sampleEakteItems[0].selected = true;
                this.selectedEakteRow = JSON.parse(JSON.stringify(this.sampleEakteItems[0]));
                return;
            }
            if (!this.showEakte && !this.selectedRow) { // you're on main page
                this.sampleListItems[0].selected = true;
                this.selectedRow = JSON.parse(JSON.stringify(this.sampleListItems[0]));
                return;
            }
            if (!this.showEakte) {
                const indexOfSelectedRow = this.sampleListItems.findIndex((item: ListItem) => item.index === this.selectedRow.index);
                if (this.sampleListItems[indexOfSelectedRow + 1]) {
                    this.sampleListItems[indexOfSelectedRow].selected = false
                    this.sampleListItems[indexOfSelectedRow + 1].selected = true
                    this.selectedRow = JSON.parse(JSON.stringify(this.sampleListItems[indexOfSelectedRow + 1]));
                }
                // if form is displayed than start scrolling after 5 items
                // if no form editing page is on screen, start scrolling after 10 items
                if (this.showForm ? indexOfSelectedRow < 5 : indexOfSelectedRow < 10) {
                    event.preventDefault();
                }
                return;
            }
            if (this.showEakte) {
                const indexOfSelectedRow = this.sampleEakteItems.findIndex((item: EakteListItem) => item.index === this.selectedEakteRow.index);
                if (this.sampleEakteItems[indexOfSelectedRow + 1]) {
                    this.sampleEakteItems[indexOfSelectedRow].selected = false
                    this.sampleEakteItems[indexOfSelectedRow + 1].selected = true
                    this.selectedEakteRow = JSON.parse(JSON.stringify(this.sampleEakteItems[indexOfSelectedRow + 1]));
                }
                // scroll only if selected row index is greater than five
                if (indexOfSelectedRow < 10) {
                    event.preventDefault();
                }
                return;
            }
        }
        /* ************************************************* KEYUP ************************************************/
        if (event.key === 'ArrowUp') {
            if (!this.showEakte && !this.selectedRow) {
                return;
            }
            if (this.showEakte && !this.selectedEakteRow) {
                return;
            }
            if (!this.showEakte) {
                const indexOfSelectedRow = this.sampleListItems.findIndex((item: ListItem) => item.index === this.selectedRow.index);
                if (this.sampleListItems[indexOfSelectedRow - 1]) {
                    this.sampleListItems[indexOfSelectedRow].selected = false;
                    this.sampleListItems[indexOfSelectedRow - 1].selected = true;
                    this.selectedRow = JSON.parse(JSON.stringify(this.sampleListItems[indexOfSelectedRow - 1]));
                }
                if (this.showForm ? indexOfSelectedRow > this.sampleListItems.length - 5 : indexOfSelectedRow > this.sampleListItems.length - 10) {
                    event.preventDefault();
                }
                return;
            }
            if (this.showEakte) {
                const indexOfSelectedRow = this.sampleEakteItems.findIndex((item: EakteListItem) => item.index === this.selectedEakteRow.index);
                if (this.sampleEakteItems[indexOfSelectedRow - 1]) {
                    this.sampleEakteItems[indexOfSelectedRow].selected = false;
                    this.sampleEakteItems[indexOfSelectedRow - 1].selected = true;
                    this.selectedEakteRow = JSON.parse(JSON.stringify(this.sampleEakteItems[indexOfSelectedRow - 1]));
                }
                if (indexOfSelectedRow > this.sampleEakteItems.length - 10) {
                    event.preventDefault();
                }
                return;
            }
        }
        /* ************************************************* CTRL + E ************************************************/
        if (event.ctrlKey && event.keyCode == 69 && !this.showEakte) {
            // open form editor
            if (this.selectedRow) {
                this.showForm = true;
                event.preventDefault(); // preventing default browser behavior on ctrl + E
            }
            return;
        }
        /* ************************************************* CTRL + A ************************************************/
        if (event.ctrlKey && event.keyCode == 65 && !this.showEakte) {
            // check the row
            if (this.selectedRow) {
                this.sampleListItems.forEach(row => {
                    if (row.index === this.selectedRow.index) {
                        row.checked = true;
                    }
                })
            }
            return;
        }
        /* ************************************************* CTRL + X ************************************************/
        if (event.ctrlKey && event.keyCode == 88 && !this.showEakte) {
            // uncheck the row
            if (this.selectedRow) {
                this.sampleListItems.forEach(row => {
                    if (row.index === this.selectedRow.index) {
                        row.checked = false;
                    }
                })
            }
            return;
        }
        /* ************************************************* CTRL + K ************************************************/
        if (event.ctrlKey && event.keyCode == 75) {
            // open eakte form
            if (!this.showEakte) {
                this.showEakte = true;
            }
            event.preventDefault(); // ctrl + K shift focus on browser search bar
            return;
        }
        /* ************************************************* ESC ************************************************/
        if (event.key === 'Escape') {
            if (this.showForm) {
                this.showForm = false;
            }
            if (this.showEakte) {
                this.showEakte = false;
            }
        }
    }

    private getMetadata(): IWidgetSettingMetadata[] {
        // For known/hardcoded values, place the metadata in the manifest instead.
        return [{
            type: WidgetSettingsType.selectorType,
            name: "order",
        }];
    }

    initializeHardcodeData() {
        this.topMenuItems = {
            AKTUALISIEREN: {icon: this.ds.bypassSecurityTrustUrl(assets.aktualisieren), label: 'AKTUALISIEREN '},
            WEITERLEITEN: {icon: this.ds.bypassSecurityTrustUrl(assets.weiterleiten), label: 'WEITERLEITEN'},
            TRENNEN: {icon: this.ds.bypassSecurityTrustUrl(assets.trennen), label: 'TRENNEN'},
            // {icon: this.ds.bypassSecurityTrustUrl(assets.print), label: 'SORTIEREN'},
            BEARBEITEN: {icon: this.ds.bypassSecurityTrustUrl(assets.bearbeiten), label: 'BEARBEITEN'},
            // {icon: this.ds.bypassSecurityTrustUrl(assets.rounded_corner), label: 'FUNKTIONEN'},
            EAKTE: {icon: this.ds.bypassSecurityTrustUrl(assets.eakte), label: 'EAKTE'},
            HWSCXS: {icon: this.ds.bypassSecurityTrustUrl(assets.hwscxs), label: 'HWS/CXS'},
        };
        this.verticalItems = [
            {date: '12.12.2020', rollover: false},
            {date: '26.10.2020', rollover: false},
            {date: '12.12.2020', rollover: false}
        ];
        /*this.sampleListItems = [
            {
                index: 0,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Testfall',
                firstName: 'Hugo',
                entrance: 'Unbekannt',
                selected: true
            },
            {
                index: 1,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 2281000499873,
                lastName: 'Gips',
                firstName: 'Armin',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 2,
                checked: false,
                date: "01.02.2020",
                sender: '4401ab15',
                cashRegister: 5011300270874,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Rucklauf ZS',
                selected: false
            },
            {
                index: 3,
                checked: true,
                date: "01.02.2020",
                sender: '4401ab15',
                cashRegister: 1222800396875,
                lastName: 'Nette',
                firstName: 'Marion',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 4,
                checked: true,
                date: "01.02.2020",
                sender: '4401ab15',
                cashRegister: 1401900079876,
                lastName: 'Panse',
                firstName: 'Jim',
                entrance: 'Rucklauf EMA',
                selected: false
            },
            {
                index: 5,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784877,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 6,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784878,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 7,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784879,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 8,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784880,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 9,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784881,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 10,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784882,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 11,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784883,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 12,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784884,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 13,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784885,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 14,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784886,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 15,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784887,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 16,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784888,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 17,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784889,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 18,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784890,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 19,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784891,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 20,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784892,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 21,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784893,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 22,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784894,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 23,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784895,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 24,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784896,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            },
            {
                index: 25,
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784897,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt',
                selected: false
            }
        ];*/
        /*this.sampleEakteItems = [
            {
                index: 0,
                date: '13.09.2017 16:21:00',
                document: 'MA - Mabaang',
                am: '',
                hinweis: '',
                vordruck: '101',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: true
            }, {
                index: 1,
                date: '13.09.2017 16:21:00',
                document: 'ZV - Ancodanng Zelnsemg Beare',
                am: '',
                hinweis: '',
                vordruck: '102',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 2,
                date: '13.09.2017 16:21:00',
                document: 'ZV - Aameddang Ivenqrernceenaagreeciahere',
                am: '',
                hinweis: '',
                vordruck: '103',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 3,
                date: '13.09.2017 16:21:00',
                document: 'ZV - Ancodanng Zelnsemg Beare',
                am: '',
                hinweis: '',
                vordruck: '104',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 4,
                date: '13.09.2017 16:21:00',
                document: 'PFA - Pitndang Fenncomt',
                am: '',
                hinweis: '',
                vordruck: '105',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 5,
                date: '13.09.2017 16:21:00',
                document: 'MA - Mabaang',
                am: '',
                hinweis: '',
                vordruck: '106',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 6,
                date: '13.09.2017 16:21:00',
                document: 'MA. Malang',
                am: '',
                hinweis: '',
                vordruck: '107',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 7,
                date: '13.09.2017 16:21:00',
                document: 'VGL. - Verpionh - Abichamag',
                am: '',
                hinweis: '',
                vordruck: '108',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 8,
                date: '13.09.2017 16:21:00',
                document: 'S - Abseorenmert  Geuprichenans',
                am: '',
                hinweis: '',
                vordruck: '109',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 9,
                date: '13.09.2017 16:21:00',
                document: 'SH - Losdhangsbeveliguag',
                am: '',
                hinweis: '',
                vordruck: '110',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 10,
                date: '13.09.2017 16:21:00',
                document: 'SH - Losdhangsbeveliguag',
                am: '',
                hinweis: '',
                vordruck: '111',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 11,
                date: '13.09.2017 16:21:00',
                document: 'GV. Maatang an ZVG - bean Eeamand gegen Sctuale-Lcoctang',
                am: '',
                hinweis: '',
                vordruck: '112',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 12,
                date: '13.09.2017 16:21:00',
                document: 'GV . Plaadungranfong - (AG Hiiechemn)',
                am: '',
                hinweis: '',
                vordruck: '113',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 13,
                date: '13.09.2017 16:21:00',
                document: 'B- Uabehanese Niederschiagung',
                am: '',
                hinweis: '',
                vordruck: '114',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 14,
                date: '13.09.2017 16:21:00',
                document: 'F. Peticchererce',
                am: '',
                hinweis: '',
                vordruck: '115',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 15,
                date: '13.09.2017 16:21:00',
                document: 'B- Cabeteuacte Niedcruchinguag',
                am: '',
                hinweis: '',
                vordruck: '116',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 16,
                date: '13.09.2017 16:21:00',
                document: 'MA - Mahamg',
                am: '',
                hinweis: '',
                vordruck: '117',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 17,
                date: '13.09.2017 16:21:00',
                document: 'S- Adrewenhenr',
                am: '',
                hinweis: '',
                vordruck: '118',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 18,
                date: '13.09.2017 16:21:00',
                document: 'MA. Maeung',
                am: '',
                hinweis: '',
                vordruck: '119',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 19,
                date: '13.09.2017 16:21:00',
                document: 'S- Adrementane',
                am: '',
                hinweis: '',
                vordruck: '120',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 20,
                date: '13.09.2017 16:21:00',
                document: 'S - Aad Saciengenshee Mahaendes =u Kz 160000988315 me Rascaraiiong',
                am: '',
                hinweis: '',
                vordruck: '121',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 21,
                date: '13.09.2017 16:21:00',
                document: 'Inhaltsverzeichnis drücken) (No Action on button)',
                am: '',
                hinweis: '',
                vordruck: '122',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 22,
                date: '13.09.2017 16:21:00',
                document: 'MA - Matmung - Rutencabfeng echt engeheben',
                am: '',
                hinweis: '',
                vordruck: '123',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 23,
                date: '13.09.2017 16:21:00',
                document: 'AVO - Anntiile Onereach',
                am: '',
                hinweis: '',
                vordruck: '124',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 24,
                date: '13.09.2017 16:21:00',
                document: 'TV',
                am: '',
                hinweis: '',
                vordruck: '125',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 25,
                date: '13.09.2017 16:21:00',
                document: '2 documents in preview alternatively as',
                am: '',
                hinweis: '',
                vordruck: '126',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 26,
                date: '13.09.2017 16:21:00',
                document: 'SH - Loechangsbewiligng',
                am: '',
                hinweis: '',
                vordruck: '127',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 27,
                date: '13.09.2017 16:21:00',
                document: 'Veer WV- Tere sortichgratetie FFOBs',
                am: '',
                hinweis: '',
                vordruck: '128',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 28,
                date: '13.09.2017 16:21:00',
                document: 'PFA - Pitndang Fenncomt',
                am: '',
                hinweis: '',
                vordruck: '129',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 29,
                date: '13.09.2017 16:21:00',
                document: 'EV - Ancedeng Zotnammag Brae',
                am: '',
                hinweis: '',
                vordruck: '130',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 30,
                date: '13.09.2017 16:21:00',
                document: 'Rasescabheng cht engehahen',
                am: '',
                hinweis: '',
                vordruck: '131',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 31,
                date: '13.09.2017 16:21:00',
                document: 'S - Altowrenpart | Geepréctneste:',
                am: '',
                hinweis: '',
                vordruck: '132',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 32,
                date: '13.09.2017 16:21:00',
                document: 'DFA - Pandey',
                am: '',
                hinweis: '',
                vordruck: '133',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 33,
                date: '13.09.2017 16:21:00',
                document: 'ANO . Amtibalie Onceveech',
                am: '',
                hinweis: '',
                vordruck: '134',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            },
            {
                index: 34,
                date: '13.09.2017 16:21:00',
                document: 'MA - Mabamng',
                am: '',
                hinweis: '',
                vordruck: '135',
                user: '4401mv13',
                pdfLink: 'https://www.muhammadbinyusrat.com/devguide.pdf',
                selected: false
            },
            {
                index: 35,
                date: '13.09.2017 16:21:00',
                document: 'OT - Oilatah Tedbewag',
                am: '',
                hinweis: '',
                vordruck: '136',
                user: '4401mv13',
                pdfLink: 'http://www.africau.edu/images/default/sample.pdf',
                selected: false
            }
        ]*/
    }

    openDialog() {
        if (!this.selectedRow) {
            $('body').toast({title: 'Error', message: 'Please select task first.'});
            return;
        }
        console.log('WEITERLEITEN: Users are ', this.users);

        $('select').on('selected', (event) => {
            // '.dropdown').val()
            this.selectedUserGUID = $('select').val().toString();
        });

        $('body').modal({
            content: $('#modal-1'),
            buttons: [{
                text: 'Close',
                click: function (e, modal) {
                    modal.close();
                }
            }, {
                text: 'Assign',
                click: async (e, modal) => {
                    /** DO YOUR STUFF HERE **/
                    const user: any = this.users.filter(user => user.UserGUID === this.selectedUserGUID)
                    console.log('selected user is ', user[0]);
                    console.log('notes value is ', $('textarea').val());
                    console.log('loggedIn user is ', this.loggedInuserData);
                    console.log('selected task is ', this.selectedRow);

                    this.http.post(`https://mingle-ionapi.eu1.inforcloudsuite.com/FELLOWCONSULTING_DEV/IONSERVICES/process/user/v1/task/${this.selectedRow.taskId}/addnote`, $('textarea').val().toString(), {
                        headers: new HttpHeaders({
                            'Content-Type': 'text/plain',
                            'Authorization': `Bearer ${this.token}`
                        })
                    }).toPromise().then((addNoteApiResponse: any) => {
                        console.log('note updated ', addNoteApiResponse);
                    }).catch(err => {
                        console.error('Error while updating note of task.', err);
                        $('body').toast({title: 'Error', message: 'Error while updating note of task.'});
                    });

                    this.http.post(`https://mingle-ionapi.eu1.inforcloudsuite.com/FELLOWCONSULTING_DEV/IONSERVICES/process/user/v1/task/${this.selectedRow.taskId}/assign/${user[0].UserId}`, {
                        headers: new HttpHeaders({
                            'Authorization': `Bearer ${this.token}`
                        })
                    }).toPromise().then((assignUserApiResponse: any) => {
                        console.log('user assigned ', assignUserApiResponse);
                    }).catch(err => {
                        console.error('Error while assigning user to task.', err);
                        $('body').toast({title: 'Error', message: 'Error while assigning user to task.'});
                    });
                    modal.close();
                }
            }],
            fullsize: 'responsive',
            overlayOpacity: 0.5
        });

        // $('.modal').on('beforeclose', function () {
        //     $('body').toast({title: 'Example Only', message: 'This Dialog May not be closed.'});
        //     return false;
        // });
    }

    /*async refreshToken() {
        // const url = 'https://mingle-sso.eu1.inforcloudsuite.com:443/FELLOWCONSULTING_DEV/as/token.oauth2';
        const config = {
            "ti": "FELLOWCONSULTING_DEV",
            "cn": "EAM API",
            "dt": "12",
            "ci": "FELLOWCONSULTING_DEV~1NEdTWXC2FsUzM1W8hie8gV5gHSm62y02GeH041FnxY",
            "cs": "Jn3qr3UklSDWAudfxIL7ooQYV64_2gCyAv5CkraPza1LeZU8j5i_YYMz95tNKK6z9RN0MPmUdILasD3qkS0tFQ",
            "iu": "https://mingle-ionapi.eu1.inforcloudsuite.com",
            "pu": "https://mingle-sso.eu1.inforcloudsuite.com:443/FELLOWCONSULTING_DEV/as/",
            "oa": "authorization.oauth2",
            "ot": "token.oauth2",
            "or": "revoke_token.oauth2",
            "ev": "V1480769020",
            "v": "1.0",
            "saak": "FELLOWCONSULTING_DEV#FMuw2CLqvumKgSGh0o9kMx_hJIMh5MA4LUYNXjK9Jb6af1RU6fvVdZTQduDwXe2U5p3vGJmNOtX1O-ixGjQSGA",
            "sask": "f__eJMNVTRM8I0R42Jo0nRhF8ZXCPqgKfYRfamauBaDm0lviDmUlbxTSVC5Z8Ya1BYBUca-zC4Goj3FRrkCR7A"
        };
        return await this.http.post(
            `${config.pu}${config.ot}`,
            {
                grant_type: "password",
                username: config.saak,
                password: config.sask,
                scope: ''
            },
            {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Bearer ' + btoa(`${config.ci}:${config.cs}`)
                }
            }).toPromise();
    }*/
}

@NgModule({
    imports: [CommonModule, SohoListViewModule, ReactiveFormsModule, FormsModule],
    declarations: [PDFComponent],
    entryComponents: [PDFComponent]
})
export class PdfModule {
}

/* **************************** */
/* Second Page (Vertical Items) - HTML */
/* **************************** */

/*
<ng-container *ngIf="currentTab == 2">
<div class="body-grid two-by-one">
<div class="vertical-items-container">
<div class="vertical-items">

<div *ngFor="let verticalItem of verticalItems;" class="vertical-item"
    [ngClass]="{'hover-shadow':verticalItem.rollover}"
(mouseover)="verticalItem.rollover = true" (mouseout)="verticalItem.rollover= false">
    <div>
        12.12.2020
</div>
<div></div>
<div class="vertical-item-details">
<div style="grid-row: 1/-1;margin-left: 10px; margin-top: 5px">
<img [src]="checkMark" width="30">
    </div>
    <div style="margin-top: 10px; grid-column: 2/4">Poststelle</div>
    <div style="margin-top: 10px;">3206002</div>
    <div style="grid-column: 5; grid-row: 1/span 2;margin-top: 5px;"><img
    [src]="pdfIcon"></div>

    <div>Reich</div>
    <div>Frank</div>
    <div>Unbekannt</div>
    </div>
    </div>
    </div>

    <div class="vertical-line">
    <div></div>
    <div style="background-color: #6a98b4;"></div>
    </div>

    </div>
    <div style="padding:10px 10px 20px 10px;">
<iframe src="https://idm.eu1.inforcloudsuite.com/ca/api/resources/EMA_Returns-1-3-LATEST?$token=Ac414kLBx8%2B3XhaqSrDU%2BrviwMjIIc75%2BPEZV%2FzaFJD3Ra4hftBfyAZZ9LT37Akov%2Fk37RsL568EiQC2OjRJos%2FXXORP%2FpZ0%2FCcV%2FYUxzb%2FCFt5hfPWSndG%2FKayn8OvupnfKltkP09C7Gi2BarJrKuKrpmFDdJ5g43sF5m21P%2BAGEwoarOuMXQ%2Feg1o8G%2BcWOTDxduujyzmOF7O64vFWcDkF%2BisApExRuEBTK7K5QPXB2KtkQovwMzBjmAWfn8oUwtpE4uvFX7y3vW2yG3UZe%2FRuDtRmjR7ek4G422wav39V4dIts7bh75o6Il5FgS%2BBOI%2F1wFLYFpO9pnQlP8Z2CAtKOnOyE0tFi2UQU564XBmtvbAtoiOKpaCqgMXu&$tenant=FELLOWCONSULTING_DEV"
width="100%" height="100%"
class="pdf-container-style"></iframe>
    </div>
    </div>
    </ng-container>*/

/* **************************** */
/* Second Page (Vertical Items) - CSS */
/* **************************** */

/*
.vertical-items-container {
    position: relative;
    width: 100%;
    margin: 20px 0px;
}

.vertical-line {
    display: grid;
    grid-template-columns: 1fr 10px;
    grid-template-rows: 1fr;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 200px;
}

.vertical-items {
    position: absolute;
    top: 0;
    left: 0;
    display: grid;
    gap: 3rem;
    grid-template-rows: repeat(auto-fill, 1fr);
    width: 100%;
    padding-top: 25px;
}

.vertical-item {
    cursor: pointer;
    display: grid;
    grid-template-columns: 150px 50px 1fr;
    gap: 2rem;
    z-index: 5;
}

.hover-shadow > * {
    box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
    0 6.7px 5.3px rgba(0, 0, 0, 0.048),
    0 12.5px 10px rgba(0, 0, 0, 0.06),
    0 22.3px 17.9px rgba(0, 0, 0, 0.072),
    0 41.8px 33.4px rgba(0, 0, 0, 0.086),
    0 100px 80px rgba(0, 0, 0, 0.12)
}

.vertical-item > div:nth-child(1) {
    background-color: white;
    height: 10px;
    place-self: center;
    padding: 10px 15px 25px 15px;
    font-size: 14px;
}

.vertical-item > div:nth-child(2) { /!* Middle Circle *!/
    background-color: #2678a9;
    height: 50px;
    border-radius: 50%;
}

.vertical-item > div:nth-child(3) {
    background-color: white;
    place-self: center;
}

.vertical-item-details {
    font-size: 14px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    grid-template-rows: 1fr 1fr;
    gap: 3rem;
}*/
