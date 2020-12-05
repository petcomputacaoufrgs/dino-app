import React, { useState, useEffect } from 'react'
import SynchronizableProviderProps from './props'
import { IndexableType, IndexableTypePart } from 'dexie'
import SynchronizableDataModel from '../../../types/synchronizable/api/SynchronizableDataModel'
import SynchronizableEntity from '../../../types/synchronizable/database/SynchronizableEntity'
import SynchronizableRepository from '../../../storage/database/synchronizable/SynchronizableRepository'

function SynchronizableProvider<
  ID extends IndexableType,
  LOCAL_ID extends IndexableTypePart,
  DATA_MODEL extends SynchronizableDataModel<ID>,
  ENTITY extends SynchronizableEntity<ID, LOCAL_ID>,
  REPOSITORY extends SynchronizableRepository<ID, LOCAL_ID, ENTITY>
>({
  context,
  service,
  children,
}: SynchronizableProviderProps<
  ID,
  LOCAL_ID,
  DATA_MODEL,
  ENTITY,
  REPOSITORY
>): JSX.Element {
  const [data, setData] = useState<ENTITY[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    const getData = async () => {
      const dbData = await service.getAll()

      updateData(dbData)
    }

    let updateData = (data: ENTITY[]) => {
      setData(data)
      if (loading) {
        setLoading(false)
      }
    }

    const handleLocalDataChanged = (data: ENTITY[]) => {
      updateData(data)
    }

    service.setContextProviderCallback(handleLocalDataChanged)

    const cleanBeforeUpdate = () => {
      updateData = async () => {}
    }

    getData()

    return cleanBeforeUpdate
  }, [loading, service])

  return (
    <context.Provider
      value={{
        data: data,
        loading: loading,
        service: service,
      }}
    >
      {children}
    </context.Provider>
  )
}

export default SynchronizableProvider
