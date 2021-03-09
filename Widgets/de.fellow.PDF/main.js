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
        }
        PDFComponent.prototype.ngOnInit = function () {
            this.changeDetectionRef.markForCheck();
            this.topMenuItems = [
                { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.eithernet), label: 'Eithernet' },
                { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.language), label: 'Language' },
                { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.mediation), label: 'Meditation' },
                { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.print), label: 'Print' },
                { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.refresh), label: 'Refresh' },
                { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.rounded_corner), label: 'Rounded Corner' },
                { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.sort), label: 'Sort' },
                { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.table_view), label: 'Table View' },
            ];
            this.checkMark = this.ds.bypassSecurityTrustUrl(assets_1.assets.check);
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
                template: "\n        <div class=\"parent-layout\">\n            <div>\n                <!--  Top Button Row   -->\n                <div class=\"icon-row\">\n                    <div *ngFor=\"let menuItem of topMenuItems;\">\n                        <div style=\"display: grid; grid-template-rows: 1fr minmax(25px, auto);\" class=\"main-menu-icon\">\n                            <div style=\"text-align: center\"><img [src]=\"menuItem.icon\" class=\"main-menu-icon-image\"/>\n                            </div>\n                            <div style=\"text-align: center\">{{menuItem.label}}</div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n            <div class=\"body-grid\">\n\n                <!-- List    -->\n                <div class=\"list-container\">\n                    <div *ngFor=\"let item of sampleListItems;\" class=\"list-item\">\n                        <div style=\"padding-left: 10px;\">\n                            <img [src]=\"checkMark\" width=\"20\" *ngIf=\"item.checked\">\n                            <div style=\"width:20px\" *ngIf=\"!item.checked\"></div>\n                        </div>\n                        <div>{{item.date}}</div>\n                        <div>{{item.sender}}</div>\n                        <div>{{item.cashRegister}}</div>\n                        <div>{{item.firstName}}</div>\n                        <div>{{item.lastName}}</div>\n                        <div>{{item.entrance}}</div>\n                    </div>\n                </div>\n\n                <!-- PDF Preview     -->\n                <div style=\"grid-column: 2; grid-row: 1/-1; padding:10px 10px 20px 10px;\">\n                    <iframe src=\"http://www.muhammadbinyusrat.com/devguide.pdf\" width=\"100%\" height=\"100%\"\n                            style=\"box-shadow: 0 10px 6px -6px #777;\"></iframe>\n                </div>\n\n                <!-- Form  -->\n                <div class=\"form-box\">\n                    <div class=\"form-container\">\n                        <div class=\"form-fields-container\">\n                            <div class=\"field\">\n                                <label>User</label>\n                                <input type=\"text\" class=\"smaller-text-field search-icon\" value=\"4401ac15\">\n                            </div>\n                            <div class=\"field\">\n                                <label></label>\n                                <span style=\"font-size:14px\">Obermeier, Klaus</span>\n                            </div>\n\n                            <div class=\"field\">\n                                <label>Kassenzeichen</label>\n                                <input type=\"text\" class=\"smaller-text-field\" value=\"3202039423042\">\n                            </div>\n                            <div>&nbsp;</div>\n\n\n                            <div class=\"field\">\n                                <label>Nachname</label>\n                                <input type=\"text\" class=\"smaller-text-field\" value=\"Panse\">\n                            </div>\n                            <div class=\"field\">\n                                <label>Vorname</label>\n                                <input type=\"text\" class=\"smaller-text-field\" value=\"Jim\">\n                            </div>\n\n\n                            <div class=\"field\" style=\"grid-row:4; grid-column: 1 / -1\">\n                                <label>Eingang</label>\n                                <input type=\"text\" class=\"smaller-text-field\" value=\"Posteinganj -- Ruckleuf EMA\"\n                                       style=\"width:90%\">\n                            </div>\n\n\n                            <div class=\"field\" style=\"grid-row:5; grid-column: 1 / -1\">\n                                <label>Dokumentenbezeichnung</label>\n                                <input type=\"text\" class=\"smaller-text-field search-icon\" value=\"Ruckleuf EMA\"\n                                       style=\"width:90%\">\n                            </div>\n                        </div>\n                        <div class=\"push-to-bottom\">\n                            <div></div>\n                            <div>\n                                <button class=\"outlined-button\">schlie\u00DFen</button>\n                            </div>\n                        </div>\n                        <div class=\"push-to-bottom\">\n                            <div></div>\n                            <div>\n                                <button class=\"filled-button\">eAkte</button>\n                            </div>\n                            <div>\n                                <button class=\"filled-button\">Dokument</button>\n                            </div>\n                            <div>\n                                <button class=\"filled-button\">Speichern</button>\n                            </div>\n                        </div>\n                    </div>\n                </div>\n            </div>\n        </div>\n    ",
                styles: ["\n        .parent-layout {\n            display: grid;\n            grid-template-rows: auto 1fr;\n            height: 100%;\n        }\n\n        .icon-row {\n            padding-top: 10px;\n            padding-bottom: -10px;\n            background-color: #2778a9;\n            color: white;\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));\n        }\n\n        .main-menu-icon {\n            cursor: pointer;\n        }\n\n        .main-menu-icon:hover {\n            filter: invert(93%) sepia(5%) saturate(35%) hue-rotate(314deg) brightness(95%) contrast(78%);\n        }\n\n        .main-menu-icon-image {\n            filter: invert(87%) sepia(98%) saturate(1%) hue-rotate(268deg) brightness(109%) contrast(97%);\n            width: 50px;\n        }\n\n        .body-grid {\n            background-color: #f0f0f0;\n            display: grid;\n            gap: 2rem;\n            grid-template-columns: 1fr 1fr;\n            grid-template-rows: 1fr 1fr;\n        }\n\n        .list-container {\n            display: grid;\n            grid-template-rows: repeat(auto-fill, 40px);\n            padding-left: 20px;\n            padding-top: 10px;\n            gap: 1rem;\n        }\n\n        .list-item {\n            cursor: pointer;\n            background-color: white;\n            box-shadow: #1a1a1a;\n            display: grid;\n            grid-template-columns: auto repeat(6, 1fr);\n            gap: 1rem;\n        }\n\n        .list-item > div {\n            place-self: center;\n        }\n\n        .list-item:hover {\n            background-color: white;\n            box-shadow: 0 2.8px 2.2px rgba(0, 0, 0, 0.034),\n            0 6.7px 5.3px rgba(0, 0, 0, 0.048),\n            0 12.5px 10px rgba(0, 0, 0, 0.06),\n            0 22.3px 17.9px rgba(0, 0, 0, 0.072),\n            0 41.8px 33.4px rgba(0, 0, 0, 0.086),\n            0 100px 80px rgba(0, 0, 0, 0.12)\n        }\n\n        .form-box {\n            padding-left: 20px;\n            padding-bottom: 20px;\n        }\n\n        .form-container {\n            padding: 10px;\n            display: grid;\n            grid-template-columns: 1fr auto auto;\n            gap: 1rem;\n            background-color: white;\n            height: 100%;\n            box-shadow: 0 10px 6px -6px #777;\n        }\n\n        .form-fields-container {\n            display: grid;\n            grid-template-columns: 1fr 1fr;\n        }\n\n        .smaller-text-field {\n            font-size: 13px;\n            height: 20px;\n            width: 80%;\n        }\n\n        .push-to-bottom {\n            display: grid;\n            grid-template-rows: 1fr auto;\n            gap: 1rem;\n        }\n\n        .outlined-button {\n            width: 100%;\n            border: 2px solid #2678a9;\n            padding: 3px 6px;\n            color: #2678a9;\n            border-radius: 5px;\n        }\n\n        .outlined-button:hover {\n            background-color: #2678a9;\n            color: white;\n        }\n\n        .filled-button {\n            width: 100%;\n            border: 2px solid #2678a9;\n            padding: 3px 6px;\n            color: white;\n            border-radius: 5px;\n            background-color: #2678a9;\n        }\n\n        .filled-button:hover {\n            background-color: white;\n            color: cornflowerblue;\n        }\n\n        .search-icon {\n            background: url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iYmxhY2siIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTUuNSAxNGgtLjc5bC0uMjgtLjI3QzE1LjQxIDEyLjU5IDE2IDExLjExIDE2IDkuNSAxNiA1LjkxIDEzLjA5IDMgOS41IDNTMyA1LjkxIDMgOS41IDUuOTEgMTYgOS41IDE2YzEuNjEgMCAzLjA5LS41OSA0LjIzLTEuNTdsLjI3LjI4di43OWw1IDQuOTlMMjAuNDkgMTlsLTQuOTktNXptLTYgMEM3LjAxIDE0IDUgMTEuOTkgNSA5LjVTNy4wMSA1IDkuNSA1IDE0IDcuMDEgMTQgOS41IDExLjk5IDE0IDkuNSAxNHoiLz48L3N2Zz4=\") no-repeat right;\n        }\n    "]
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
//# sourceMappingURL=main.js.map