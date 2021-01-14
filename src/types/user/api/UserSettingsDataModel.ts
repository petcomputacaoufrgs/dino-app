import SynchronizableDataLocalIdModel from '../../sync/api/SynchronizableDataLocalIdModel'

export default interface UserSettingsDataModel
  extends SynchronizableDataLocalIdModel<number> {
  language?: string
  colorTheme: number
  fontSize: number
  includeEssentialContact: boolean
  declineGoogleContacts: boolean
  treatmentId?: number
  firstSettingsDone: boolean
  step: number
}
