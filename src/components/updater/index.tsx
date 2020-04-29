import React, { useContext } from 'react'
import LocalStorageService from '../../services/local_storage/LocalStorageService'
import UpdateService from '../../services/UpdateService'
import { LanguageContext } from '../language_provider/index'
import UpdaterProps from './props'

const Updater = (props: UpdaterProps): JSX.Element => {

    const languageContext = useContext(LanguageContext)    

    LocalStorageService.cleanGarbage()
    UpdateService.checkUpdates(languageProvider)

    return (
        <>
        {props.children}
        </>
    )
}

export default Updater