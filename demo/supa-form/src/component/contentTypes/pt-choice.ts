import { html } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { PtBase, PtBaseData } from '../pt-base';
import { BasicData } from '..';

@customElement('pt-choice')
class PtChoice extends PtBaseData {
    @property({ type: Object })
    data?: ChoiceQuestion;

    render() {
        if (!this.value) {
            this.value = this.data!.textChoices.find((x) => x.defaultSelected)!.value;
        }

        return html`
        <fieldset>
  <legend>${this.data?.question}</legend>

  ${this.data!.textChoices.map(
      (x) => html`
  <div class="flex items-center mb-4">
    <input id="${x.id}" type="radio" name="choices" value="${x.value}" ?checked=${
          this.value ? this.value == x.value : x.defaultSelected
      } @change=${(e: any) =>
          this.onChange(
              e.target.value
          )} class="w-4 h-4 border-gray-300 focus:ring-2 focus:ring-blue-300 dark:focus:ring-blue-600 dark:focus:bg-blue-600 dark:bg-gray-700 dark:border-gray-600" checked>
    <label for="${x.id}" class="block ms-2  text-sm font-medium text-gray-900 dark:text-gray-300">
      ${x.value}
    </label>
  </div>
  `
  )}
</fieldset>
        `;
    }

    onChange(value: string) {
        this.value = value;
    }
}

interface ChoiceQuestion extends BasicData {
    question: string;
    textChoices: Choice[];
}

interface Choice {
    id: string;
    defaultSelected: boolean;
    value: string;
}
