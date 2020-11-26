class GoogleAPIURLConstants {
  private BASE_URL = 'https://people.googleapis.com/v1/'

  private BASE_ME_URL = `${this.BASE_URL}people/me`

  GET_USER_PHOTOS = `${this.BASE_ME_URL}?personFields=photos`
}

export default new GoogleAPIURLConstants()
