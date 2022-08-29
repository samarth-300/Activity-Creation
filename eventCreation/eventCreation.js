import { LightningElement,api,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import saveEvent from '@salesforce/apex/CreateEvent.saveEvent';
import getEventRecordTypes from '@salesforce/apex/FetchRecordTypes.getEventRecordTypes'

export default class EventCreation extends LightningElement {

    @api objectApiName;
    @track showForm=false;
    @api showRecordType;
    recordTypeId;
    @track objectInfo;


    connectedCallback() {  // loads the values to record types
        getEventRecordTypes()
            .then(result => {
                this.objectInfo = result;
                if(this.objectInfo.length!=0){
                    this.showRecordType=true;
                }
            })
            .catch(error => {
                console.log(error)
            });
    }
    
    get recordTypeOptions() {
        var recordtypeinfo = JSON.parse(JSON.stringify(this.objectInfo));
        var uiCombobox = [];
        console.log("recordtype" , recordtypeinfo);
        for(let eachRecordtype of  recordtypeinfo)//this is to match structure of lightning combo box
        {
            console.log('eachRecordtype',eachRecordtype)
            console.log(eachRecordtype.Name)
          
          uiCombobox.push({ label: eachRecordtype.Name, value: eachRecordtype.Id })
        }
        console.log('uiCombobox' ,JSON.parse( JSON.stringify(uiCombobox)));
      return uiCombobox;
    }

    handleRecordType(event) {   
        
        console.log("Id of RecordType Selected-->",JSON.stringify(event.detail))
        this.recordTypeId=event.detail.value;
    }

    handleNext(){  // on click of next button
        this.showRecordType=false;
        this.showForm=true;
    }

    eventInputs={};
    @api customFormModal;
    
    subjectValues=[
        { label: 'Call', value: 'Call' },
        { label: 'Email', value: 'Email' },
        { label: 'Meeting', value: 'Meeting' },
        { label: 'Send Letter/Quote', value: 'Send/Letter Quote' },
        { label: 'Other', value: 'Other' },
    ];

    hideRecordTypeModal(){
        this.showRecordType=false;
    }

    hideFormModal(){
        this.showForm=false;
    }

    handleChange(event) {
        let fieldName=event.target.title;
        let fieldValue=event.target.value;

        this.eventInputs[fieldName]=fieldValue; // input values are assigned
    }

    handleSuccess(){  // on click of save burtton
        saveEvent({eventInputs:JSON.stringify(this.eventInputs)})
        .then(event => {
            console.log('this is saved event',event);
            this.dispatchEvent(
                new ShowToastEvent({
                    title:"Success",
                    message:"event Created",
                    variant:"success"
                })
            );
            this.eventInputs={};
        
        const evt=new CustomEvent('eventsave');   // custom event dispatched to the parent comonent to let know that the form is saved
        this.dispatchEvent(evt);
        })
        .catch(error => {
            console.log('error in Global search',error); // if any errors,they are logged 
        });
    }
}
