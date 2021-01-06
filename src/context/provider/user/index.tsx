import React, { createContext, useContext } from 'react'
import UserService, {
  UserServiceImpl,
} from '../../../services/user/UserService'
import UserDataModel from '../../../types/user/api/UserModel'
import UserEntity from '../../../types/user/database/UserEntity'
import SynchronizableProvider from '../synchronizable'
import SynchronizableContextType from '../synchronizable/context'

interface UserContextType
  extends SynchronizableContextType<
    number,
    UserDataModel,
    UserEntity,
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
    UserDataModel,
    UserEntity,
    UserServiceImpl
  >({
    children: children,
    context: UserContext,
    service: UserService,
  })

export const useUser = () => useContext(UserContext)

export default UserProvider
