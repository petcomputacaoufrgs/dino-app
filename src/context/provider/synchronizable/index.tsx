import React, { useState, useEffect } from 'react'
import SynchronizableProviderProps from './props'
import { IndexableType } from 'dexie'
import SynchronizableEntity from '../../../types/synchronizable/database/SynchronizableEntity'
import SynchronizableRepository from '../../../storage/database/synchronizable/SynchronizableRepository'
import AutoSynchronizableService from '../../../services/sync/AutoSynchronizableService'
import SynchronizableDataLocalIdModel from '../../../types/synchronizable/api/SynchronizableDataLocalIdModel'

interface SynchronizableStateType<ENTITY> {
  loading: boolean
  data: ENTITY[]
  first: ENTITY | undefined
}

function SynchronizableProvider<
  ID extends IndexableType,
  DATA_MODEL extends SynchronizableDataLocalIdModel<ID>,
  ENTITY extends SynchronizableEntity<ID>,
  REPOSITORY extends SynchronizableRepository<ID, ENTITY>,
  SERVICE extends AutoSynchronizableService<
    ID,
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
  DATA_MODEL,
  ENTITY,
  REPOSITORY,
  SERVICE
>): JSX.Element {
  const [state, setState] = useState<SynchronizableStateType<ENTITY>>({
    data: [],
    first: undefined,
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
        first: data[0],
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
        first: state.first,
        service: service,
      }}
    >
      {children}
    </context.Provider>
  )
}

export default SynchronizableProvider
