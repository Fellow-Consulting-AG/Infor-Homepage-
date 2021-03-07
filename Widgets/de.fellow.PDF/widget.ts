import { IWidgetContext, IWidgetInstance } from "lime";
import {PDFComponent, PDFModule} from './mian';

export const widgetFactory = (context: IWidgetContext): IWidgetInstance => {
	return {
		angularConfig: {
			moduleType: PDFModule,
			componentType:PDFComponent
		}
	};
};
