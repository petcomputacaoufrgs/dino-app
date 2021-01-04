import React, { useState, useEffect, createContext, useContext } from 'react'
import SynchronizationService from '../../../services/sync/SyncService'
import SyncStateEnum from '../../../types/sync/SyncStateEnum'
import SyncContextUpdater from '../../updater/SyncContextUpdater'

interface SyncContextType {
  state: SyncStateEnum
}

const SyncContext = createContext({
  state: SyncStateEnum.SYNCED,
} as SyncContextType)

const SyncProvider: React.FC = (props) => {
  const [state, setState] = useState(SyncStateEnum.SYNCED)

  useEffect(() => {
    const state = SynchronizationService.getState()
    setState(state)
  }, [])

  useEffect(() => {
    const updateData = () => {
      const state = SynchronizationService.getState()
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

export default SyncProvider
