import { LightningElement,api,track} from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import DATEFIELD from '@salesforce/schema/Task.ActivityDate';
import saveTask from '@salesforce/apex/CreateTask.saveTask';
import getTaskRecordTypes from '@salesforce/apex/FetchRecordTypes.getTaskRecordTypes'

export default class TaskCreation extends LightningElement {

    taskInputs={};
    @api customFormModal;
    DueDate= DATEFIELD;

    // get customFormModal(){
    //     return true;
    // }
    

    hideRecordTypeModal(){
        this.showRecordType=false;
    }

    hideFormModal(){
        this.showForm=false;
    }

    handleChange(event) {
        console.log(this.customFormModal)
        let fieldName=event.target.title;
        let fieldValue=event.target.value;
        console.log(event.target.title)
        console.log(event.target.value);  // field Values are captured

        this.taskInputs[fieldName]=fieldValue;

        //     //this.fieldChangesArray.Id=this.accountRecordId;
        //     let fieldName = event.target.fieldName; // field Names are captured
            
        //     this.fieldChangesArray[fieldName] = fieldValue.trim(); //field names and values are pushed into fieldChangesArray
        //     //console.log('this.fieldChangesArray', this.fieldChangesArray)
        //     this.fieldChangesStringArray=JSON.stringify(this.fieldChangesArray);
    }

    handleSuccess(){
        saveTask({taskInputs:JSON.stringify(this.taskInputs)})
        .then(task => {
            console.log('this is saved task',task);
            this.dispatchEvent(
                new ShowToastEvent({
                    title:"Success",
                    message:"Task Created",
                    variant:"success"
                })
            );
            this.taskInputs={};
        console.log(this.taskInputs,"form inputs")
        })
        .catch(error => {
            console.log('error in Global search',error); // if any errors,they are logged 
        });
    }

    //XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX

    @track statusOptions;
    @track value;
    @api objectApiName;
    @track showForm=false;
    showRecordType;
    recordTypeId;
    @track objectInfo;


    connectedCallback() {
        getTaskRecordTypes()
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
    
    get recordTypeId1() {
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

    handleChange(event) {
        
        console.log("Selected label --> ",event.detail.label);
        console.log("Layout value --> ", event.detail.value)
        console.log("Event info -->",JSON.stringify(event.detail))
        this.recordTypeId=event.detail.value;
    }

    handleNext(){
        this.showRecordType=false;
        this.showForm=true;
    }
    
}