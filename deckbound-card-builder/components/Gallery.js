import { Box, UI } from 'zephyr-ui';
import '../css/gallery.css';

const imagePaths = {
    name: 'Images',
    files: [
        { name: 'bluestuff.jpg', files: [] },
        { name: 'wizard.png', files: [] },
        {
            name: 'Fool',
            files: [
                { name: 'wizard.png', files: [] },
            ]
        }
    ]
}

export default class Gallery extends Box {
    constructor(){
        super();
        this.addClass('gallery');
        this.imagePaths = imagePaths;
        this.currentPath = imagePaths;
        this.previousPaths = [];
        this.onImageSelect = () => {};
        addHeader(this);
        addImagesContainer(this);
        makeDraggable(this, this.header);
    }
    getFullPath(){
        let previousPathName = 'Cards';
        this.previousPaths.forEach(path => previousPathName += '/'+path.name);
        return previousPathName + '/' + this.currentPath.name;
    }
}

// adds header
function addHeader(elem){
    elem.header = new Box().addClass('header');
    const text = new Box().addClass('text').setText('Gallery');
    elem.exitButton = new Box().addClass('exit-button');
    elem.exitButton.onClick(e => {
        elem.setStyle('display', 'none');
    });

    elem.header.append([text, elem.exitButton])
    elem.append(elem.header);
}

// adds image container
function addImagesContainer(elem){
    elem.imagesContainer = new Box().addClass('images-container');
    elem.pathDisplayContainer = new Box().addClass('path-display-container');
    elem.pathDisplay = new Box().addClass('path-display');
    elem.backButton = new Box().addClass('back-button');
    elem.backButton.onClick(e => {
        if(elem.previousPaths.length == 0) return;
        elem.currentPath = elem.previousPaths.pop();
        displayPaths(elem)
    });
    elem.pathDisplayContainer.append([elem.pathDisplay, elem.backButton]);
    displayPaths(elem);
    elem.append([elem.imagesContainer, elem.pathDisplayContainer]);
}

//display little interactable blocks for every image path
function displayPaths(elem){
    elem.imagesContainer.children.forEach(child => child.remove());
    elem.children = [];

    const { currentPath, previousPaths } = elem;

    let previousPathName = '';
    previousPaths.forEach(path => previousPathName += '/'+path.name);
    elem.pathDisplay.setText(elem.getFullPath());

    for(const file of currentPath.files){
        const fileElem = new Box().addClass('file');
        const path = 'images/Cards' + previousPathName + '/' + currentPath.name + '/' + file.name;

        const text = new Box().addClass('text').setText(file.name);
        if(file.files.length == 0){
            const image = new UI('img').setAttribute('src', path);
            fileElem.append(image);
        } else {
            text.setStyle('flex', 1);
        }

        fileElem.append(text);

        fileElem.file = file;
        fileElem.onClick(e => {
            if(file.files.length == 0){
                elem.onImageSelect(file, path);
                return;
            }
            elem.previousPaths.push(elem.currentPath);
            elem.currentPath = elem.currentPath.files.find(file => file == fileElem.file);
            displayPaths(elem);
        });
        elem.imagesContainer.append(fileElem);
    }

}

// im a coding genius
// elem is the actual element that is being dragged, trigger is the element that can trigger the dragging
function makeDraggable(elem, trigger=null){
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;
    
    if(!trigger)
        trigger = elem;
    trigger.addEventListener('mousedown', e => {
        isDragging = true;
        const rect = elem.html.getBoundingClientRect();
        offsetX = e.clientX - rect.x;
        offsetY = e.clientY - rect.y;
    });

    document.addEventListener('mouseup', e => {
        isDragging = false;
    });

    document.addEventListener('mousemove', e => {
        const rect = elem.html.getBoundingClientRect();
        const width = rect.width;
        const height = rect.height;

        if(isDragging){
            let x = e.clientX - offsetX;
            let y = e.clientY - offsetY;
            
            if(x < 0) x = 0;
            if(y < 0) y = 0;
            const marginOffset = 16;
            if(y + height + marginOffset > window.innerHeight)
                y = window.innerHeight - height - marginOffset;
            if(x + width + marginOffset > window.innerWidth)
                x = window.innerWidth - width - marginOffset;
            elem.setStyle({
                top: y+'px',
                left: x+'px'
            })
        }
    });
}