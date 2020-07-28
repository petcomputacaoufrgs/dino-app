import ContactsConsts from '../../constants/ContactsConstants'
import { useLanguage } from '../../provider/app_provider'
import PhoneModel from '../../types/contact/PhoneModel'
import ContactModel from '../../types/contact/ContactModel'
import LS from './local_storage'
import ArrayUtils from '../../utils/ArrayUtils'
import LS_Constants from '../../constants/LocalStorageKeysConstants'

class ContactsService {

  getItems = (): ContactModel[] => LS.getItems()
  setItems = (items: ContactModel[]) => LS.setItems(items)
  makeId = (): number => LS.updateLastId()
  getVersion = (): number => LS.getVersion()
  setVersion = (version : number) => LS.setVersion(version)
  shouldSync = (): boolean => LS.getShouldSync()
  setShouldSync = (bool: boolean) => LS.setShouldSync(bool)

  cleanUpdateQueue = () => {
    LS.cleanOpQueue(LS_Constants.CONTACTS_UPDATE)
  }

  cleanDeleteQueue = () => {
    LS.cleanOpQueue(LS_Constants.CONTACTS_DEL)
  }

  getIdsToUpdate = (): number[] => {
    return LS.getOpIDs(LS_Constants.CONTACTS_UPDATE)
  }

  addContact = (item: ContactModel) => {
    const items = this.getItems()
    items.push(item)
    this.setItems(items)
    LS.pushUpdateOp(item.frontId)
  }

  deleteContact = (deletedID: number): ContactModel[] => {
    const items = this.getItems()
    const index = items.findIndex((item) => item.frontId === deletedID)
    LS.pushDeleteOp(items.splice(index, 1)[0].frontId)
    this.setItems(items)
    return items
  }

  editContact = (edited: ContactModel) => {
    const items = this.getItems()

    const index = items.findIndex((item: ContactModel) => {
      return item.frontId === edited.frontId
    })

    if (index > -1)
      if (this.checkChanges(items[index], edited)) {
        items.splice(index, 1, edited)
        this.setItems(items)
        LS.pushUpdateOp(items[index].frontId)
      }
  }

  findPhone = (newPhones: Array<PhoneModel>): ContactModel | undefined => {
    const items = this.getItems()
    return items.find((item) => {
      return item.phones.some((phone) =>
        newPhones.some((newPhone) => newPhone.number === phone.number)
      )
    })
  }

  checkChanges = (item: ContactModel, edited: ContactModel): boolean => {
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

  getContactsToDelete = ():{ id: number }[] => {
    return LS.getOpIDs(LS_Constants.CONTACTS_DEL)
    .map(id => {
      return { id: id }
    }) 
  }

  updateContactIds = (updatedModels: ContactModel[] | undefined, contacts: ContactModel[]): ContactModel[] => {

    if(updatedModels !== undefined) {

      const updatedContacts = contacts.map(c => {
        if(c.id === undefined) {
          const updatedContactIndex = updatedModels.findIndex(contactResponse => 
            contactResponse.frontId === c.frontId)
          c.id = updatedModels[updatedContactIndex].id
          updatedModels.splice(updatedContactIndex, 1)
        }
        return c
      })
      
      console.log(updatedContacts)

      LS.setItems(updatedContacts)

      return updatedModels
    }

    return []
  }
}
export default new ContactsService()
