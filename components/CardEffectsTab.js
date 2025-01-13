import { UI, Box } from 'zephyr-ui';
import { CardEffect, Effects, Targets } from './Card';

const effectsList = [];
const targetsList = [];

for(const [key, value] of Object.entries(Effects)){
    effectsList.push({
        name: value,
        value: key
    });
}
for(const [key, value] of Object.entries(Targets)){
    targetsList.push({
        name: value,
        value: key
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
        this.addEffectButton = new Box('button').addClass('export-button').setText('Add Effect').center()
            .onClick(e => this.addEffect());
        this.append(this.addEffectButton);
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

    addEffect(){
        const container = new Box().addClass('effect-container');
        const name = new Box().addClass('name').setText(this.effectsDropdown.html.value);
        const duration = new Box().addClass('duration').setText(this.duration.html.value + ' Turns');
        duration.addEventListener('input', e => acceptNumbersOnly(duration, e));
        const targets = new Box().addClass('targets').setText(this.targetDropdown.html.value);
        const cardEffect = new CardEffect(this.effectsDropdown.value, Number(this.duration.html.value), this.targetDropdown.html.value);
        this.effects.push(cardEffect);

        const removeButton = new Box().setText('X').addClass('remove-button').onClick(e => {
            container.remove();
            const index = this.children.indexOf(container);
            this.children.splice(index);
            this.effects.splice(index);
        });
        container.append([name, duration, targets, removeButton]);
        this.currentEffects.append(container);

        return container;
    }

    addEffectHeader(header){
        header.append(new Box().setText('Current Effects').setStyle('padding', '0.5rem'));
        const container = new Box().addClass('effect-container').setStyle('font-size', '1.25rem');
        const name = new Box().addClass('name').setText('Name');
        const duration = new Box().addClass('duration').setText('Duration');
        const targets = new Box().addClass('targets').setText('Targets');

        container.append([ name, duration, targets ]);
        header.append(container);
        return container;
    }

    //option -- {name: string, value: any}
    addDropdown(name, options=[]){
        const container = new Box().addClass('card-input');
        const span = new UI('span').setText(name);
        const dropdown = new UI('select');
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
            console.log("Got value!: "+ inputField.html.value);
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