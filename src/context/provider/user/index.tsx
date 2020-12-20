import React, { createContext, useContext } from 'react'
import UserService, { UserServiceImpl } from '../../../services/user/UserService'
import { UserRepositoryImpl } from '../../../storage/database/user/UserRepository'
import UserDataModel from '../../../types/user/api/UserModel'
import UserEntity from '../../../types/user/database/UserEntity'
import SynchronizableProvider from '../synchronizable'
import SynchronizableContextType from '../synchronizable/context'

export interface UserContextType
  extends SynchronizableContextType<
    number,
    number,
    UserDataModel,
    UserEntity,
    UserRepositoryImpl,
    UserServiceImpl
  > {}

const UserContext = createContext<UserContextType>({
  service: UserService,
  loading: true,
  data: [],
})

const UserProvider: React.FC = ({ children }) =>
  SynchronizableProvider<
    number,
    number,
    UserDataModel,
    UserEntity,
    UserRepositoryImpl,
    UserServiceImpl
  >({
    children: children,
    context: UserContext,
    service: UserService,
  })

export const useUser = () => useContext(UserContext)

export default UserProvider
