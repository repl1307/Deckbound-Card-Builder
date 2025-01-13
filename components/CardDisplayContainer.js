import { Box, UI } from 'zephyr-ui';
import '../css/card-display.css';

export default class CardDisplayContainer extends Box {
    constructor(){
        super();
        this.center().addClass('card-display-container');
        this.card = this.addCard();
    }
    addCard(){
        const card = new Box().addClass('card');
        card.name = new UI('p')
            .setText('Card Name')
            .addClass('name');
        card.image = new UI('img')
            .addClass('image')
            .setAttribute('alt', 'Card Image');
        card.description = new UI('p')
            .setText('Card Description')
            .addClass('description');
        card.spiritCost = new UI('p').addClass('spirit-cost')

        card.append([ card.name, card.image, card.description, card.spiritCost ])
        this.append(card);
        return card;
    }
}