import React from 'react'
import { useLanguage } from '../../../provider/app_provider'
import { Avatar, Typography } from '@material-ui/core'
import UserService from '../../../services/user/UserService'
import './styles.css'

const Home = () => {
  const language = useLanguage().currentLanguage

  const avatarSrc = UserService.getPictureUrl()

  const username = UserService.getName()

  return (
    <div className="home">
      <Typography className="home__welcome_message" component="p">
        {language.WELCOME_MESSAGE}
      </Typography>
      <Avatar
        src={avatarSrc}
        alt={language.AVATAR_ALT}
        className="home__avatar"
      />
      <Typography className="home__username" component="p">
        {username}
      </Typography>
    </div>
  )
}

export default Home
