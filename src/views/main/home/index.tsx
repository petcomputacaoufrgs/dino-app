import React from 'react'
import { useLanguage } from '../../../provider/app_provider'
import { Avatar } from '@material-ui/core'
import UserService from '../../../services/user/UserService'
import './styles.css'

const Home = () => {
    const language = useLanguage().currentLanguage

    const avatarSrc = UserService.getPictureUrl()

    const username = UserService.getName()
    
    return (
        <div className='home'>
            <p className='home__welcome_message'>{language.WELCOME_MESSAGE}</p>
            <Avatar src={avatarSrc} alt={language.AVATAR_ALT} className='home__avatar' />
            <p className='home__username'>{username}</p>
        </div>
    )
}

export default Home