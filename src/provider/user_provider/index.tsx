import React, { useState, useEffect, createContext, useContext } from 'react'
import UserProviderValue from './value'
import UserService from '../../services/user/UserService'
import UserContextUpdater from '../../services/user/UserContextUpdater'

const UserProviderContext = createContext({
  email: '',
  name: '',
  picture: '',
} as UserProviderValue)

const UserProvider: React.FC = (props) => {
  const [value, setValue] = useState({
    email: UserService.getEmail(),
    name: UserService.getName(),
    picture: UserService.getPicture(),
  } as UserProviderValue)

  useEffect(() => {
    const handleLocalDataChanged = () => {
      setValue({
        email: UserService.getEmail(),
        name: UserService.getName(),
        picture: UserService.getPicture(),
      } as UserProviderValue)
    }

    UserContextUpdater.setCallback(handleLocalDataChanged)
  }, [value])

  return (
    <UserProviderContext.Provider value={value}>
      {props.children}
    </UserProviderContext.Provider>
  )
}

export const useUser = () => useContext(UserProviderContext)

export default UserProvider
