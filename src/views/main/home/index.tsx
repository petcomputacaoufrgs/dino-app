import React from 'react'
import { useCurrentLanguage } from '../../../context/provider/app_settings'
import HomeItemProps from './props'
import MenuService from '../../../services/menu/MenuService'
import IconButton from '../../../components/button/icon_button'
import './styles.css'
import FirstLoginDialog from './first_login_dialog'

const Home: React.FC<HomeItemProps> = () => {
  const language = useCurrentLanguage()

  const items = MenuService.getMainPages(language).filter(
    (item) => item.name !== language.MENU_HOME
  )

  return (
    <div className="home">
      <div className="home__grid">
        {items.map((item, index) => (
          <div className="home__grid__item" key={index}>
            <IconButton
              icon={item.image}
              className="home__grid__button"
              onClick={() => setTimeout(() => item.onClick(), 150)}
            />
            <p className="home__grid__item__name">{item.name}</p>
          </div>
        ))}
      </div>
      <Button onClick={handleFirstLogin}>My First Login!</Button>
      <FirstLoginDialog open={open} handleClose={() => setOpen(false)} />
    </div>
  )
}

export default Home
