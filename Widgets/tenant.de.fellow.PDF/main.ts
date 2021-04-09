import {ChangeDetectorRef, Component, Input, NgModule, OnInit} from "@angular/core";
import {CommonModule} from "@angular/common";
import {SohoListViewModule} from "@infor/sohoxi-angular";
import {FormBuilder, FormsModule, ReactiveFormsModule} from "@angular/forms";
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
                            <div class="header-label">{{menuItem.label}}</div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- First Tab -->
            <ng-container *ngIf="currentTab == 0">
                <div style="width: 100%; display: flex; padding: 10px; overflow: auto; background-color: #f0f0f0;">
                    <div style="width: 50%; overflow: auto; display: grid; padding-top: 27px">
                        <div class="grid-header">
                            <div style="width: 10%; text-align: center" (click)="sortListBy('checked')">Vetr.<img [src]="sortIcon" class="sort"/></div>
                            <div style="width: 12%" (click)="sortListBy('date')">Datum<img [src]="sortIcon" class="sort"/></div>
                            <div style="width: 13%" (click)="sortListBy('sender')">Absender<img [src]="sortIcon" class="sort"/></div>
                            <div style="width: 20%" (click)="sortListBy('cashRegister')">Kassenzeichen<img [src]="sortIcon" class="sort"/></div>
                            <div style="width: 15%" (click)="sortListBy('lastName')">Nachname<img
                                    [src]="sortIcon" class="sort"/></div>
                            <div style="width: 15%" (click)="sortListBy('firstName')">Vorname<img [src]="sortIcon" class="sort"/></div>
                            <div style="width: 15%" (click)="sortListBy('entrance')">Eingang<img [src]="sortIcon" class="sort"/></div>
                        </div>
                        <div style="overflow: auto">
                            <div *ngFor="let item of sortedSampleListItems;"
                                 style="display: flex; background: white; height: 30px; cursor: pointer; margin-top: 7px;"
                                 class="list-item"
                                 (click)="rowSelected(item)">
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
                        <div *ngIf="selectedRow" style="padding-top: 10px">
                            <div class="form-container">
                                <div class="form-fields-container">
                                    <div class="field">
                                        <label>User</label>
                                        <input type="text" class="smaller-text-field search-icon"
                                               value="{{selectedRow.sender}}">
                                    </div>

                                    <div class="field">
                                        <label></label>
                                        <span style="font-size:14px">Obermeier, Klaus</span>
                                    </div>

                                    <div class="field">
                                        <label>Kassenzeichen</label>
                                        <input type="text" class="smaller-text-field"
                                               value="{{selectedRow.cashRegister}}">
                                    </div>
                                    <div>&nbsp;</div>

                                    <div class="field">
                                        <label>Nachname</label>
                                        <input type="text" class="smaller-text-field" value="{{selectedRow.firstName}}">
                                    </div>

                                    <div class="field">
                                        <label>Vorname</label>
                                        <input type="text" class="smaller-text-field" value="{{selectedRow.lastName}}">
                                    </div>

                                    <div class="field" style="grid-row:4; grid-column: 1 / -1">
                                        <label>Eingang</label>
                                        <input type="text" class="smaller-text-field"
                                               value="{{selectedRow.entrance}}"
                                               style="width:90%">
                                    </div>

                                    <div class="field" style="grid-row:5; grid-column: 1 / -1">
                                        <label>Dokumentenbezeichnung</label>
                                        <input type="text" class="smaller-text-field search-icon"
                                               value="Ruckleuf EMA"
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
                    <div style="width: 50%; height: 100%; padding: 45px 20px 0 30px;">
                        <iframe src="https://www.muhammadbinyusrat.com/devguide.pdf" width="100%" height="100%"
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
            background-image: linear-gradient(0deg, #2b79a7 0%, #4ebbfb 50%, #2b79a7 100%);
            color: white;
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));
        }

        .header-label {
            text-align: center;
            margin-top: 5px;
            letter-spacing: 1px;
            -webkit-transform: scale(1, 1.5); /* chrome and safari */
            -moz-transform: scale(1, 1.5); /* opera */
        }

        .grid-header {
            width: calc(100% - 8px); /*excluding scroller width*/
            display: flex;
            color: #909090;
            cursor: pointer;
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

        .pdf-container-style {
            box-shadow: 0 10px 6px -6px #777;
        }

        .list-item:hover {
            box-shadow: 0 0 11px rgba(33, 33, 33, .2);
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

    topMenuItems: MainMenuItem[] = [];
    sampleListItems: ListItem[];
    sortedSampleListItems: ListItem[];
    currentTab: 0 | 1 | 2 | 3 = 0;
    verticalItems: VerticalListItem[];
    lastSortAction: { property: string, direction: 'asc' | 'desc' };

    sortIcon: SafeHtml;

    selectedRow: ListItem;

    constructor(private readonly changeDetectionRef: ChangeDetectorRef, private fb: FormBuilder, private ds: DomSanitizer) {
    }

    rowSelected(item: ListItem) {
        this.selectedRow = item;
    }

    ngOnInit() {
        this.changeDetectionRef.markForCheck();
        this.topMenuItems = [
            {icon: this.ds.bypassSecurityTrustUrl(assets.aktualisieren), label: 'AKTUALISIEREN '},
            {icon: this.ds.bypassSecurityTrustUrl(assets.weiterleiten), label: 'WEITERLEITEN '},
            {icon: this.ds.bypassSecurityTrustUrl(assets.trennen), label: 'TRENNEN'},
            // {icon: this.ds.bypassSecurityTrustUrl(assets.print), label: 'SORTIEREN'},
            {icon: this.ds.bypassSecurityTrustUrl(assets.bearbeiten), label: 'BEARBEITEN'},
            // {icon: this.ds.bypassSecurityTrustUrl(assets.rounded_corner), label: 'FUNKTIONEN'},
            {icon: this.ds.bypassSecurityTrustUrl(assets.eakte), label: 'EAKTE'},
            {icon: this.ds.bypassSecurityTrustUrl(assets.hwscxs), label: 'HWS/CXS'},
        ];

        this.checkMark = this.ds.bypassSecurityTrustUrl(assets.tick);
        this.sortIcon = this.ds.bypassSecurityTrustUrl(assets.sort);

        this.sampleListItems = [
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Testfall',
                firstName: 'Hugo',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 2281000499079,
                lastName: 'Gips',
                firstName: 'Armin',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: '4401ab15',
                cashRegister: 5011300270843,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Rucklauf ZS'
            },
            {
                checked: true,
                date: "01.02.2020",
                sender: '4401ab15',
                cashRegister: 1222800396519,
                lastName: 'Nette',
                firstName: 'Marion',
                entrance: 'Unbekannt'
            },
            {
                checked: true,
                date: "01.02.2020",
                sender: '4401ab15',
                cashRegister: 1401900079529,
                lastName: 'Panse',
                firstName: 'Jim',
                entrance: 'Rucklauf EMA'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Unbekannt'
            },
            {
                checked: false,
                date: "01.02.2020",
                sender: 'Poststelle',
                cashRegister: 3206002784872,
                lastName: 'Reich',
                firstName: 'Frank',
                entrance: 'Taltech'
            }
        ];

        this.sortedSampleListItems = this.sampleListItems.slice();

        this.verticalItems = [
            {date: '12.12.2020', rollover: false},
            {date: '26.10.2020', rollover: false},
            {date: '12.12.2020', rollover: false}
        ];

        // try {
        //     $('body').initialize('en-US');
        //     $('#searchfield').searchfield({
        //         clearable: true,
        //     }).on('selected', function (e, a) {
        //         console.log('Selected event was fired');
        //         if (a.hasClass('more-results')) {
        //             console.log('More results was clicked');
        //         }
        //     });
        // } catch (err) {
        //     console.warn(err);
        // }
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
        this.sortedSampleListItems.sort((a: any, b: any) => {
            if (targetOrder === 'asc') {
                return a[property] > b[property] ? 1 : -1;
            }
            return a[property] < b[property] ? 1 : -1;
        });
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
