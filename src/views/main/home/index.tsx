import React from 'react'
import { useLanguage } from '../../../provider/app_settings_provider'
import { Avatar, Typography } from '@material-ui/core'
import { useUser } from '../../../provider/user_provider'
import './styles.css'

const Home = () => {
  const language = useLanguage().current

  const user = useUser()

  return (
    <div className="home">
      <Typography className="home__welcome_message" component="p">
        {language.WELCOME_MESSAGE}
      </Typography>
      <Avatar
        src={user.picture}
        alt={language.AVATAR_ALT}
        className="home__avatar"
      />
      <Typography className="home__username" component="p">
        {user.name}
      </Typography>
    </div>
  )
}

export default Home
