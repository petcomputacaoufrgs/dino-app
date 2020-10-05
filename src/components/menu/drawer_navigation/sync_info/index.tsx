import React from 'react'
import './styles.css'
import { ReactComponent as CloudSVG } from '../../../../assets/icons/sync/cloud.svg'
import { ReactComponent as SyncSVG } from '../../../../assets/icons/sync/sync.svg'
import { ReactComponent as OnlineSVG } from '../../../../assets/icons/sync/check.svg'
import { ReactComponent as OfflineSVG } from '../../../../assets/icons/sync/close.svg'
import { useSync } from '../../../../context_provider/sync'
import SyncState from '../../../../types/sync/SyncState'

const SyncInfo: React.FC = () => {
    const sync = useSync()
    
    const getSyncSymbol = (): JSX.Element => {
      if (sync.state === SyncState.Offline) {
        return (
          <>
            <OnlineSVG className="drawer_menu__sync_info__icon drawer_menu__sync_info__out_icon" />
            <OfflineSVG className="drawer_menu__sync_info__icon drawer_menu__sync_info__main_icon offline" />
          </>
        )
      } else if (sync.state === SyncState.Synchronizing) {
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
      } else {
        return (
          <>
            <SyncSVG className="drawer_menu__sync_info__icon drawer_menu__sync_info__out_icon" />
            <OnlineSVG className="drawer_menu__sync_info__icon drawer_menu__sync_info__main_icon" />
          </>
        )
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