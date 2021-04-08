var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
define(["require", "exports", "@angular/core", "@angular/common", "@infor/sohoxi-angular", "@angular/forms", "lime", "./assets", "@angular/platform-browser"], function (require, exports, core_1, common_1, sohoxi_angular_1, forms_1, lime_1, assets_1, platform_browser_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.PdfModule = exports.PDFComponent = void 0;
    var PDFComponent = /** @class */ (function () {
        function PDFComponent(changeDetectionRef, fb, ds) {
            this.changeDetectionRef = changeDetectionRef;
            this.fb = fb;
            this.ds = ds;
            this.assets = assets_1.assets;
            this.$ = $;
            this.topMenuItems = [];
            this.currentTab = 0;
        }
        PDFComponent.prototype.rowSelected = function (item) {
            this.selectedRow = item;
        };
        PDFComponent.prototype.ngOnInit = function () {
            this.changeDetectionRef.markForCheck();
            this.topMenuItems = [
                { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.aktualisieren), label: 'AKTUALISIEREN ' },
                { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.weiterleiten), label: 'WEITERLEITEN ' },
                { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.trennen), label: 'TRENNEN' },
                // {icon: this.ds.bypassSecurityTrustUrl(assets.print), label: 'SORTIEREN'},
                { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.bearbeiten), label: 'BEARBEITEN' },
                // {icon: this.ds.bypassSecurityTrustUrl(assets.rounded_corner), label: 'FUNKTIONEN'},
                { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.eakte), label: 'EAKTE' },
                { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.hwscxs), label: 'HWS/CXS' },
            ];
            this.checkMark = this.ds.bypassSecurityTrustUrl(assets_1.assets.tick);
            this.sortIcon = this.ds.bypassSecurityTrustUrl(assets_1.assets.sort);
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
            this.verticalItems = [
                { date: '12.12.2020', rollover: false },
                { date: '26.10.2020', rollover: false },
                { date: '12.12.2020', rollover: false }
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
            }
            catch (err) {
                console.warn(err);
            }
        };
        PDFComponent.prototype.getMetadata = function () {
            // For known/hardcoded values, place the metadata in the manifest instead.
            return [{
                    type: lime_1.WidgetSettingsType.selectorType,
                    name: "order",
                }];
        };
        PDFComponent.prototype.switchTab = function (i) {
            alert(i);
        };
        __decorate([
            core_1.Input(),
            __metadata("design:type", lime_1.IWidgetContext)
        ], PDFComponent.prototype, "widgetContext", void 0);
        __decorate([
            core_1.Input(),
            __metadata("design:type", lime_1.IWidgetInstance)
        ], PDFComponent.prototype, "widgetInstance", void 0);
        PDFComponent = __decorate([
            core_1.Component({
                template: "\n        <div class=\"parent-layout\">\n            <div>\n                <!--  Top Button Row   -->\n                <div class=\"icon-row\">\n                    <div *ngFor=\"let menuItem of topMenuItems;let i = index;\">\n                        <div style=\"display: grid; grid-template-rows: 1fr minmax(25px, auto);\" class=\"main-menu-icon\"\n                             (click)=\"currentTab = i;\">\n                            <div style=\"text-align: center\"><img [src]=\"menuItem.icon\" class=\"main-menu-icon-image\"/>\n                            </div>\n                            <div class=\"header-label\">{{menuItem.label}}</div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n\n            <!-- First Tab -->\n            <ng-container *ngIf=\"currentTab == 0\">\n                <div style=\"width: 100%; display: flex; padding: 10px; overflow: auto; background-color: #f0f0f0;\">\n                    <div style=\"width: 50%; overflow: auto; display: grid; padding-top: 27px\">\n                        <div class=\"grid-header\">\n                            <div style=\"width: 10%; text-align: center\">Vetr.<img [src]=\"sortIcon\" class=\"sort\"/></div>\n                            <div style=\"width: 12%\">Datum<img [src]=\"sortIcon\" class=\"sort\"/></div>\n                            <div style=\"width: 13%\">Absender<img [src]=\"sortIcon\" class=\"sort\"/></div>\n                            <div style=\"width: 20%\">Kassenzeichen<img [src]=\"sortIcon\" class=\"sort\"/></div>\n                            <div style=\"width: 15%\">Nachname<img [src]=\"sortIcon\" class=\"sort\"/></div>\n                            <div style=\"width: 15%\">Vorname<img [src]=\"sortIcon\" class=\"sort\"/></div>\n                            <div style=\"width: 15%\">Eingang<img [src]=\"sortIcon\" class=\"sort\"/></div>\n                        </div>\n                        <div style=\"overflow: auto\">\n                            <div *ngFor=\"let item of sampleListItems;\"\n                                 style=\"display: flex; background: white; height: 30px; cursor: pointer; margin-top: 7px;\"\n                                 class=\"list-item\"\n                                 (click)=\"rowSelected(item)\">\n                                <div style=\"width: 10%; margin: auto 0\">\n                                    <img style=\"margin: auto auto; display: block\" [src]=\"checkMark\" width=\"20\"\n                                         *ngIf=\"item.checked\">\n                                </div>\n                                <div style=\"width: 12%; margin: auto 0\">{{item.date}}</div>\n                                <div style=\"width: 13%; margin: auto 0\">{{item.sender}}</div>\n                                <div style=\"width: 20%; margin: auto 0\">{{item.cashRegister}}</div>\n                                <div style=\"width: 15%; margin: auto 0\">{{item.firstName}}</div>\n                                <div style=\"width: 15%; margin: auto 0\">{{item.lastName}}</div>\n                                <div style=\"width: 15%; margin: auto 0\">{{item.entrance}}</div>\n                            </div>\n                        </div>\n                        <div *ngIf=\"selectedRow\" style=\"padding-top: 10px\">\n                            <div class=\"form-container\">\n                                <div class=\"form-fields-container\">\n                                    <div class=\"field\">\n                                        <label>User</label>\n                                        <input type=\"text\" class=\"smaller-text-field search-icon\"\n                                               value=\"{{selectedRow.sender}}\">\n                                    </div>\n\n                                    <div class=\"field\">\n                                        <label></label>\n                                        <span style=\"font-size:14px\">Obermeier, Klaus</span>\n                                    </div>\n\n                                    <div class=\"field\">\n                                        <label>Kassenzeichen</label>\n                                        <input type=\"text\" class=\"smaller-text-field\"\n                                               value=\"{{selectedRow.cashRegister}}\">\n                                    </div>\n                                    <div>&nbsp;</div>\n\n                                    <div class=\"field\">\n                                        <label>Nachname</label>\n                                        <input type=\"text\" class=\"smaller-text-field\" value=\"{{selectedRow.firstName}}\">\n                                    </div>\n\n                                    <div class=\"field\">\n                                        <label>Vorname</label>\n                                        <input type=\"text\" class=\"smaller-text-field\" value=\"{{selectedRow.lastName}}\">\n                                    </div>\n\n                                    <div class=\"field\" style=\"grid-row:4; grid-column: 1 / -1\">\n                                        <label>Eingang</label>\n                                        <input type=\"text\" class=\"smaller-text-field\"\n                                               value=\"{{selectedRow.entrance}}\"\n                                               style=\"width:90%\">\n                                    </div>\n\n                                    <div class=\"field\" style=\"grid-row:5; grid-column: 1 / -1\">\n                                        <label>Dokumentenbezeichnung</label>\n                                        <input type=\"text\" class=\"smaller-text-field search-icon\"\n                                               value=\"Ruckleuf EMA\"\n                                               style=\"width:90%\">\n                                    </div>\n                                </div>\n                                <div class=\"push-to-bottom\">\n                                    <div></div>\n                                    <div>\n                                        <button class=\"outlined-button\">schlie\u00DFen</button>\n                                    </div>\n                                </div>\n                                <div class=\"push-to-bottom\">\n                                    <div></div>\n                                    <div>\n                                        <button class=\"filled-button\">eAkte</button>\n                                    </div>\n                                    <div>\n                                        <button class=\"filled-button\">Dokument</button>\n                                    </div>\n                                    <div>\n                                        <button class=\"filled-button\">Speichern</button>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div style=\"width: 50%; height: 100%; padding: 45px 20px 0 30px;\">\n                        <iframe src=\"https://www.muhammadbinyusrat.com/devguide.pdf\" width=\"100%\" height=\"100%\"\n                                class=\"pdf-container-style\"></iframe>\n                    </div>\n                </div>\n            </ng-container>\n        </div>\n    ",
                styles: ["\n        .parent-layout {\n            display: grid;\n            grid-template-rows: auto 1fr;\n            height: 100%;\n        }\n\n        .icon-row {\n            padding-top: 10px;\n            padding-bottom: -10px;\n            background-image: linear-gradient(0deg, #2b79a7 0%, #4ebbfb 50%, #2b79a7 100%);\n            color: white;\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));\n        }\n\n        .header-label {\n            text-align: center;\n            margin-top: 5px;\n            letter-spacing: 1px;\n            -webkit-transform: scale(1, 1.5); /* chrome and safari */\n            -moz-transform: scale(1, 1.5); /* opera */\n        }\n\n        .grid-header {\n            width: calc(100% - 8px); /*excluding scroller width*/\n            display: flex;\n            color: #909090;\n            cursor: pointer;\n        }\n\n        .main-menu-icon {\n            cursor: pointer;\n        }\n\n        .main-menu-icon:hover {\n            filter: invert(93%) sepia(5%) saturate(35%) hue-rotate(314deg) brightness(95%) contrast(78%);\n        }\n\n        .main-menu-icon-image {\n            filter: invert(87%) sepia(98%) saturate(1%) hue-rotate(268deg) brightness(109%) contrast(97%);\n            width: 50px;\n        }\n\n        .pdf-container-style {\n            box-shadow: 0 10px 6px -6px #777;\n        }\n\n        .list-item:hover {\n            box-shadow: 0 0 11px rgba(33, 33, 33, .2);\n        }\n\n        .sort {\n            width: 12px;\n            margin-bottom: -3px;\n            margin-left: 2px;\n            opacity: 0.5;\n        }\n\n        .form-container {\n            padding: 10px;\n            display: grid;\n            grid-template-columns: 1fr auto auto;\n            gap: 1rem;\n            background-color: white;\n            height: 100%;\n            box-shadow: 0 10px 6px -6px #777;\n        }\n\n        .form-fields-container {\n            display: grid;\n            grid-template-columns: 1fr 1fr;\n        }\n\n        .smaller-text-field {\n            font-size: 13px;\n            height: 20px;\n            width: 80%;\n        }\n\n        .push-to-bottom {\n            display: grid;\n            grid-template-rows: 1fr auto;\n            gap: 1rem;\n        }\n\n        .outlined-button {\n            width: 100%;\n            border: 2px solid #2678a9;\n            padding: 3px 6px;\n            color: #2678a9;\n            border-radius: 5px;\n        }\n\n        .outlined-button:hover {\n            background-color: #2678a9;\n            color: white;\n        }\n\n        .filled-button {\n            width: 100%;\n            border: 2px solid #2678a9;\n            padding: 3px 6px;\n            color: white;\n            border-radius: 5px;\n            background-color: #2678a9;\n        }\n\n        .filled-button:hover {\n            background-color: white;\n            color: cornflowerblue;\n        }\n\n        .search-icon {\n            background: url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iYmxhY2siIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTUuNSAxNGgtLjc5bC0uMjgtLjI3QzE1LjQxIDEyLjU5IDE2IDExLjExIDE2IDkuNSAxNiA1LjkxIDEzLjA5IDMgOS41IDNTMyA1LjkxIDMgOS41IDUuOTEgMTYgOS41IDE2YzEuNjEgMCAzLjA5LS41OSA0LjIzLTEuNTdsLjI3LjI4di43OWw1IDQuOTlMMjAuNDkgMTlsLTQuOTktNXptLTYgMEM3LjAxIDE0IDUgMTEuOTkgNSA5LjVTNy4wMSA1IDkuNSA1IDE0IDcuMDEgMTQgOS41IDExLjk5IDE0IDkuNSAxNHoiLz48L3N2Zz4=\") no-repeat right;\n        }\n    "]
                // changeDetection: ChangeDetectionStrategy.OnPush
            }),
            __metadata("design:paramtypes", [core_1.ChangeDetectorRef, forms_1.FormBuilder, platform_browser_1.DomSanitizer])
        ], PDFComponent);
        return PDFComponent;
    }());
    exports.PDFComponent = PDFComponent;
    var PdfModule = /** @class */ (function () {
        function PdfModule() {
        }
        PdfModule = __decorate([
            core_1.NgModule({
                imports: [common_1.CommonModule, sohoxi_angular_1.SohoListViewModule, forms_1.ReactiveFormsModule, forms_1.FormsModule],
                declarations: [PDFComponent],
                entryComponents: [PDFComponent]
            })
        ], PdfModule);
        return PdfModule;
    }());
    exports.PdfModule = PdfModule;
});
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
//# sourceMappingURL=main.js.map