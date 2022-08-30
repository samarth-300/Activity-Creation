import { LightningElement, track, api } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ButtonMenuCmp extends LightningElement {
    @track isExpanded;
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
        this.isExpanded = !this.isExpanded;
        let selectedOption = event.target.dataset.filter;
        console.log("selected ==> ",event.target.dataset.filter)
        if(selectedOption=='task'){
            this.showTaskModal=true;
        }else if(selectedOption=='event'){
            this.showEventModal=true;
        }        
    }
 
    handleClickExtend() {
        this.isExpanded = !this.isExpanded;
    }

    publishTaskToast(){
        this.dispatchEvent(
            new ShowToastEvent({
                title:"Success",
                message:"Task Created Successfully",
                variant:"success"
            })
        );
    }

    publishEventToast(){
        this.dispatchEvent(
            new ShowToastEvent({
                title:"Success",
                message:"Event Created Successfully",
                variant:"success"
            })
        );
    }
}
