const CONTACT_FIELDS = "names,phoneNumbers,biographies"

class GooglePeopleAPIURLConstants {
  private BASE_URL = 'https://people.googleapis.com/v1/'

  private BASE_PEOPLE_URL = `${this.BASE_URL}people`

  private BASE_PEOPLE_ME_URL = `${this.BASE_PEOPLE_URL}/me`

  GET_USER_PHOTOS = `${this.BASE_PEOPLE_ME_URL}?personFields=photos`

  GET_CONTACT = (resourceName: string)  => (
    `${this.BASE_URL}${resourceName}?personFields=${CONTACT_FIELDS}`
  )

  CREATE_CONTACT = `${this.BASE_PEOPLE_URL}:createContact`

  UPDATE_CONTACT = (resourceName: string) => (
    `${this.BASE_URL}${resourceName}/:updateContact?updatePersonFields=${CONTACT_FIELDS}`
  )

  DELETE_CONTACT = (resourceName: string) => (
    `${this.BASE_URL}${resourceName}/:deleteContact`
  )
}

export default new GooglePeopleAPIURLConstants()
