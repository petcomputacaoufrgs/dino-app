export interface GooglePeopleNameModel {
    givenName: string
}

export interface GooglePeoplePhoneNumberModel {
    value: string
}

export interface GooglePeopleBiographiesModel {
    value: string
    contentType: string
}
 
export default interface GooglePeopleModel {
    names: GooglePeopleNameModel[],
    phoneNumbers: GooglePeoplePhoneNumberModel[],
    biographies?: GooglePeopleBiographiesModel[],
    resourceName?: string
}