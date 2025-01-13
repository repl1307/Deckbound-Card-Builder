import { Box } from 'zephyr-ui';
import Code from './Code';
import '../css/popup.css';

export default class Popup extends Box {
    _isHidden = true;
    _isTransitioning = false;

    constructor(){
        super();
        this.addClass('pop-up');
        this.backdrop = new Box().addClass('backdrop').center();
        this.backdrop.append(this);
        this.code = new Code();
        this.copyButton = new Box('button').addClass('copy-button').setText('Copy');
        this.copyButton.onClick(e => {
            navigator.clipboard.writeText(this.code.getText());
            alert('Copied to clipboard!');
        });
        this.append([ this.copyButton, this.code ]);
        this.backdrop.setStyle('display', 'none');
        this.backdrop.onClick(e => {
            if(e.target == this.backdrop.html)
                this.hide();
        });
    }

    show(){
        if(this._isTransitioning) return;
        this._isTransitioning = true;
        this.backdrop.setStyle('display', 'flex');
        setTimeout(() => {
            this.setStyle({
                top: 'calc(50% - 37.5vmin)',
            });
            this._isTransitioning = false;
        }, 50);
    }

    hide(){
        if(this._isTransitioning) return;
        this._isTransitioning = true;
        this.setStyle({
            top: '-100vh',
        });
        setTimeout(() => {
            this._isTransitioning = false;
            this.backdrop.setStyle('display', 'none')
        }, 500);
        this._isHidden = true;
    }

    toggle(){
        if(this._isTransitioning) return;
        if(this._isHidden){
            this.backdrop.setStyle('display', 'flex');
            setTimeout(() => {
                this.setStyle({
                    top: 'calc(50% - 37.5vmin)',
                });
            }, 1);

        } else {
            setTimeout(() => this.backdrop.setStyle('display', 'none'), 500);
            this.setStyle({
                top: '-100vh',
            });
        }
        this._isHidden = !this._isHidden;

    }
    setCode(code, language){
        this.code.setText(code).addClass('language-'+language);
        this.code.setAttribute('data-highlighted', '');
        Code.highlighter.highlightElement(this.code.html);
    }
}