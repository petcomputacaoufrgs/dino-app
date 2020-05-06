import LanguageSubProviderValue from './language_sub_provider/value'
import AlertSubProviderValue from './alert_sub_provider/value'

export default interface AppProviderValue {
    language: LanguageSubProviderValue,
    alert: AlertSubProviderValue
}