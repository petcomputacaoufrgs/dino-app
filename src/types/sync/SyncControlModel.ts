import LanguageSubProviderValue from '../../provider/app_provider/language_provider/value'

export default interface SyncControlModel {
  language: LanguageSubProviderValue
  onStart?: () => void
  onFinish?: () => void
  onFail?: () => void
  onInternetFail?: () => void
}
