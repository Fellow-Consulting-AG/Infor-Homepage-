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
            this.showForm = false;
            this.showEakte = false;
        }
        PDFComponent.prototype.keypress = function (e) {
            this.onKeyPress(e);
        };
        PDFComponent.prototype.ngOnInit = function () {
            this.changeDetectionRef.markForCheck();
            this.checkMark = this.ds.bypassSecurityTrustUrl(assets_1.assets.tick);
            this.sortIcon = this.ds.bypassSecurityTrustUrl(assets_1.assets.sort);
            this.setData();
            this.selectRow(this.sampleListItems[0]);
            this.selectEakteRow(this.sampleEakteItems[0]);
        };
        PDFComponent.prototype.selectRow = function (item) {
            this.selectedRow = JSON.parse(JSON.stringify(item));
            this.sampleListItems.forEach(function (val) {
                val.selected = false;
                if (val.index === item.index) {
                    val.selected = true;
                }
            });
        };
        PDFComponent.prototype.selectEakteRow = function (item) {
            this.selectedEakteRow = JSON.parse(JSON.stringify(item));
            this.selectedEakteRowPDF = this.ds.bypassSecurityTrustResourceUrl(this.selectedEakteRow.pdfLink);
            this.sampleEakteItems.forEach(function (val) {
                val.selected = false;
                if (val.index === item.index) {
                    val.selected = true;
                }
            });
        };
        PDFComponent.prototype.editForm = function () {
            if (this.selectedRow && !this.showEakte) {
                this.showForm = true;
            }
        };
        PDFComponent.prototype.isFormValid = function () {
            return (!!this.selectedRow.sender.trim() &&
                !!this.selectedRow.cashRegister &&
                !!this.selectedRow.firstName.trim() &&
                !!this.selectedRow.lastName.trim() &&
                !!this.selectedRow.entrance.trim());
        };
        PDFComponent.prototype.saveForm = function () {
            var _this = this;
            this.sampleListItems.forEach(function (row, index) {
                if (row.index === _this.selectedRow.index) {
                    _this.sampleListItems[index] = _this.selectedRow;
                }
            });
        };
        PDFComponent.prototype.sortListBy = function (property) {
            var targetOrder = 'asc';
            if (this.lastSortAction && this.lastSortAction.property === property) {
                targetOrder = this.lastSortAction.direction === 'asc' ? 'desc' : 'asc';
            }
            this.lastSortAction = {
                property: property,
                direction: targetOrder
            };
            console.log("Sorting by " + property + " in " + targetOrder + " order.");
            this.sampleListItems.sort(function (a, b) {
                if (targetOrder === 'asc') {
                    return a[property] > b[property] ? 1 : -1;
                }
                return a[property] < b[property] ? 1 : -1;
            });
        };
        PDFComponent.prototype.onKeyPress = function (event) {
            var _this = this;
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
                    var indexOfSelectedRow = this.sampleListItems.findIndex(function (item) { return item.index === _this.selectedRow.index; });
                    if (this.sampleListItems[indexOfSelectedRow + 1]) {
                        this.sampleListItems[indexOfSelectedRow].selected = false;
                        this.sampleListItems[indexOfSelectedRow + 1].selected = true;
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
                    var indexOfSelectedRow = this.sampleEakteItems.findIndex(function (item) { return item.index === _this.selectedEakteRow.index; });
                    if (this.sampleEakteItems[indexOfSelectedRow + 1]) {
                        this.sampleEakteItems[indexOfSelectedRow].selected = false;
                        this.sampleEakteItems[indexOfSelectedRow + 1].selected = true;
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
                    var indexOfSelectedRow = this.sampleListItems.findIndex(function (item) { return item.index === _this.selectedRow.index; });
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
                    var indexOfSelectedRow = this.sampleEakteItems.findIndex(function (item) { return item.index === _this.selectedEakteRow.index; });
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
                    this.sampleListItems.forEach(function (row) {
                        if (row.index === _this.selectedRow.index) {
                            row.checked = true;
                        }
                    });
                }
                return;
            }
            /* ************************************************* CTRL + X ************************************************/
            if (event.ctrlKey && event.keyCode == 88 && !this.showEakte) {
                // uncheck the row
                if (this.selectedRow) {
                    this.sampleListItems.forEach(function (row) {
                        if (row.index === _this.selectedRow.index) {
                            row.checked = false;
                        }
                    });
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
        };
        PDFComponent.prototype.getMetadata = function () {
            // For known/hardcoded values, place the metadata in the manifest instead.
            return [{
                    type: lime_1.WidgetSettingsType.selectorType,
                    name: "order",
                }];
        };
        PDFComponent.prototype.setData = function () {
            this.topMenuItems = {
                AKTUALISIEREN: { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.aktualisieren), label: 'AKTUALISIEREN ' },
                WEITERLEITEN: { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.weiterleiten), label: 'WEITERLEITEN' },
                TRENNEN: { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.trennen), label: 'TRENNEN' },
                // {icon: this.ds.bypassSecurityTrustUrl(assets.print), label: 'SORTIEREN'},
                BEARBEITEN: { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.bearbeiten), label: 'BEARBEITEN' },
                // {icon: this.ds.bypassSecurityTrustUrl(assets.rounded_corner), label: 'FUNKTIONEN'},
                EAKTE: { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.eakte), label: 'EAKTE' },
                HWSCXS: { icon: this.ds.bypassSecurityTrustUrl(assets_1.assets.hwscxs), label: 'HWS/CXS' },
            };
            this.verticalItems = [
                { date: '12.12.2020', rollover: false },
                { date: '26.10.2020', rollover: false },
                { date: '12.12.2020', rollover: false }
            ];
            this.sampleListItems = [
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
            ];
            this.sampleEakteItems = [
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
                },
                {
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
            ];
        };
        __decorate([
            core_1.Input(),
            __metadata("design:type", lime_1.IWidgetContext)
        ], PDFComponent.prototype, "widgetContext", void 0);
        __decorate([
            core_1.Input(),
            __metadata("design:type", lime_1.IWidgetInstance)
        ], PDFComponent.prototype, "widgetInstance", void 0);
        __decorate([
            core_1.HostListener('document:keydown', ['$event']),
            __metadata("design:type", Function),
            __metadata("design:paramtypes", [KeyboardEvent]),
            __metadata("design:returntype", void 0)
        ], PDFComponent.prototype, "keypress", null);
        PDFComponent = __decorate([
            core_1.Component({
                template: "\n        <div class=\"parent-layout\">\n            <!--  Top Button Row   -->\n            <div class=\"icon-row\">\n                <div style=\"cursor: pointer\" (click)=\"showEakte = false\">\n                    <div><img [src]=\"topMenuItems.AKTUALISIEREN.icon\" class=\"main-menu-icon-image\"/></div>\n                    <div class=\"header-label\">{{topMenuItems.AKTUALISIEREN.label}}</div>\n                </div>\n                <div style=\"cursor: pointer\">\n                    <div><img [src]=\"topMenuItems.WEITERLEITEN.icon\" class=\"main-menu-icon-image\"/></div>\n                    <div class=\"header-label\">{{topMenuItems.WEITERLEITEN.label}}</div>\n                </div>\n                <div style=\"cursor: pointer\">\n                    <div><img [src]=\"topMenuItems.TRENNEN.icon\" class=\"main-menu-icon-image\"/></div>\n                    <div class=\"header-label\">{{topMenuItems.TRENNEN.label}}</div>\n                </div>\n                <div style=\"cursor: pointer\" [ngClass]=\"{'setFocus' : showForm}\" (click)=\"editForm()\">\n                    <div><img [src]=\"topMenuItems.BEARBEITEN.icon\"\n                              class=\"main-menu-icon-image\"/></div>\n                    <div class=\"header-label\">{{topMenuItems.BEARBEITEN.label}}</div>\n                </div>\n                <div style=\"cursor: pointer\" [ngClass]=\"{'setFocus' : showEakte}\"\n                     (click)=\"showEakte = true; showForm = false\">\n                    <div><img [src]=\"topMenuItems.EAKTE.icon\" class=\"main-menu-icon-image\"/></div>\n                    <div class=\"header-label\">{{topMenuItems.EAKTE.label}}</div>\n                </div>\n                <div style=\"cursor: auto\">\n                    <div><img [src]=\"topMenuItems.HWSCXS.icon\" class=\"main-menu-icon-image\"/></div>\n                    <div class=\"header-label\">{{topMenuItems.HWSCXS.label}}</div>\n                </div>\n            </div>\n\n            <!-- First Tab -->\n            <ng-container *ngIf=\"!showEakte\">\n                <div style=\"width: 100%; display: flex; padding: 10px; overflow: auto; background-color: #f0f0f0;\">\n                    <div style=\"width: 50%; overflow: auto; display: grid; padding-top: 27px\">\n                        <div class=\"grid-header\">\n                            <div style=\"width: 10%; text-align: center\" (click)=\"sortListBy('checked')\">Vetr.<img\n                                    [src]=\"sortIcon\" class=\"sort\"/></div>\n                            <div style=\"width: 12%\" (click)=\"sortListBy('date')\">Datum<img [src]=\"sortIcon\"\n                                                                                           class=\"sort\"/></div>\n                            <div style=\"width: 13%\" (click)=\"sortListBy('sender')\">Absender<img [src]=\"sortIcon\"\n                                                                                                class=\"sort\"/></div>\n                            <div style=\"width: 20%\" (click)=\"sortListBy('cashRegister')\">Kassenzeichen<img\n                                    [src]=\"sortIcon\" class=\"sort\"/></div>\n                            <div style=\"width: 15%\" (click)=\"sortListBy('lastName')\">Nachname<img\n                                    [src]=\"sortIcon\" class=\"sort\"/></div>\n                            <div style=\"width: 15%\" (click)=\"sortListBy('firstName')\">Vorname<img [src]=\"sortIcon\"\n                                                                                                  class=\"sort\"/></div>\n                            <div style=\"width: 15%\" (click)=\"sortListBy('entrance')\">Eingang<img [src]=\"sortIcon\"\n                                                                                                 class=\"sort\"/></div>\n                        </div>\n                        <div style=\"overflow: auto\">\n                            <div *ngFor=\"let item of sampleListItems;\"\n                                 style=\"display: flex; background: white; height: 30px; cursor: pointer; margin-top: 7px;\"\n                                 class=\"list-item\"\n                                 [style.background-image]=\"item.selected ? 'linear-gradient(0deg, #2b79a7 0%, #4ebbfb 50%, #2b79a7 100%)' : null\"\n                                 [style.color]=\"item.selected ? 'white' : 'black'\"\n                                 (click)=\"selectRow(item)\">\n                                <div style=\"width: 10%; margin: auto 0\">\n                                    <img style=\"margin: auto auto; display: block\" [src]=\"checkMark\" width=\"20\"\n                                         *ngIf=\"item.checked\">\n                                </div>\n                                <div style=\"width: 12%; margin: auto 0\">{{item.date}}</div>\n                                <div style=\"width: 13%; margin: auto 0\">{{item.sender}}</div>\n                                <div style=\"width: 20%; margin: auto 0\">{{item.cashRegister}}</div>\n                                <div style=\"width: 15%; margin: auto 0\">{{item.lastName}}</div>\n                                <div style=\"width: 15%; margin: auto 0\">{{item.firstName}}</div>\n                                <div style=\"width: 15%; margin: auto 0\">{{item.entrance}}</div>\n                            </div>\n                        </div>\n                        <div *ngIf=\"showForm\" style=\"padding-top: 10px\">\n                            <div class=\"form-container\">\n                                <div class=\"form-fields-container\">\n                                    <div class=\"field\">\n                                        <label>User</label>\n                                        <input type=\"text\" class=\"smaller-text-field search-icon\"\n                                               [(ngModel)]=\"selectedRow.sender\">\n                                    </div>\n\n                                    <div class=\"field\">\n                                        <label></label>\n                                        <span style=\"font-size:14px\">Obermeier, Klaus</span>\n                                    </div>\n\n                                    <div class=\"field\">\n                                        <label>Kassenzeichen</label>\n                                        <input type=\"text\" class=\"smaller-text-field\"\n                                               [(ngModel)]=\"selectedRow.cashRegister\">\n                                    </div>\n                                    <div>&nbsp;</div>\n\n                                    <div class=\"field\">\n                                        <label>Nachname</label>\n                                        <input type=\"text\" class=\"smaller-text-field\"\n                                               [(ngModel)]=\"selectedRow.firstName\">\n                                    </div>\n\n                                    <div class=\"field\">\n                                        <label>Vorname</label>\n                                        <input type=\"text\" class=\"smaller-text-field\"\n                                               [(ngModel)]=\"selectedRow.lastName\">\n                                    </div>\n\n                                    <div class=\"field\" style=\"grid-row:4; grid-column: 1 / -1\">\n                                        <label>Eingang</label>\n                                        <input type=\"text\" class=\"smaller-text-field\"\n                                               [(ngModel)]=\"selectedRow.entrance\"\n                                               style=\"width:90%\">\n                                    </div>\n\n                                    <div class=\"field\" style=\"grid-row:5; grid-column: 1 / -1\">\n                                        <label>Dokumentenbezeichnung</label>\n                                        <input type=\"text\" class=\"smaller-text-field search-icon\"\n                                               value=\"Ruckleuf EMA\"\n                                               style=\"width:90%\">\n                                    </div>\n                                </div>\n                                <div class=\"push-to-bottom\">\n                                    <div></div>\n                                    <div>\n                                        <button class=\"outlined-button\" (click)=\"showForm = false\">schlie\u00DFen</button>\n                                    </div>\n                                </div>\n                                <div class=\"push-to-bottom\">\n                                    <div></div>\n                                    <div>\n                                        <button class=\"filled-button\">eAkte</button>\n                                    </div>\n                                    <div>\n                                        <button [ngClass]=\"isFormValid() ? 'filled-button' : 'disabled-button'\"\n                                                (click)=\"saveForm()\"\n                                                [disabled]=\"!isFormValid()\">\n                                            Speichern\n                                        </button>\n                                    </div>\n                                </div>\n                            </div>\n                        </div>\n                    </div>\n                    <div style=\"width: 50%; height: 100%; padding: 43px 20px 0 30px;\">\n                        <iframe src=\"https://www.muhammadbinyusrat.com/devguide.pdf\" width=\"100%\" height=\"100%\"\n                                class=\"pdf-container-style\"></iframe>\n                    </div>\n                </div>\n            </ng-container>\n            <ng-container *ngIf=\"showEakte\">\n                <div style=\"background-color: #f0f0f0; padding: 10px; font-size: 13px; font-weight: bold\">\n                    <div>Inhaltsverzeichnis von: Testfall Hugo, 01/10/1752, Kajutenweg 5, 31134 HILLDESHEIM</div>\n                    <div style=\"margin-top: 10px\">Kassenzeichen: {{selectedRow.cashRegister}}</div>\n                    <div style=\"width: 200px; margin-top: 10px\">\n                        <button class=\"filled-button\">\n                            Inhaltsverzeichnis dr\u00FCcken\n                        </button>\n                    </div>\n                </div>\n                <div style=\"width: 100%; display: flex; padding: 10px; overflow: auto; background-color: #f0f0f0;\">\n                    <div style=\"width: 50%; overflow: auto; display: grid\">\n                        <div class=\"grid-header\">\n                            <div style=\"width: 20%;text-align: center\">Datum/Uhrzeit</div>\n                            <div style=\"width: 39%\">Dokument</div>\n                            <div style=\"width: 10%\">am</div>\n                            <div style=\"width: 10%\">Hinweis</div>\n                            <div style=\"width: 10%\">Vordruck</div>\n                            <div style=\"width: 11%\">User</div>\n                        </div>\n                        <div style=\"overflow: auto\">\n                            <div *ngFor=\"let item of sampleEakteItems;\"\n                                 style=\"display: flex; background: white; height: 30px; cursor: pointer; margin-top: 7px;\"\n                                 class=\"list-item\"\n                                 [style.background-image]=\"item.selected ? 'linear-gradient(0deg, #2b79a7 0%, #4ebbfb 50%, #2b79a7 100%)' : null\"\n                                 [style.color]=\"item.selected ? 'white' : 'black'\"\n                                 (click)=\"selectEakteRow(item)\">\n                                <div style=\"width: 20%; text-align: center; margin: auto 0\">{{item.date}}</div>\n                                <div style=\"width: 39%; margin: auto 0\">{{item.document}}</div>\n                                <div style=\"width: 10%; margin: auto 0\">{{item.am}}</div>\n                                <div style=\"width: 10%; margin: auto 0\">{{item.hinweis}}</div>\n                                <div style=\"width: 10%; margin: auto 0\">{{item.vordruck}}</div>\n                                <div style=\"width: 11%; margin: auto 0\">{{item.user}}</div>\n                            </div>\n                        </div>\n                    </div>\n                    <div style=\"width: 50%; height: 100%; padding: 15px 20px 0 30px;\">\n                        <iframe [src]=\"selectedEakteRowPDF\" width=\"100%\" height=\"100%\"\n                                class=\"pdf-container-style\"></iframe>\n                    </div>\n                </div>\n            </ng-container>\n        </div>\n    ",
                styles: ["\n        .parent-layout {\n            display: grid;\n            grid-template-rows: auto 1fr;\n            height: 100%;\n        }\n\n        .icon-row {\n            padding-top: 10px;\n            padding-bottom: 10px;\n            background-image: linear-gradient(0deg, #2b79a7 0%, #4ebbfb 50%, #2b79a7 100%);\n            color: white;\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(50px, 1fr));\n            text-align: center;\n        }\n\n        .header-label {\n            text-align: center;\n            margin-top: 5px;\n            letter-spacing: 1px;\n            -webkit-transform: scale(1, 1.5); /* chrome and safari */\n            -moz-transform: scale(1, 1.5); /* opera */\n        }\n\n        .grid-header {\n            width: calc(100% - 8px); /*excluding scroller width*/\n            display: flex;\n            color: #909090;\n            cursor: pointer;\n        }\n\n        .main-menu-icon-image {\n            filter: invert(87%) sepia(98%) saturate(1%) hue-rotate(268deg) brightness(109%) contrast(97%);\n            width: 50px;\n        }\n\n        .pdf-container-style {\n            box-shadow: 0 10px 6px -6px #777;\n        }\n\n        .list-item:hover {\n            box-shadow: 0 0 11px rgba(33, 33, 33, .2);\n        }\n\n        .setFocus {\n            filter: invert(87%) sepia(98%) saturate(1%) hue-rotate(268deg) brightness(109%) contrast(97%);\n        }\n\n        .sort {\n            width: 12px;\n            margin-bottom: -3px;\n            margin-left: 2px;\n            opacity: 0.5;\n        }\n\n        .form-container {\n            padding: 10px;\n            display: grid;\n            grid-template-columns: 1fr auto auto;\n            gap: 1rem;\n            background-color: white;\n            height: 100%;\n            box-shadow: 0 10px 6px -6px #777;\n        }\n\n        .form-fields-container {\n            display: grid;\n            grid-template-columns: 1fr 1fr;\n        }\n\n        .smaller-text-field {\n            font-size: 13px;\n            height: 20px;\n            width: 80%;\n        }\n\n        .push-to-bottom {\n            display: grid;\n            grid-template-rows: 1fr auto;\n            gap: 1rem;\n        }\n\n        .outlined-button {\n            width: 100%;\n            border: 2px solid #2678a9;\n            padding: 3px 6px;\n            color: #2678a9;\n            border-radius: 5px;\n        }\n\n        .outlined-button:hover {\n            background-color: #2678a9;\n            color: white;\n        }\n\n        .disabled-button {\n            width: 100%;\n            border: 2px solid #eeeeee;\n            padding: 3px 6px;\n            color: #ababab;\n            border-radius: 5px;\n            background-color: #eeeeee;\n            cursor: auto;\n        }\n\n        .filled-button {\n            width: 100%;\n            border: 2px solid #2678a9;\n            padding: 3px 6px;\n            color: white;\n            border-radius: 5px;\n            background-color: #2678a9;\n        }\n\n        .filled-button:hover {\n            background-color: white;\n            color: cornflowerblue;\n        }\n\n        .search-icon {\n            background: url(\"data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCIgZmlsbD0iYmxhY2siIHdpZHRoPSIxOHB4IiBoZWlnaHQ9IjE4cHgiPjxwYXRoIGQ9Ik0wIDBoMjR2MjRIMHoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMTUuNSAxNGgtLjc5bC0uMjgtLjI3QzE1LjQxIDEyLjU5IDE2IDExLjExIDE2IDkuNSAxNiA1LjkxIDEzLjA5IDMgOS41IDNTMyA1LjkxIDMgOS41IDUuOTEgMTYgOS41IDE2YzEuNjEgMCAzLjA5LS41OSA0LjIzLTEuNTdsLjI3LjI4di43OWw1IDQuOTlMMjAuNDkgMTlsLTQuOTktNXptLTYgMEM3LjAxIDE0IDUgMTEuOTkgNSA5LjVTNy4wMSA1IDkuNSA1IDE0IDcuMDEgMTQgOS41IDExLjk5IDE0IDkuNSAxNHoiLz48L3N2Zz4=\") no-repeat right;\n        }\n    "]
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