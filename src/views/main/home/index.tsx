import React, { useContext } from 'react'
import { Avatar } from '@material-ui/core'
import { AppContext } from '../../../provider/app_provider'
import './styles.css'
import UserAuthDataStorageService from '../../../local_storage/UserAuthDataStorage'

const Home = () => {
    const language = useContext(AppContext).language.currentLanguage

    const avatarSrc = UserAuthDataStorageService.getPictureUrl()

    const username = UserAuthDataStorageService.getName()
    
    return (
        <div className='home'>
            <p className='home__welcome_message'>{language.WELCOME_MESSAGE}</p>
            <Avatar src={avatarSrc} alt={language.AVATAR_ALT} className='home__avatar' />
            <p className='home__username'>{username}</p>
        </div>
    )
}

export default Home