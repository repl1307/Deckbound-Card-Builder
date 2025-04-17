import { UI, Box } from 'zephyr-ui';
import '../css/tabs.css';

export default class Tabs extends Box {
    constructor(){
        super();
        this.addClass('tab-container');
        this.tabHeader = new Box().addClass('tab-header');
        this.tabBody = new Box().addClass('tab-body');
        this.append([this.tabHeader, this.tabBody]);
        this.tabNames = [];
        this.tabs = [];
        this.currentTab = null;
    }
    //tab - UI class
    addTab(tabName, tab){
        const newTabName = new Box()
            .setText(tabName)
            .addClass('tab-label')
            .onClick(e => {
                this.setTab(tabName);
            });
        this.tabNames.push(newTabName);
        this.tabHeader.append(newTabName);
        this.tabs.push(tab);
        this.tabBody.append(tab);
        tab.setStyle('display', 'none');
    }
    // tab - UI 
    setTab(tabName){
        const index = this.tabNames.findIndex(label => label.getText() == tabName);
        this.tabNames.forEach(name => name.removeClass('selected'));
        this.tabNames[index].addClass('selected');
        if(this.currentTab)
            this.currentTab.setStyle('display', 'none');
        this.currentTab = this.tabs[index];
        this.currentTab.setStyle('display', 'flex');
    }
}