import React, { createContext, useContext } from 'react'
import SynchronizableProvider from '../synchronizable'
import SynchronizableContextType from '../synchronizable/context'
import UserSettingsDataModel from '../../../types/user/api/UserSettingsDataModel'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import UserSettingsService, {
  UserSettingsServiceImpl,
} from '../../../services/user/UserSettingsService'

export interface UserSettingsContextType
  extends SynchronizableContextType<
    number,
    UserSettingsDataModel,
    UserSettingsEntity,
    UserSettingsServiceImpl
  > {}

const UserSettingsContext = createContext<UserSettingsContextType>({
  service: UserSettingsService,
  loading: true,
  data: [],
})

const UserSettingsProvider: React.FC = ({ children }) =>
  SynchronizableProvider<
    number,
    UserSettingsDataModel,
    UserSettingsEntity,
    UserSettingsServiceImpl
  >({
    children: children,
    context: UserSettingsContext,
    service: UserSettingsService,
  })

export const useUserSettings = () => useContext(UserSettingsContext)

export default UserSettingsProvider
