import { LitElement, html } from "lit";
import { customElement, property } from "lit/decorators.js";
import { app } from "../config";

@customElement("pt-form")
class PtForm extends LitElement {
    @property()
    name?: string;

    @property({
        type: Object,
        converter: {
            fromAttribute: (value: string | null) => {
                if (value === null) return undefined;
                return app.parseModel(value);
            },
            toAttribute: (value: ReturnType<typeof app.createModel> | undefined) => {
                if (value === undefined) return null;
                return app.stringifyModel(value);
            },
        },
    })
    config?: ReturnType<typeof app.createModel>;

    render() {
        return html` <div>${app.stringifyModel(this.config!)}</div> `;
    }
}
