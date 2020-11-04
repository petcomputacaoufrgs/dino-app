import React from 'react'
import { useCurrentLanguage } from '../../../context/provider/app_settings'
import { ListItem, Paper } from '@material-ui/core'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import HomeItemProps from './props'
import './styles.css'

const Home = () => {

  const language = useCurrentLanguage()

  const items: HomeItemProps[] = [
    { 
      class: '__n',
      label: language.MENU_NOTES,
      path: PathConstants.NOTES,
    }, 
    { 
      class: '__c',
      label: language.MENU_CONTACTS,
      path: PathConstants.CONTACTS,
    }, 
    { 
      class: '__g',
      label: language.MENU_GLOSSARY,
      path: PathConstants.GLOSSARY,
    }, 
    { 
      class: '__f',
      label: language.MENU_FAQ,
      path: PathConstants.FAQ,
    }, 
    { 
      class: '__s',
      label: language.MENU_SETTINGS,
      path: PathConstants.SETTINGS,
    }
  ]

  return (
    <div className="home">
        <div className='home__grid'>
            {items.map(item => (
              <ListItem button className='home__grid__button'>
                  <Paper 
                    elevation={2} 
                    className="home__grid__paper" 
                    onClick={() => setTimeout(() => HistoryService.push(item.path), 150)}>
                      <div className={"img " + item.class}>
                        <p className='home__paper__string'>{item.label}</p>
                      </div>
                  </Paper>
              </ListItem>
            ))}
        </div>
    </div>
  )
}

export default Home
