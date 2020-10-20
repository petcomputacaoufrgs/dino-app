import React, { useState, useEffect, createContext, useContext } from 'react'
import SyncContextType from '../../types/sync/SyncContextType'
import SyncState from '../../types/sync/SyncState'
import SyncContextUpdater from '../../context_updater/SyncContextUpdater'
import SyncService from '../../services/sync/SyncService'

const SyncContext = createContext({
  state: SyncState.Synced,
} as SyncContextType)

const SyncContextProvider: React.FC = (props) => {
  const [state, setState] = useState(SyncState.Synced)
  const [firstLoad, setFirstLoad] = useState(true)

  useEffect(() => {
    const updateData = () => {
      const state = SyncService.getState()
      console.log(state)
      setState(state)
    }

    if (firstLoad) {
      updateData()
      setFirstLoad(false)
    }

    let handleLocalDataChanged = () => {
      updateData()
    }

    SyncContextUpdater.setCallback(handleLocalDataChanged)

    const cleanBeforeUpdate = () => {
      handleLocalDataChanged = () => {}
    }

    return cleanBeforeUpdate
  }, [state, firstLoad])

  const value = {
    state: state,
  }

  return (
    <SyncContext.Provider value={value}>
        {props.children}
    </SyncContext.Provider>
  )
}

export const useSync = () => useContext(SyncContext)

export default SyncContextProvider
