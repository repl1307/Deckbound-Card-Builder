import * as Zephyr from'zephyr-ui';
import CardInputContainer from './components/CardInputContainer';
import CardDisplayContainer from './components/CardDisplayContainer';
import './css/main.css';

const root = new Zephyr.Root();
const main = new Zephyr.Box().addClass('main');

const header = new Zephyr.Box().addClass('site-header').setText('Deckbound Card Builder');
const cardEditor = new Zephyr.Box().addClass('card-editor');

const cardInput = new CardInputContainer();
const cardDisplay = new CardDisplayContainer();

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

//limit text area lines
function limitLines(e, maxLines){
    const lines = e.target.value.split('\n');
    if(lines.length > maxLines)
        e.target.value = lines.slice(0, maxLines).join('\n');
}

// name
cardInput.name.addEventListener('input', e => {
    const value = e.target.value == ''? 'Card Name' : e.target.value;
    cardDisplay.card.name.setText(value);
});

// image
cardInput.gallery.onImageSelect = (file, path) => {
    if(file.files.length > 0) return;
    cardDisplay.card.image.setAttribute('src', path);
    cardInput.galleryPath.setText(cardInput.gallery.getFullPath() + '/' + file.name);
};

// description
cardInput.description.addEventListener('input', e =>  {
    limitLines(e, 11);
    const value = e.target.value == ''? 'Card Description' : e.target.value;
    cardDisplay.card.description.setText(value);
});

//spirit cost
cardInput.spiritCost.addEventListener('input', e => {
    const input = cardInput.spiritCost.children.at(-1);
    acceptNumbersOnly(input, e);
    cardDisplay.card.spiritCost.setText(e.target.value);
});

//sequence
cardInput.sequence.addEventListener('input', e => {
    const input = cardInput.sequence.children.at(-1);
    acceptNumbersOnly(input, e);
});

cardEditor.append([cardInput, cardDisplay]);
main.append([header, cardEditor]);

root.append(main);