import React, { useState, useEffect } from 'react'
import './styles.css'
import { ReactComponent as CloudSVG } from '../../../../../assets/icons/sync/cloud.svg'
import { ReactComponent as SyncSVG } from '../../../../../assets/icons/sync/sync.svg'
import { ReactComponent as OnlineSVG } from '../../../../../assets/icons/sync/check.svg'
import { ReactComponent as OfflineSVG } from '../../../../../assets/icons/sync/close.svg'
import SyncStateEnum from '../../../../../types/sync/SyncStateEnum'
import { useSync } from '../../../../../context/provider/sync'

const SyncInfo: React.FC = () => {
  const sync = useSync()

  const [wasSyncronizing, setWasSincronizing] = useState(false)

  useEffect(() => {
    if (sync.state === SyncStateEnum.SYNCHRONIZING) {
      setWasSincronizing(true)
      const interval = setInterval(() => setWasSincronizing(false), 500)
      const cleanBeforeUpdate = () => {
        clearInterval(interval)
      }

      return cleanBeforeUpdate
    }
  }, [sync])

  const getSyncSymbol = (): JSX.Element => {
    if (sync.state === SyncStateEnum.OFFLINE) {
      return (
        <>
          <OnlineSVG className="drawer_menu__sync_info__icon drawer_menu__sync_info__out_icon" />
          <OfflineSVG className="drawer_menu__sync_info__icon drawer_menu__sync_info__main_icon offline" />
        </>
      )
    } else if (sync.state === SyncStateEnum.SYNCHRONIZING) {
      return (
        <>
          <OfflineSVG className="drawer_menu__sync_info__icon drawer_menu__sync_info__out_icon offline" />
          <SyncSVG
            className={
              'drawer_menu__sync_info__icon drawer_menu__sync_info__synchronizing_icon'
            }
          />
        </>
      )
    } else if (wasSyncronizing) {
      return (
        <>
          <SyncSVG className="drawer_menu__sync_info__icon drawer_menu__sync_info__out_icon" />
          <OnlineSVG className="drawer_menu__sync_info__icon drawer_menu__sync_info__main_icon" />
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
