import { LightningElement, api, track } from 'lwc'
import { ShowToastEvent } from 'lightning/platformShowToastEvent'
import getRecent from '@salesforce/apex/fetchLookup.getRecent'
import getRecords from '@salesforce/apex/fetchLookup.getRecords'
import getObjects from '@salesforce/apex/fetchObjects.getObjects'
 
export default class Lookup extends LightningElement {
  @api restrictedIds;
  @track inputValue = '';
  @track records = []
  @track focused = false
  @track selected = ''
  @track record
  @track error
  @track activeId = ''
 
  @track sobjectName = 'Contact'
  @api name
  @api firstField = 'Name'
  @api readOnly = false
  @api required = false
 
  connectedCallback () {
      this.requestRecent()
      this.requestLookupOjects()
  }

  requestLookupOjects(){
    getObjects()
    .then(data => {
      this.allObjects=JSON.parse(JSON.stringify(data));
      console.log('this.allObjects',this.allObjects);
      console.log('XXXXXXXXXXXXXXXX',this.allObjects[0].SobjectType);

      var listOfObjects = JSON.parse(JSON.stringify(this.allObjects));
          var uiCombobox = [];
          console.log("recordtype", listOfObjects);
          
          for (let eachObject of listOfObjects)//this is to match structure of lightning combo box
          {
              uiCombobox.push({ label: eachObject.SobjectType, value: eachObject.SobjectType})
          }
          console.log('uiCombobox', JSON.parse(JSON.stringify(uiCombobox)));
          this.relatedToItems=uiCombobox;
    })
    .catch(error => {
      console.error('Error: ', error)
      this.error = error
    })
  }
  @track relatedToItems

  captureRelated(event){
    console.log('Selected option is ',event.detail.value)
    this.sobjectName=event.detail.value
    this.requestRecent()
  }
 
  get showListbox () { return this.focused && this.records.length > 0 && !this.record }
  get showClear () { return !this.readOnly && (this.record || (!this.record && this.inputValue.length > 0)) }
  get hasError () { return this.error ? this.error.message : '' }
 
  get containerClasses () {
    const classes = [ 'slds-combobox_container' ]
 
    if (this.record) {
      classes.push('slds-has-selection')
    }
 
    return classes.join(' ')
  }
 
  get inputClasses () {
    const classes = [
      'slds-input',
      'slds-combobox__input' ]
 
    if (this.record) {
      classes.push('slds-combobox__input-value')
    }
 
    return classes.join(' ')
  }
 
  get comboboxClasses () {
    const classes = [
      'slds-combobox',
      'slds-dropdown-trigger',
      'slds-dropdown-trigger_click' ]
 
    if (this.showListbox) {
      classes.push('slds-is-open')
    }
    if (this.hasError) {
      classes.push('slds-has-error')
    }
 
    return classes.join(' ')
  }
 
  onKeyup (event) {
    this.inputValue = event.target.value
    this.error = null
      if (this.inputValue.length > 2) {
        this.search()
      } else if (this.inputValue.length === 0) {
        this.records = []
        this.requestRecent()
      } else {
        this.error = {
          message: 'Minimum 2 characters'
        }
      }
  }
 
  handleSelected (event) {
    this.selected = event.detail
    this.record = this.records.find(record => record.Id === this.selected)
    console.log('this.record',this.record)
    this.inputValue = this.record.Id
    this.fireSelected()
  }
 
  search () {
    const searcher = this.getSearcher()
    this.error = null
 
    getRecords({ searcher, restrictedIds : this.restrictedIds })
      .then(data => {
        const newData = JSON.parse(data)
        this.records = newData.flat()
 
        if (this.records.length === 0) {
          this.fireToast({
            title: 'Info',
            variant: 'info',
            message: 'No records found, please refine your search.'
          })
        }
      })
      .catch(error => {
        console.error('Error searching records: ', error)
        this.error = error
      })
  }
 
  requestRecent () {      // all the recent items in the drop down appear
    const searcher = this.getSearcher() // searcher is a key value pair object the is being sent as a parameter to apex
    this.error = null
 
    getRecent({ searcher, restrictedIds : this.restrictedIds })
      .then(data => {
        this.records = JSON.parse(data)
      })
      .catch(error => {
        console.error('Error requesting recents', error)
        this.error = error
      })
  }
 
  clearSelection () { // previous selected values are reset
    this.selected = ''
    this.record = null
    this.inputValue = ''
    this.error = null
    this.requestRecent()
    this.fireSelected()
  }
 
  fireSelected () {
    const selected = new CustomEvent('selected', {
      detail: this.inputValue
    })
    this.dispatchEvent(selected)
  }
 
  setFocus (event) {
    this.focused = event.type === 'focus'
    if (event.type === 'blur') {
      this.focused=false;
    }
  }
 
  getSearcher () { //
    return {
      searchTerm: this.inputValue,
      objectName: this.sobjectName,
      fields: [this.firstField]
    }
  }
 
  fireToast (notification) { // toast notification
    const toast = new ShowToastEvent(notification)
    this.dispatchEvent(toast)
  }
 
}
