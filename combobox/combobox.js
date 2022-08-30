import { LightningElement, api } from 'lwc'

export default class ComboboxOption extends LightningElement {
  @api records
  @api firstField

  handleSelected (event) {
    const selected = new CustomEvent('selected', {
      detail: event.detail
    })
    this.dispatchEvent(selected)
  }
}