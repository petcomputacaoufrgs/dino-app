import React from 'react'
import { useCurrentLanguage } from '../../../context/provider/app_settings'
import { ListItem, Paper } from '@material-ui/core'
import HomeItemProps from './props'
import MenuService from '../../../services/menu/MenuService'
import MenuItemViewModel from '../../../types/menu/MenuItemViewModel'
import './styles.css'

const Home: React.FC<HomeItemProps> = () => {
  const language = useCurrentLanguage()

  const items = MenuService.getMainPages(language).filter(item => item.name !== language.MENU_HOME)

  const renderImage = (item: MenuItemViewModel) => {
    const Image = item.image

    return <Image className='img' /> 
  }
  
  return (
    <div className="home">
      <div className="home__grid">
        {items.map((item, index) => (
          <div className="home__grid__item" key={index}>
            <ListItem button className="home__grid__button">
              <Paper
                className='home__grid__paper'
                onClick={() => setTimeout(() => item.onClick(), 150)}
              >
                {renderImage(item)}
              </Paper>
            </ListItem>
            <p className="home__grid__item__name">{item.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Home
