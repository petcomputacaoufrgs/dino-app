import React from 'react'
import MenuService from '../../../services/menu/MenuService'
import IconButton from '../../../components/button/icon_button'
import LinkButton from '../../../components/button/link_button'
import HistoryService from '../../../services/history/HistoryService'
import PathConstants from '../../../constants/app/PathConstants'
import { useLanguage } from '../../../context/language'
import './styles.css'

const Home: React.FC<void> = () => {
  const language = useLanguage()

  const items = MenuService.getMainPages(language.data).filter(
    (item) => item.name !== language.data.MENU_HOME
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
      <LinkButton
        text={language.data.TERMS_OF_USE}
        onClick={() => HistoryService.push(PathConstants.TERMS_OF_USE)}
      />
      <LinkButton
        text={language.data.PRIVACY_POLICY}
        onClick={() => HistoryService.push(PathConstants.PRIVACY_POLICY)}
      />
    </div>
  )
}

export default Home
