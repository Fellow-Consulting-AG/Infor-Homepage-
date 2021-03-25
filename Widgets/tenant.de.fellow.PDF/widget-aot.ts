import { IWidgetContext, IWidgetInstance } from "lime";
import { PDFComponent} from "./main";
import { PdfModuleNgFactory } from "./main.ngfactory";

export const widgetFactory = (context: IWidgetContext): IWidgetInstance => {
	return {
		angularConfig: {
			moduleFactory: PdfModuleNgFactory,
			componentType: PDFComponent
		}
	};
};
