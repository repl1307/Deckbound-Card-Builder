import { UI, Box } from 'zephyr-ui';
import { CardEffect, Effects, Targets } from './Card';

const effectsList = [];
const targetsList = [];

const effectEntries = Object.entries(Effects)
.filter(([key]) => !isNaN(Number(key)))
.map(([key, value]) => [Number(key), value]);

const targetEntries = Object.entries(Targets)
    .filter(([key]) => !isNaN(Number(key)))
    .map(([key, value]) => [Number(key), value]);

console.log('target entries');
console.log(targetEntries);

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
        this.duration = this.addNumInput('Duration/Value', 0, 1000);
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

        const effectValue = this.effectsDropdown.html.value;
        const targetValue = this.targetDropdown.html.value;

        const targetText = targetEntries.find(entry => entry[0] == targetValue)[1];
        const nameText = effectEntries.find(entry => entry[0] == effectValue)[1];
        name.setText(nameText);

        // set duration text
        let durationText = this.duration.html.value;
        if(effectValue != Effects.Damage && effectValue != Effects.Shield && effectValue != Effects.Heal)
            durationText += ' Turns';

        const duration = new Box().addClass('duration').setText(durationText);
        duration.addEventListener('input', e => acceptNumbersOnly(duration, e));
        const targets = new Box().addClass('targets').setText(targetText);
        const cardEffect = new CardEffect(Number(this.effectsDropdown.getValue()), Number(this.duration.html.value), Number(this.targetDropdown.html.value));
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
        const duration = new Box().addClass('duration').setText('Duration/Value');
        const targets = new Box().addClass('targets').setText('Target');

        container.append([ name, duration, targets ]);
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