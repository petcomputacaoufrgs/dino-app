class ContactsConstants {
  PUBLIC_SERVICE: number = 1
  RESIDENTIAL: number = 2
  MOBILE: number = 8

  ACTION_ADD: number = 1
  ACTION_EDIT: number = 2

  DEFAULT_PHONE = '{ "type": 8, "number": "" }'
  DEFAULT_INVALID_PHONE = '{ "number": "invalid", "text": "" }'
}

export default new ContactsConstants()
