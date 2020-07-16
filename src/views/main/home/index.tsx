import React, { useEffect } from 'react'
import { useLanguage } from '../../../provider/app_settings_provider'
import { Avatar, Typography } from '@material-ui/core'
import UserService from '../../../services/user/UserService'
import './styles.css'
import ImageUtils from '../../../utils/ImageToBase64Utils'

const Home = () => {
  const language = useLanguage().current

  const avatarSrc = UserService.getPictureUrl()

  const username = UserService.getName()

  useEffect(() => {
    const callback = (teste: string, success: boolean) => {
      console.log('callback')
      console.log(teste)
    }

    ImageUtils.getBase64FromImageSource(avatarSrc, 'jpeg', callback)
  })

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
