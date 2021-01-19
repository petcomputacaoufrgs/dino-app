class GooglePeopleAPIURLConstants {
  private BASE_URL = 'https://people.googleapis.com/v1/'

  private BASE_PEOPLE_URL = `${this.BASE_URL}people`

  private BASE_PEOPLE_ME_URL = `${this.BASE_PEOPLE_URL}/me`

  GET_USER_PHOTOS = `${this.BASE_PEOPLE_ME_URL}?personFields=photos`
}

export default new GooglePeopleAPIURLConstants()
