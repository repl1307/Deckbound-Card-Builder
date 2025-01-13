import { UI } from 'zephyr-ui';
import hljs from '../highlightjs/highlight.min';
import '../highlightjs/default.min.css';
import '../highlightjs/atom-one-dark.css';

export default class Code extends UI {
  static highlighter = hljs;

  constructor(code='', language='css'){
    super(document.createElement('code'));

    this.setStyle({
      fontSize: '0.9em'
    });
    this.setText(code).addClass('language-'+language);
    Code.highlighter.highlightElement(this.html);
  }
}