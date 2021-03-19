import {ChangeDetectorRef, Component, Input, NgModule, OnInit, ViewChild} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SohoListViewModule} from "@infor/sohoxi-angular";
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {IWidgetComponent, IWidgetContext, IWidgetInstance, IWidgetSettingMetadata, WidgetSettingsType} from "lime";
import {assets} from "./assets";
import {DomSanitizer, SafeHtml} from "@angular/platform-browser";

interface MainMenuItem {
    icon: SafeHtml;
    label: string;
}

interface ListItem {
    checked: boolean;
    date: string;
    sender: string;
    cashRegister: number,
    lastName: string,
    firstName: string,
    entrance: string
}

interface VerticalListItem {
    date: string;
    rollover: boolean;
}

@Component({
    template: `
        <div class="parent-layout">
            <div>
                <!--  Top Button Row   -->
                <div class="icon-row">
                    <div *ngFor="let menuItem of topMenuItems;let i = index;">
                        <div style="display: grid; grid-template-rows: 1fr minmax(25px, auto);" class="main-menu-icon"
                             (click)="currentTab = i;">
                            <div style="text-align: center"><img [src]="menuItem.icon" class="main-menu-icon-image"/>
                            </div>
                            <div style="text-align: center">{{menuItem.label}}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- First Tab -->
            <ng-container *ngIf="currentTab == 0">
                <div class="body-grid two-by-two">
                    <!-- List    -->
                    <div class="list-container">
                        <div *ngFor="let item of sampleListItems;" class="list-item">
                            <div style="padding-left: 10px;">
                                <img [src]="checkMark" width="20" *ngIf="item.checked">
                                <div style="width:20px" *ngIf="!item.checked"></div>
                            </div>
                            <div>{{item.date}}</div>
                            <div>{{item.sender}}</div>
                            <div>{{item.cashRegister}}</div>
                            <div>{{item.firstName}}</div>
                            <div>{{item.lastName}}</div>
                            <div>{{item.entrance}}</div>
                        </div>
                    </div>

                    <!-- PDF Preview     -->
                    <div style="grid-column: 2; grid-row: 1/-1; padding:10px 10px 20px 10px;">
                        <iframe src="http://www.muhammadbinyusrat.com/devguide.pdf" width="100%" height="100%"
                                class="pdf-container-style"></iframe>
                    </div>

                    <!-- Form  -->
                    <div class="form-box">
                        <div class="form-container">
                            <div class="form-fields-container">
                                <div class="field">
                                    <label>User</label>
                                    <input type="text" class="smaller-text-field search-icon" value="4401ac15">
                                </div>
                                <div class="field">
                                    <label></label>
                                    <span style="font-size:14px">Obermeier, Klaus</span>
                                </div>

                                <div class="field">
                                    <label>Kassenzeichen</label>
                                    <input type="text" class="smaller-text-field" value="3202039423042">
                                </div>
                                <div>&nbsp;</div>


                                <div class="field">
                                    <label>Nachname</label>
                                    <input type="text" class="smaller-text-field" value="Panse">
                                </div>
                                <div class="field">
                                    <label>Vorname</label>
                                    <input type="text" class="smaller-text-field" value="Jim">
                                </div>


                                <div class="field" style="grid-row:4; grid-column: 1 / -1">
                                    <label>Eingang</label>
                                    <input type="text" class="smaller-text-field" value="Posteinganj -- Ruckleuf EMA"
                                           style="width:90%">
                                </div>


                                <div class="field" style="grid-row:5; grid-column: 1 / -1">
                                    <label>Dokumentenbezeichnung</label>
                                    <input type="text" class="smaller-text-field search-icon" value="Ruckleuf EMA"
                                           style="width:90%">
                                </div>
                            </div>
                            <div class="push-to-bottom">
                                <div></div>
                                <div>
                                    <button class="outlined-button">schließen</button>
                                </div>
                            </div>
                            <div class="push-to-bottom">
                                <div></div>
                                <div>
                                    <button class="filled-button">eAkte</button>
                                </div>
                                <div>
                                    <button class="filled-button">Dokument</button>
                                </div>
                                <div>
                                    <button class="filled-button">Speichern</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </ng-container>

            <ng-container *ngIf="currentTab == 1">
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
                                    <div style="grid-column: 5; grid-row: 1/span 2;margin-top: 5px;"><img [src]="pdfIcon"></div>

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
                    <!-- PDF Preview     -->
                    <div style="padding:10px 10px 20px 10px;">
                        <iframe src="http://www.muhammadbinyusrat.com/devguide.pdf" width="100%" height="100%"
                                class="pdf-container-style"></iframe>
                    </div>
                </div>
            </ng-container>
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
            padding-bottom: -10px;
            background-color: #2778a9;
            color: white;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
        }

        .main-menu-icon {
            cursor: pointer;
        }

        .main-menu-icon:hover {
            filter: invert(93%) sepia(5%) saturate(35%) hue-rotate(314deg) brightness(95%) contrast(78%);
        }

        .main-menu-icon-image {
            filter: invert(87%) sepia(98%) saturate(1%) hue-rotate(268deg) brightness(109%) contrast(97%);
            width: 50px;
        }

        .body-grid {
            background-color: #f0f0f0;
            display: grid;
            gap: 2rem;
        }

        .two-by-two {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
        }

        .two-by-one {
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr;
        }

        .pdf-container-style {
            box-shadow: 0 10px 6px -6px #777;
        }

        .list-container {
            display: grid;
            grid-template-rows: repeat(auto-fill, 40px);
            padding-left: 20px;
            padding-top: 10px;
            gap: 1rem;
        }

        .list-item {
            cursor: pointer;
            background-color: white;
            box-shadow: #1a1a1a;
            display: grid;
            grid-template-columns: auto repeat(6, 1fr);
            gap: 1rem;
        }

        .list-item > div {
            place-self: center;
        }

        .list-item:hover {
            background-color: white;
            box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),
            0 6.7px 5.3px rgba(0, 0, 0, 0.048),
            0 12.5px 10px rgba(0, 0, 0, 0.06),
            0 22.3px 17.9px rgba(0, 0, 0, 0.072),
            0 41.8px 33.4px rgba(0, 0, 0, 0.086),
            0 100px 80px rgba(0, 0, 0, 0.12)
        }

        .form-box {
            padding-left: 20px;
            padding-bottom: 20px;
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

        .search-icon {
            background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iYmxhY2siIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTUuNSAxNGgtLjc5bC0uMjgtLjI3QzE1LjQxIDEyLjU5IDE2IDExLjExIDE2IDkuNSAxNiA1LjkxIDEzLjA5IDMgOS41IDNTMyA1LjkxIDMgOS41IDUuOTEgMTYgOS41IDE2YzEuNjEgMCAzLjA5LS41OSA0LjIzLTEuNTdsLjI3LjI4di43OWw1IDQuOTlMMjAuNDkgMTlsLTQuOTktNXptLTYgMEM3LjAxIDE0IDUgMTEuOTkgNSA5LjVTNy4wMSA1IDkuNSA1IDE0IDcuMDEgMTQgOS41IDExLjk5IDE0IDkuNSAxNHoiLz48L3N2Zz4=") no-repeat right;
        }


        /* **************************** */
        /* Second Page (Vertical Items) */
        /* **************************** */

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

        .vertical-item > div:nth-child(2) { /* Middle Circle */
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
        }
    `]
    // changeDetection: ChangeDetectionStrategy.OnPush
})
export class PDFComponent implements OnInit, IWidgetComponent {
    @Input() widgetContext: IWidgetContext;
    @Input() widgetInstance: IWidgetInstance;
    assets = assets;
    jQueryElement?: JQuery; //Reference to JQuery
    $ = $;
    checkMark: SafeHtml;
    pdfIcon: SafeHtml;

