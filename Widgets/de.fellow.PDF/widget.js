define(["require", "exports", "./mian"], function (require, exports, mian_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.widgetFactory = void 0;
    exports.widgetFactory = function (context) {
        return {
            angularConfig: {
                moduleType: mian_1.PDFModule,
                componentType: mian_1.PDFComponent
            }
        };
    };
});
//# sourceMappingURL=widget.js.map