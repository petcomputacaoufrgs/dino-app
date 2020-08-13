import ContactsConsts from '../../constants/ContactsConstants'
import { useLanguage } from '../../context_provider/app_settings'
import PhoneModel from '../../types/contact/PhoneModel'
import ContactModel from '../../types/contact/ContactModel'
import ContactResponseModel from '../../types/contact/ContactResponseModel'
import LS from '../../local_storage/ContactLocalStorage'
import ArrayUtils from '../../utils/ArrayUtils'
import HttpStatus from 'http-status-codes'
import DinoAPIURLConstants from '../../constants/dino_api/DinoAPIURLConstants'
import AgentStatus from '../../types/agent/AgentStatus'
import DinoAgentService from '../../agent/DinoAgentService'
import Server from './ContactServerService'
import ContactContextUpdater from '../../context_updater/ContactContextUpdater'
import StrU from '../../utils/StringUtils'


class ContactsService {

  /// #SERVER SERVICE CONNECTION

  updateLocal = async (version: number): Promise<void> => {
    const request = await DinoAgentService.get(DinoAPIURLConstants.CONTACT_GET)
  
    if (request.status === AgentStatus.OK) {
  
      try {
        const response = await request.get()!
  
        if (response.status === HttpStatus.OK) {
          const serverContacts: ContactModel[] = response.body
  
          this.setVersion(version)
  
          const newLocalItens = this.getItems().filter(c => c.id === undefined)
  
          this.setItems(newLocalItens.concat(
            serverContacts.map(c => { c.frontId = this.makeFrontId() 
              return c
          })))
  
          ContactContextUpdater.update()
  
          return
        }
      } catch {
        /**TO-DO Salvar log de erro */
      }
    }
  }

  updateContactIds = (responseModels: ContactResponseModel[], contacts: ContactModel[]) => {
      
    const updatedContacts = contacts
      .filter(c => c.id !== undefined)
      .concat(responseModels
        .map(response => {
        return { 
          id: response.id,
          frontId: this.makeFrontId(),
          name: response.name,
          phones: response.phones,
          description: response.description,
          color: response.color,
      } as ContactModel
    }))
      
    this.setItems(updatedContacts)
}

/// #ITEMS & VERSION

getItems = (): ContactModel[] => {
  const items = LS.getItems()
  return items ? JSON.parse(items) as ContactModel[] : [] 
}

setItems = (items: ContactModel[]) => {
  LS.setItems(JSON.stringify(StrU.sortByAttr(items, 'name')))
}

getVersion = (): number | undefined => {
  const version = LS.getVersion()
  return version ? JSON.parse(version) : undefined 
}

setVersion = (version : number) => {
  LS.setVersion(JSON.stringify(version))
}

/// #MAIN FUNCTIONS

addContact = async (item: ContactModel) => {
  
  const response = await Server.saveContact(item)

  if(response !== undefined) {
    item.id = response.id
  }

  const items = this.getItems()
  items.push(item)
  this.setItems(items)

  ContactContextUpdater.update()

}

deleteContact = (deletedFrontID: number) => {
  const items = this.getItems()
  const index = items.findIndex(item => item.frontId === deletedFrontID)
  console.log(index)

  if (index > -1) {
    const item = items.splice(index, 1)[0]

    if(item.id)
      Server.deleteContact(item.id)
    this.setItems(items)

    ContactContextUpdater.update()
  }
  
}

editContact = async (edited: ContactModel) => {
  const items = this.getItems()
  
  const index = items.findIndex(item => item.frontId === edited.frontId)
  
  if (index > -1) {
    if (this.changed(items[index], edited)) {
    items.splice(index, 1, edited)
    this.setItems(items)

    Server.editContact(edited)
    }

    ContactContextUpdater.update()
  }
}

/// #UPDATE QUEUE

getIdsToUpdate = (): number[] => {
  const items = LS.getIdsToUpdate()
  return items ? JSON.parse(items) as number[] : [] 
}

setIdsToUpdate = (ids: Array<number>) => { 
  LS.setIdsToUpdate(JSON.stringify(ids))
}

pushToUpdate = (frontId: number) => {
  const ids = this.getIdsToUpdate()
  this.setIdsToUpdate(this.pushId(frontId, ids))
}

getContactsToUpdate = (contacts: ContactModel[], idsToUpdate: number[]): {toAdd: ContactModel[]; toEdit: ContactModel[];} => {
  return contacts.filter(contact => idsToUpdate.includes(contact.frontId))
  .reduce((acc, contact) => {
    const toAddOrEdit = contact.id === undefined ? 'toAdd' : 'toEdit'
    acc[toAddOrEdit].push(contact)
    return acc
  }, { toAdd: Array<ContactModel>(), toEdit: Array<ContactModel>()})
}

/// #DELETE QUEUE

getIdsToDelete = (): number[] => {
  const ids = LS.getIdsToDelete()
  return ids ? JSON.parse(ids) : []
}

setIdsToDelete = (ids: Array<number>) => { 
  LS.setIdsToDelete(JSON.stringify(ids))
}

pushToDelete = (deletedID: number) => {
  
  const ids = this.getIdsToDelete()
  this.setIdsToDelete(this.pushId(deletedID, ids))
  
  const idsToUpdate = this.getIdsToUpdate()
  const idToUpdateIndex = idsToUpdate.findIndex(id => id === deletedID)
  
  if(idToUpdateIndex > -1) {
    idsToUpdate.splice(idToUpdateIndex, 1)
    this.setIdsToUpdate(idsToUpdate)
  }
}

getContactsToDelete = ():{ id: number }[] => {
  return this.getIdsToDelete().map(id => { return { id } }) 
}

/// #QUEUE AUX

pushId = (id: number, ids: Array<number>): Array<number> => {
  const newIds = ids.filter(queueId => queueId !== id)
  newIds.push(id)
  return newIds
}

cleanUpdateQueue = () => LS.cleanUpdateQueue()
cleanDeleteQueue = () => LS.cleanDeleteQueue()

/// #AUX

removeUserData = () => LS.removeAllItems()

shouldSync = (): boolean => {
  console.log(this.getIdsToUpdate().length > 0 || this.getIdsToDelete().length > 0)

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

findItemByPhones = (newPhones: Array<PhoneModel>): ContactModel | undefined => {
  const items = this.getItems()
  return items.find(item => {
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

}

export default new ContactsService()
