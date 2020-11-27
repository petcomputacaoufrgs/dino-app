class PathConstants {
  LOGIN: string = `/`

  APP: string = `/app`

  HOME: string = `${this.APP}/home`

  GLOSSARY: string = `${this.APP}/glossary`

  CONTACTS: string = `${this.APP}/contacts`

  GAMES: string = `${this.APP}/games`

  SETTINGS: string = `${this.APP}/settings`

  FAQ: string = this.APP + '/faq'

  NOTES: string = `${this.APP}/notes`

  CALENDAR = `${this.APP}/calendar`

  ABOUT_US = `${this.APP}/about-us`
}

export default new PathConstants()
