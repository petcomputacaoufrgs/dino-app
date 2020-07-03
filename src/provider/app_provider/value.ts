import LanguageSubProviderValue from './language_provider/value'
import AlertSubProviderValue from './alert_provider/value'

export default interface AppProviderValue {
  language: LanguageSubProviderValue
  alert: AlertSubProviderValue
}
