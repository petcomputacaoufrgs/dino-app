import SynchronizableDataLocalIdModel from "../../synchronizable/api/SynchronizableDataLocalIdModel"

export default interface UserSettingsDataModel extends SynchronizableDataLocalIdModel<number, number> {
  language: string,
  colorTheme: number,
  fontSize: number,
  includeEssentialContact: boolean,
  declineGoogleContacts: boolean,
  treatmentId?: number,
  firstSettingsDone: boolean,
  settingsStep: number
}