import { UI, Box } from 'zephyr-ui';
import { CardEffect, Effects, Targets } from './Card';

const effectsList = [];
const targetsList = [];

// effects and targets are enums, in order to make them compatible with vanilla js, they are converted to key-value arrays
const effectEntries = Object.entries(Effects)
.filter(([key]) => !isNaN(Number(key)))
.map(([key, value]) => [Number(key), value]);

const targetEntries = Object.entries(Targets)
    .filter(([key]) => !isNaN(Number(key)))
    .map(([key, value]) => [Number(key), value]);

for(const entry of targetEntries){
    targetsList.push({
        name: entry[1],
        value: entry[0]
    });
}
for(const entry of effectEntries){
    effectsList.push({
        name: entry[1],
        value: entry[0]
    });
}

export default class CardEffectsTab extends Box {
    constructor(){
        super();
        this.addClass('card-input-container');
        this.effects = [];
        this.effectsDropdown = this.addDropdown('Effect', effectsList);
        this.targetDropdown = this.addDropdown('Target', targetsList);
        this.duration = this.addNumInput('Duration', 0, 1000);
        this.effectValue = this.addNumInput('Value', 0, 1000);

        // only accept numbers for duration and value
        this.duration.addEventListener('input', e => acceptNumbersOnly(this.duration, e));
        this.effectValue.addEventListener('input', e => acceptNumbersOnly(this.effectValue, e));

        this.addEffectButton = new Box('button').addClass('export-button').setText('Add Effect').center()
            .onClick(e => this.addEffect());
        this.append(this.addEffectButton);

        //effects preview table
        {
            const currentEffectsContainer = new Box().addClass('current-effects');
            const header = new Box().addClass('header');
            this.addEffectHeader(header);
            currentEffectsContainer.append(header);

            const body = new Box().addClass('body');
            currentEffectsContainer.append(body);
            this.currentEffects = body;
            this.append(currentEffectsContainer)
        }
    }

    // adds effect to table preview, and stores card effect data
    addEffect(){
        const container = new Box().addClass('effect-container');
        const name = new Box().addClass('name').setText(this.effectsDropdown.html.value);

        const effectValue = this.effectsDropdown.html.value;
        const targetValue = this.targetDropdown.html.value;

        // using dropdown index, get corresponding strings from arrays
        const targetText = targetEntries.find(entry => entry[0] == targetValue)[1];
        const nameText = effectEntries.find(entry => entry[0] == effectValue)[1];
        name.setText(nameText);

        // set duration text
        let durationText = this.duration.html.value + ' Turns';
        let valueText = this.effectValue.html.value;

        const duration = new Box().addClass('duration').setText(durationText);
        const value = new Box().addClass('effect-value').setText(valueText);
        const targets = new Box().addClass('targets').setText(targetText);
        const cardEffect = new CardEffect(Number(this.effectsDropdown.getValue()), Number(this.duration.html.value), Number(this.effectValue.html.value), Number(this.targetDropdown.html.value));
        this.effects.push(cardEffect);

        const removeButton = new Box().setText('X').addClass('remove-button').onClick(e => {
            container.remove();
            const index = this.children.indexOf(container);
            this.children.splice(index);
            this.effects.splice(index);
        });
        container.append([name, duration, value, targets, removeButton]);
        this.currentEffects.append(container);

        return container;
    }

    addEffectHeader(header){
        header.append(new Box().setText('Current Effects').setStyle('padding', '0.5rem'));
        const container = new Box().addClass('effect-container').setStyle('font-size', '1.25rem');
        const name = new Box().addClass('name').setText('Effect Type');
        const duration = new Box().addClass('duration').setText('Duration');
        const value = new Box().addClass('value').setText('Value');
        const targets = new Box().addClass('targets').setText('Target');

        container.append([ name, duration, value, targets ]);
        header.append(container);
        return container;
    }

    //option -- {name: string, value: any}
    addDropdown(name, options=[]){
        const container = new Box().addClass('card-input');
        const span = new UI('span').setText(name);
        const dropdown = new UI('select');
        dropdown.getValue = () => { 
            return dropdown.html.value;
        };
        for(const opt of options){
            const option = new UI('option').setText(opt.name).setAttribute('value', opt.value);
            dropdown.append(option);
        }
        container.append([span, dropdown]);
        this.append(container);
        return dropdown;
    }

    addInput(inputName, tag='input', inputLength=null){
        const inputContainer = new Box();
        const label = new UI('span').setText(inputName);
        const inputField = new UI(tag).setAttribute('type', 'text');
        if(inputLength)
            inputField.setAttribute('maxlength', inputLength);
        inputContainer.append([label, inputField]);
        inputContainer.getValue = () => {
            return inputField.html.value;
        };
        this.append(inputContainer);
        return inputContainer;
    }

    addNumInput(inputName, min=0, max=100){
        const inputContainer = this.addInput(inputName, 'input').addClass('card-input');
        inputContainer.children.at(-1)
            .setAttribute('type', 'number')
            .setAttribute('min', min.toString())
            .setAttribute('max', max.toString());
        return inputContainer.children.at(-1);
    }
}

// convert input to numbers within min-max
function acceptNumbersOnly(input, e){
    e.target.value = e.target.value.replace(/[^0-9\.]/g, '');
    const max = Number(input.getAttribute('max'));
    const min = Number(input.getAttribute('min'));
    console.log(min+ ' '+max);
    if(e.target.value > max)
        e.target.value = max;
    if(e.target.value < min)
        e.target.value = min;
}