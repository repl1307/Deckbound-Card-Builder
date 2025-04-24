import { Box, UI } from 'zephyr-ui';
import '../css/card-input.css';
import Gallery from './Gallery';
import Popup from './Popup';
import { Card } from './Card';
import Tabs from './Tabs';
import CardEffectsTab from './CardEffectsTab';

export default class CardInputContainer extends Box {
    constructor(){
        super();
        this.addClass('card-input-container');
        this.tabs = new Tabs();
        this.append(this.tabs);
        const infoTab = new Box().column().setStyle('flex', 1);
        this.name = this.addInput('Name', 'input', 50).addClass('card-input');
        this.spiritCost = this.addNumInput('Spirit Cost', 0, 100);
        this.sequence = this.addNumInput('Sequence', 0, 9);
        this.createPathwaySelect();
        this.image = this.addImageInput('Image');
        this.description = this.addInput('Description','textarea', 200).addClass('card-text-area');
        this.description.children.at(-1).setAttribute('rows', 10);

        infoTab.append([this.name, this.spiritCost, this.sequence, this.pathwayGroup, this.pathway, this.image, this.description]);
        this.tabs.addTab('Info', infoTab);
        this.cardEffectsTab = new CardEffectsTab();
        this.tabs.addTab('Effects', this.cardEffectsTab);
        this.tabs.setTab('Info');
        this.addExportButton();
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
        // this.append(inputContainer);
        return inputContainer;
    }

    addNumInput(inputName, min=0, max=100){
        const inputContainer = this.addInput(inputName, 'input').addClass('card-input');
        inputContainer.children.at(-1)
            .setAttribute('type', 'number')
            .setAttribute('min', min.toString())
            .setAttribute('max', max.toString());
        return inputContainer;
    }

    addImageInput(inputName){
        // card image gallery
        const gallery = new Gallery();
        this.gallery = gallery;
        this.gallery.setStyle('display', 'none');
        this.append(gallery);

        // input button
        const inputContainer = new Box().addClass('card-input');
        const label = new UI('span').setText(inputName);
        const path = new UI('span').setText().addClass('path');
        const openGalleryButton = new UI('button').setText('Pick Image').addClass('open-gallery-button');
        openGalleryButton.onClick(e => {
            gallery.setStyle({
                display:  'flex',
                top: '0.5rem',
                left: '0.5rem'
            });
        });

        this.galleryPath = path;
        inputContainer.getValue = () => {
            return path.getText();
        }
        inputContainer.append([label, path, openGalleryButton]);

        // this.append(inputContainer);
        return inputContainer;
    }

    addExportButton(){
        const popup = new Popup();
        const container = new Box().addClass('card-input', 'export-button-container');
        const button = new UI('button').setText('Export').addClass('export-button');
        container.append(button);
        this.exportButton = button;
        this.exportButton.onClick(e => {
            //error handling
            const name = this.name.getValue();
            const description = this.description.getValue();
            const spiritCost = Number(this.spiritCost.getValue());
            let art = this.image.getValue();
            const sequence = Number(this.sequence.getValue());
            const pathway = this.pathway.getValue();
            const pathwayGroup = this.pathwayGroup.getValue();
            const effects = this.cardEffectsTab.effects;

            if(!art.includes('.')){
                alert('Add a card image :(');
                return;
            }
            art = art.split('.')[0];

            const card = new Card({ name, description, spiritCost, art, sequence, pathway, pathwayGroup, effects});
            popup.show();
            popup.setCode(JSON.stringify(card, null, 2), 'js');
        });
        this.append([container, popup.backdrop]);
    }

    createPathwaySelect(){
        this.pathwayGroup = new Box().addClass('card-input');
        const label = new UI('span').setText('Pathway Group');
        const select = new UI('select');
        this.pathwayGroup.append([label, select]);

        const pathwayGroups = [
            {
                name: 'Lord of Mysteries',
                paths: ['Fool', 'Error', 'Door']
            },
            {
                name: 'God Almighty',
                paths: ['Visionary', 'Sun', 'Tyrant', 'White Tower', 'Hanged Man']
            },
            {
                name: 'Eternal Darkness',
                paths: ['Darkness', 'Death', 'Twilight Giant']
            },
            {
                name: 'Calamity of Destruction',
                paths: ['Demoness', 'Red Priest']
            },
            {
                name: 'Demon of Knowledge',
                paths: ['Hermit', 'Paragon']
            },
            {
                name: 'Key of Light',
                paths: ['Wheel of Fortune']
            },
            {
                name: 'Goddess of Origin',
                paths: ['Mother', 'Moon']
            },
            {
                name: 'Father of Devils',
                paths: ['Abyss', 'Chained']
            },
            {
                name: 'The Anarchy',
                paths: ['Black Emperor', 'Justiciar']
            }
        ];

        for(const group of pathwayGroups){
            const option = new UI('option').setText(group.name).setAttribute('value', group.name);
            select.append(option);
        }
        
        this.pathway = new Box().addClass('card-input');
        const pathwayLabel = new UI('span').setText('Pathway');
        const pathwaySelect = new UI('select');
        this.pathway.append([pathwayLabel, pathwaySelect]);
        for(const path of pathwayGroups[0].paths){
            const option = new UI('option').setText(path).setAttribute('value', path);
            pathwaySelect.append(option);
        }

        select.addEventListener('input', e => {
            select.setAttribute('value', e.target.value);
            const pathwayGroup = pathwayGroups.find(group => group.name == select.getAttribute('value'));

            pathwaySelect.children.forEach(child => child.remove());
            pathwaySelect.children = [];

            for(const path of pathwayGroup.paths){
                const option = new UI('option').setText(path).setAttribute('value', path);
                pathwaySelect.append(option);
            }
        });

        this.pathway.getValue = () => {
            return pathwaySelect.html.value;
        }
        this.pathwayGroup.getValue = () => {
            return select.html.value;
        };

        // this.append(this.pathwayGroup);
        // this.append(this.pathway);
    }
}