import React, { createContext, useContext } from 'react'
import SynchronizableProvider from '../synchronizable'
import SynchronizableContextType from '../synchronizable/context'
import UserSettingsDataModel from '../../../types/user/api/UserSettingsDataModel'
import UserSettingsEntity from '../../../types/user/database/UserSettingsEntity'
import { UserSettingsRepositoryImpl } from '../../../storage/database/user/UserSettingsRepository'
import UserSettingsService, { UserSettingsServiceImpl } from '../../../services/user/UserSettingsService'

export interface UserSettingsContextType
  extends SynchronizableContextType<
    number,
    number,
    UserSettingsDataModel,
    UserSettingsEntity,
    UserSettingsRepositoryImpl,
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
    number,
    UserSettingsDataModel,
    UserSettingsEntity,
    UserSettingsRepositoryImpl,
    UserSettingsServiceImpl
  >({
    children: children,
    context: UserSettingsContext,
    service: UserSettingsService,
  })

export const useUserSettings = () => useContext(UserSettingsContext)

export default UserSettingsProvider
