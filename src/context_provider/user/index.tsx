import React, { useState, useEffect, createContext, useContext } from 'react'
import UserContextType from '../../types/context_provider/UserContextType'
import UserService from '../../services/user/UserService'
import UserContextUpdater from '../../context_updater/UserContextUpdater'

const UserContext = createContext({
  email: '',
  name: '',
  picture: '',
} as UserContextType)

const UserContextProvider: React.FC = (props) => {
  const [value, setValue] = useState({
    email: UserService.getEmail(),
    name: UserService.getName(),
    picture: UserService.getPicture(),
  } as UserContextType)

  useEffect(() => {
    const handleLocalDataChanged = () => {
      const value: UserContextType = {
        email: UserService.getEmail(),
        name: UserService.getName(),
        picture: UserService.getPicture(),
      }
      
      saveData(value)
    }

    let saveData = (value: UserContextType) => {
      setValue(value)
    }

    UserContextUpdater.setCallback(handleLocalDataChanged)

    const cleanBeforeUpdate = () => {
      saveData = () => {}
    }

    return cleanBeforeUpdate
  }, [value])

  return (
    <UserContext.Provider value={value}>{props.children}</UserContext.Provider>
  )
}

export const useUser = () => useContext(UserContext)

export default UserContextProvider
