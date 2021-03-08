import { IWidgetContext, IWidgetInstance } from "lime";
import {PDFComponent, PdfModule} from './main';

export const widgetFactory = (context: IWidgetContext): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: PdfModule,
			componentType:PDFComponent
		}
	};
};
