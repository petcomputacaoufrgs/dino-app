import React, { useState, useEffect, createContext, useContext } from 'react'
import SyncContextType from '../../../types/sync/SyncContextType'
import SyncStateEnum from '../../../types/sync/SyncStateEnum'
import SyncContextUpdater from '../../updater/SyncContextUpdater'
import SyncService from '../../../services/sync/SyncService'

const SyncContext = createContext({
  state: SyncStateEnum.SYNCED,
} as SyncContextType)

const SyncContextProvider: React.FC = (props) => {
  const [state, setState] = useState(SyncStateEnum.SYNCED)

  useEffect(() => {
    const state = SyncService.getState()
    setState(state)
  }, [])

  useEffect(() => {
    const updateData = () => {
      const state = SyncService.getState()
      setState(state)
    }

    let handleLocalDataChanged = () => {
      updateData()
    }

    SyncContextUpdater.setCallback(handleLocalDataChanged)

    const cleanBeforeUpdate = () => {
      handleLocalDataChanged = () => {}
    }

    return cleanBeforeUpdate
  }, [state])

  const value = {
    state: state,
  }

  return (
    <SyncContext.Provider value={value}>{props.children}</SyncContext.Provider>
  )
}

export const useSync = () => useContext(SyncContext)

export default SyncContextProvider
