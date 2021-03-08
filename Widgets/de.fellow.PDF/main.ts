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

@Component({
    template: `
        <div class="parent-layout">
            <div>
                <!--  Top Button Row   -->
                <div class="icon-row">
                    <div *ngFor="let menuItem of topMenuItems;">
                        <div style="display: grid; grid-template-rows: 1fr minmax(25px, auto);" class="main-menu-icon">
                            <div style="text-align: center"><img [src]="menuItem.icon" class="main-menu-icon-image"/>
                            </div>
                            <div style="text-align: center">{{menuItem.label}}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="body-grid">

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
                            style="box-shadow: 0 10px 6px -6px #777;"></iframe>
                </div>

                <!-- Form  -->
                <div class="form-box">
                    <div class="form-container">
                        
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
            grid-template-columns: 1fr 1fr;
            grid-template-rows: 1fr 1fr;
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
            display: grid;
            grid-template-columns: 1fr auto auto;
            background-color: white;
            height: 100%;
            box-shadow: 0 10px 6px -6px #777;        }
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
}

@NgModule({
    imports: [CommonModule, SohoListViewModule, ReactiveFormsModule, FormsModule],
    declarations: [PDFComponent],
    entryComponents: [PDFComponent]
})
export class PdfModule {
}
