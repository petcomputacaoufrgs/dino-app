import ContactsConstants from '../../constants/ContactsConstants'
import { useLanguage } from '../../provider/app_provider'
import PhoneModel from './api_model/PhoneModel'

class ContactsService {
  getPhoneTypes = (phones: Array<PhoneModel>): string => {
    if (phones.length === 1) return this.getPhoneType(phones[0])

    let strings = new Array<string>()

    phones.forEach((phone) => {
      strings.push(this.getPhoneType(phone))
    })

    let result = strings[0]

    strings.forEach((str, index) => {
      if (index > 0) result += ', ' + str
    })

    return result
  }

  getPhoneType = (phone: PhoneModel): string => {
    const language = useLanguage().current

    switch (phone.type) {
      case ContactsConstants.PUBLIC_SERVICE:
        return language.CONTACTS_PUBLIC_SERVICE_PHONE
      case ContactsConstants.RESIDENTIAL:
        return language.CONTACTS_RESIDENTIAL_PHONE
      default:
        return language.CONTACTS_MOBILE_PHONE
    }
  }
}
export default new ContactsService()