    topMenuItems: MainMenuItem[] = [];
    sampleListItems: ListItem[];
    currentTab: 0 | 1 | 2 | 3 = 1;
    verticalItems: VerticalListItem[];

    constructor(private readonly changeDetectionRef: ChangeDetectorRef, private fb: FormBuilder, private ds: DomSanitizer) {
    }

    ngOnInit() {
        this.changeDetectionRef.markForCheck();
        this.topMenuItems = [
            {icon: this.ds.bypassSecurityTrustUrl(assets.eithernet), label: 'Eithernet'},
            {icon: this.ds.bypassSecurityTrustUrl(assets.language), label: 'Language'},
            {icon: this.ds.bypassSecurityTrustUrl(assets.mediation), label: 'Meditation'},
            {icon: this.ds.bypassSecurityTrustUrl(assets.print), label: 'Print'},
            {icon: this.ds.bypassSecurityTrustUrl(assets.refresh), label: 'Refresh'},
            {icon: this.ds.bypassSecurityTrustUrl(assets.rounded_corner), label: 'Rounded Corner'},
            {icon: this.ds.bypassSecurityTrustUrl(assets.sort), label: 'Sort'},
            {icon: this.ds.bypassSecurityTrustUrl(assets.table_view), label: 'Table View'},
        ];

        this.checkMark = this.ds.bypassSecurityTrustUrl(assets.check);
        this.pdfIcon = this.ds.bypassSecurityTrustUrl(assets.pdfIcon);

        this.sampleListItems = [
            {
                checked: false,
                date: "2021/01/01",
                sender: 'Aslam',
                cashRegister: 203948204,
                lastName: 'ibn',
                firstName: 'Al-Arabi',
                entrance: 'Islamabad'
            },
            {
                checked: false,
                date: "2021/01/02",
                sender: 'Kurdoghlu',
                cashRegister: 930192354,
                lastName: 'Bamsi',
                firstName: 'Bayrak',
                entrance: 'Constantinople'
            },
            {
                checked: true,
                date: "2021/01/03",
                sender: 'Gundokdu',
                cashRegister: 2241934324,
                lastName: 'Dogan',
                firstName: 'Bayrak',
                entrance: 'Aleppo'
            },
            {
                checked: false,
                date: "2021/01/04",
                sender: 'Gundokdu',
                cashRegister: 2241934324,
                lastName: 'Dogan',
                firstName: 'Bayrak',
                entrance: 'Aleppo'
            },
            {
                checked: true,
                date: "2021/01/05",
                sender: 'Akchakoja',
                cashRegister: 44992281232,
                lastName: 'Turgut',
                firstName: 'Alp',
                entrance: 'Rawalpindi'
            },
            {
                checked: false,
                date: "2021/01/06",
                sender: 'Sulemah Shah',
                cashRegister: 44992281232,
                lastName: 'Saddatien',
                firstName: 'Kopek',
                entrance: 'Khartoum'
            }

        ];


        this.verticalItems = [
            {date: '12.12.2020', rollover: false},
            {date: '26.10.2020', rollover: false},
            {date: '12.12.2020', rollover: false}
        ];


        try {
            $('body').initialize('en-US');
            $('#searchfield').searchfield({
                clearable: true,
            }).on('selected', function (e, a) {
                console.log('Selected event was fired');
                if (a.hasClass('more-results')) {
                    console.log('More results was clicked');
                }
            });
        } catch (err) {
            console.warn(err);
        }

    }

    private getMetadata(): IWidgetSettingMetadata[] {
        // For known/hardcoded values, place the metadata in the manifest instead.
        return [{
            type: WidgetSettingsType.selectorType,
            name: "order",
        }];
    }

    switchTab(i: number) {
        alert(i);
    }
}

@NgModule({
    imports: [CommonModule, SohoListViewModule, ReactiveFormsModule, FormsModule],
    declarations: [PDFComponent],
    entryComponents: [PDFComponent]
})
export class PdfModule {
}
