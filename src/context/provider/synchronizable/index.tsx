import React, { useState, useEffect } from 'react'
import SynchronizableProviderProps from './props'
import { IndexableType, IndexableTypePart } from 'dexie'
import SynchronizableEntity from '../../../types/synchronizable/database/SynchronizableEntity'
import SynchronizableRepository from '../../../storage/database/synchronizable/SynchronizableRepository'
import SynchronizableService from '../../../services/synchronizable/SynchronizableService'
import SynchronizableDataLocalIdModel from '../../../types/synchronizable/api/SynchronizableDataLocalIdModel'

interface SynchronizableStateType<ENTITY> {
  loading: boolean
  data: ENTITY[]
}

function SynchronizableProvider<
  ID extends IndexableType,
  LOCAL_ID extends IndexableTypePart,
  DATA_MODEL extends SynchronizableDataLocalIdModel<ID, LOCAL_ID>,
  ENTITY extends SynchronizableEntity<ID, LOCAL_ID>,
  REPOSITORY extends SynchronizableRepository<ID, LOCAL_ID, ENTITY>,
  SERVICE extends SynchronizableService<
    ID,
    LOCAL_ID,
    DATA_MODEL,
    ENTITY,
    REPOSITORY
  >
>({
  context,
  service,
  children,
}: SynchronizableProviderProps<
  ID,
  LOCAL_ID,
  DATA_MODEL,
  ENTITY,
  REPOSITORY,
  SERVICE
>): JSX.Element {
  const [state, setState] = useState<SynchronizableStateType<ENTITY>>({
    data: [],
    loading: true,
  })

  useEffect(() => {
    const getData = async () => {
      const dbData = await service.getAll()

      updateData(dbData)
    }

    let updateData = (data: ENTITY[]) => {
      setState({
        data: data,
        loading: false,
      })
    }

    const handleLocalDataChanged = (data: ENTITY[]) => {
      updateData(data)
    }

    service.setContextProviderCallback(handleLocalDataChanged)

    const cleanBeforeUpdate = () => {
      updateData = () => {}
    }

    if (state.loading) {
      getData()
    }

    return cleanBeforeUpdate
  }, [state.loading, service])

  return (
    <context.Provider
      value={{
        data: state.data,
        loading: state.loading,
        service: service,
      }}
    >
      {children}
    </context.Provider>
  )
}

export default SynchronizableProvider
