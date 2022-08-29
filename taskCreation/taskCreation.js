import { LightningElement,api,track} from 'lwc';
import saveTask from '@salesforce/apex/CreateTask.saveTask';
import getTaskRecordTypes from '@salesforce/apex/FetchRecordTypes.getTaskRecordTypes'

export default class TaskCreation extends LightningElement {

    taskInputs={};

    connectedCallback() {  // captures the RecordType Values
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

    @api objectApiName;
    @track showForm=false;
    showRecordType;
    recordTypeId;
    @track objectInfo;
    
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

    captureId(event){
        this.recordTypeId=event.detail.value;
    }

    handleNext(){
        this.showRecordType=false;
        this.showForm=true;
    }
    

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
    }

    handleSuccess(){
        saveTask({taskInputs:JSON.stringify(this.taskInputs)})
        .then(task => {
            console.log('this is saved task',task);
            console.log(this.taskInputs,"form inputs ff")
            this.taskInputs={};
            const event = new CustomEvent('tasksave');
            this.dispatchEvent(event);

        })
        .catch(error => {
            console.log('error in Global search',error); // if any errors,they are logged 
        });
    }
}
