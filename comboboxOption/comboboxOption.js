import { LightningElement, api } from 'lwc'

export default class ComboboxOption extends LightningElement {
  @api record
  @api firstField

  get firstRow () { return this.record[this.firstField] }

  get itemClasses () {
    const classes = [
      'slds-media', // is a container
      'slds-listbox__option', // can choose between the options
      'slds-listbox__option_entity', 
      'slds-listbox__option_has-meta' ] // option has meta file

    if (this.isActive) {
      classes.push('slds-has-focus') // handles the focus and removes focus for the option
    }

    return classes.join(' ')
  }

  clickRecord () {
    const selected = new CustomEvent('selected', {
      detail: this.record.Id
    })
    this.dispatchEvent(selected)
  }
}