import ContactsConsts from '../../constants/ContactsConstants'
import { useLanguage } from '../../provider/app_provider'
import PhoneModel from '../../types/contact/PhoneModel'
import ContactModel from '../../types/contact/ContactModel'
import LS from './local_storage'
import ArrayUtils from '../../utils/ArrayUtils'
import LS_Constants from '../../constants/LocalStorageKeysConstants'

class ContactsService {

  getItems = (): ContactModel[]       => LS.getItems()
  setItems = (items: ContactModel[])  => LS.setItems(items)
  getVersion = (): number | undefined => LS.getVersion()
  setVersion = (version : number)     => LS.setVersion(version)

  shouldSync = (): boolean => {
    return this.getIdsToUpdate().length > 0 || this.getIdsToDelete().length > 0
  }

  makeFrontId = (): number => {
    const lastId = this.getLastFrontId() + 1
    LS.setLastId(lastId)
    return lastId
  }

  getLastFrontId =(): number => { 
    const id = LS.getLastId() 
    return id ? JSON.parse(id) : this.getLastItemId() 
  }

  getLastItemId = (): number => {
    let items: Array<ContactModel> = this.getItems()
    if (items.length) {
      items.sort((a, b) => a.frontId - b.frontId)
      return items[items.length - 1].frontId
    }
    return 0
  }

  cleanUpdateQueue = () => {
    LS.cleanOpQueue(LS_Constants.CONTACTS_UPDATE)
  }

  cleanDeleteQueue = () => {
    LS.cleanOpQueue(LS_Constants.CONTACTS_DEL)
  }
  
  removeUserData = () => {
    LS.removeAllItems()
  }
  
  addContact = (item: ContactModel) => {
    const items = this.getItems()
    items.push(item)
    this.setItems(items)
    LS.pushUpdateOp(item.frontId)
  }
  
  deleteContact = (deletedID: number): ContactModel[] => {
    const items = this.getItems()
    const index = items.findIndex(item => item.frontId === deletedID)

    const deletedDatabaseId = items.splice(index, 1)[0].id
    if(deletedDatabaseId !== undefined)
      LS.pushDeleteOp(deletedDatabaseId)

    this.setItems(items)

    const idsToUpdate = this.getIdsToUpdate()
    const idToUpdateIndex = idsToUpdate.findIndex(id => id === deletedID)

    if(idToUpdateIndex > -1) {
      idsToUpdate.splice(idToUpdateIndex, 1)
      this.setIdsToUpdate(idsToUpdate)
    }

    return items
  }
  
  editContact = (edited: ContactModel) => {
    const items = this.getItems()
    
    const index = items.findIndex(item => item.frontId === edited.frontId)
    
    if (index > -1) {
      if (this.changed(items[index], edited)) {
      items.splice(index, 1, edited)
      this.setItems(items)

      LS.pushUpdateOp(items[index].frontId)
      }
    }
  }
  
  findItemByPhones = (newPhones: Array<PhoneModel>): ContactModel | undefined => {
    const items = this.getItems()
    return items.find((item) => {
      return item.phones.some(phone =>
      newPhones.some(newPhone => 
        newPhone.number === phone.number)
      )
    })
  }
  
  changed = (item: ContactModel, edited: ContactModel): boolean => {
    let changed = false
    
    if (item.phones.length === edited.phones.length) {
      changed = item.phones.some(
        (phone, index) =>
        phone.number !== edited.phones[index].number ||
        phone.type !== edited.phones[index].type
        )
      } else changed = true
      
      if (item.name !== edited.name) changed = true
      
      if (item.description !== edited.description) changed = true

      if (item.color !== edited.color) changed = true
      
      return changed
    }
    
  getPhoneTypes = (phones: Array<PhoneModel>): string => {
    if (phones.length === 1) return this.getPhoneType(phones[0].type)
    
    const types = ArrayUtils.removeRepeatedValues(
      phones.map((phone) => phone.type)
      )
      let result = this.getPhoneType(types[0])
      types.forEach((type, index) => {
        if (index > 0) result += ', ' + this.getPhoneType(type)
      })
      
      return result
    }
    
  getPhoneType = (type: number): string => {
    const language = useLanguage().current
    
    switch (type) {
      case ContactsConsts.PUBLIC_SERVICE:
        return language.CONTACTS_PUBLIC_SERVICE_PHONE
        case ContactsConsts.RESIDENTIAL:
      return language.CONTACTS_RESIDENTIAL_PHONE
      default:
        return language.CONTACTS_MOBILE_PHONE
      }
    }
    
  getIdsToUpdate = (): number[] => {
    return LS.getOpIDs(LS_Constants.CONTACTS_UPDATE)
  }

  setIdsToUpdate = (ids: Array<number>) => {
    LS.setOpIDs(LS_Constants.CONTACTS_UPDATE, ids)
  }
    
  getContactsToUpdate = (contacts: ContactModel[], idsToUpdate: number[]): {toAdd: ContactModel[]; toEdit: ContactModel[];} => {
    return contacts
    .filter(contact => idsToUpdate.includes(contact.frontId))
    .reduce((acum, contact) => {
      const toAddOrEdit = contact.id === undefined ? 'toAdd' : 'toEdit'
      acum[toAddOrEdit].push(contact)
      return acum
    }, { toAdd: Array<ContactModel>(), toEdit: Array<ContactModel>()})
  }
        
  setContactsToUpdate = (contacts: ContactModel[]) => {
    LS.setOpIDs(LS_Constants.CONTACTS_UPDATE, contacts.map(c => c.frontId))
  }

  getIdsToDelete = ():{ id: number }[] => {
    return LS.getOpIDs(LS_Constants.CONTACTS_DEL)
      .map(id => { return { id } }) 
  }
  
  updateContactIds = (updatedModels: ContactModel[], contacts: ContactModel[]): ContactModel[] => {
    
      const updatedContacts = contacts.map(c => {
        if(c.id === undefined) {
          const updatedContactIndex = updatedModels.findIndex(updatedModel => updatedModel.frontId === c.frontId)
          c.id = updatedModels.splice(updatedContactIndex, 1)[0].id
        }
        return c
      })
      
      console.log("updating contacts")
      console.log(updatedContacts)
      
      LS.setItems(updatedContacts)
      
      return updatedModels
  }
}
export default new ContactsService()
