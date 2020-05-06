import LanguageSubProviderValue from './language_sub_provider/value'
import AlertSubProviderValue from './alert_sub_provider/value'
import UpdaterSubProviderValue from './updater_sub_provider/value'
import DatabaseSubProviderValue from './database_sub_provider/value'

export default interface AppProviderValue {
    database: DatabaseSubProviderValue,
    language: LanguageSubProviderValue,
    alert: AlertSubProviderValue,
    updater: UpdaterSubProviderValue
}