import DatabaseManager from '../../../database/DatabaseManager'
import DatabaseSubProviderValue from './value'

const DatabaseSubProvider = (): DatabaseSubProviderValue  => {
    const connection = DatabaseManager.getDatabase()

    const getConnection = () => {
        return connection
    }

    const value = { getConnection: getConnection } as DatabaseSubProviderValue

    return value
}

export default DatabaseSubProvider