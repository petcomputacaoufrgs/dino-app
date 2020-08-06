class PathConstants {
  LOGIN: string = `/`

  APP: string = `/app`

  HOME: string = `${this.APP}/home`

  GLOSSARY: string = `${this.APP}/glossary`

  CONTACTS: string = `${this.APP}/contacts`

  GAMES: string = `${this.APP}/games`

  SETTINGS: string = `${this.APP}/settings`

  NOTES: string = `${this.APP}/notes`

  CALENDAR = `${this.APP}/calendar`
}

export default new PathConstants()
