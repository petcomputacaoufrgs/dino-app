import React, { useState, useEffect } from 'react'
import { ReactComponent as CloudSVG } from '../../../../../assets/icons/sync/cloud.svg'
import { ReactComponent as SyncSVG } from '../../../../../assets/icons/sync/sync.svg'
import { ReactComponent as OnlineSVG } from '../../../../../assets/icons/sync/check.svg'
import { ReactComponent as OfflineSVG } from '../../../../../assets/icons/sync/close.svg'
import SyncStateEnum from '../../../../../types/sync/SyncStateEnum'
import SyncService from '../../../../../services/sync/SyncService'
import './styles.css'

const SyncInfo: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [syncState, setSyncState] = useState(SyncStateEnum.SYNCHRONIZING)

  useEffect(() => {
    const loadData = () => {
      const state = SyncService.getState()
      setSyncState(state)
      setIsLoading(false)
    }

    SyncService.addUpdateEventListenner(loadData)

    if (isLoading) {
      loadData()
    }

    return () => {
      SyncService.removeUpdateEventListenner(loadData)
    }
  }, [isLoading])

  const getSyncSymbol = (): JSX.Element => {
    if (syncState === SyncStateEnum.NOT_SYNCED) {
      return (
          <>
            <OnlineSVG className="drawer_menu__sync_info__icon drawer_menu__sync_info__out_icon" />
            <OfflineSVG className="drawer_menu__sync_info__icon drawer_menu__sync_info__main_icon offline" />
          </>
        )
    } else if (syncState === SyncStateEnum.SYNCHRONIZING) {
        return (
          <>
            <OnlineSVG className="drawer_menu__sync_info__icon drawer_menu__sync_info__out_icon" />
            <SyncSVG className='drawer_menu__sync_info__icon drawer_menu__sync_info__synchronizing_icon'/>
          </>
        )
    } else {
      return <OnlineSVG className="drawer_menu__sync_info__icon" />
    }
  }

  return (
    <div className="drawer_menu__sync_info">
      <CloudSVG className="drawer_menu__sync_info__cloud_icon" />
      {getSyncSymbol()}
    </div>
  )
}

export default SyncInfo
