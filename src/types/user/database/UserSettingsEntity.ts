import SynchronizableEntity from "../../synchronizable/database/SynchronizableEntity"

export default interface UserSettingsEntity extends SynchronizableEntity<number, number> {
    language: string,
    colorTheme: number,
    fontSize: number,
    includeEssentialContact: boolean,
    syncGoogleContacts: boolean,
    declineGoogleContacts: boolean,
    firstSettingsDone: boolean,
    treatmentLocalId?: number,
    settingsStep: number
}