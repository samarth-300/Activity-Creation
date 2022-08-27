import { LightningElement, track, api } from 'lwc';

export default class ButtonMenuCmp extends LightningElement {
    //@track currentFilter = ALL_PRIORITY;
    @track isExpanded = false;
    //@track isLoaded = false;
    @api showTaskModal;
    @api showEventModal;
    
    items = [
        { label: 'Create Task' , value: 'task' },
        { label: 'Create Event', value: 'event'}
];
    
    get dropdownTriggerClass() {
        if (this.isExpanded) {
            return 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click custom_list_view slds-is-open'
        } else {
            return 'slds-combobox slds-dropdown-trigger slds-dropdown-trigger_click custom_list_view'
        }
    }
 
    handleFilterChangeButton(event) {
        //this.isLoaded = false;
        // let filter = event.target.dataset.filter;
        this.isExpanded = !this.isExpanded;
        // if (filter !== this.currentFilter) {
        //     this.currentFilter = event.target.dataset.filter;
        //     setTimeout(() => {
        //         this.handleFilterData(this.currentFilter), 0
        //     });
        // } 
        let selectedOption = event.target.dataset.filter;
        console.log("selected ==> ",event.target.dataset.filter)
        if(selectedOption=='task'){
            this.showTaskModal=true;
        }else if(selectedOption=='event'){
            this.showEventModal=true;
        }        
    }
 
    // handleFilterData(filter) {
    //     if (filter === ALL_PRIORITY) {
    //         this.itemsForCurrentView = this.allItems
    //     } else {
    //         this.itemsForCurrentView = this.allItems.filter(item => {
    //             return item.Priority === filter;
    //         })
    //     }
    //     this.isLoaded = true;
    // }
 
    handleClickExtend() {
        this.isExpanded = !this.isExpanded;
    }
}