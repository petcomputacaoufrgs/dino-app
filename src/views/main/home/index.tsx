import React from 'react'
import { useCurrentLanguage } from '../../../context_provider/app_settings'
import './styles.css'
import { ListItem, Paper } from '@material-ui/core'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import homeItemProps from './props'


const Home = () => {

  const language = useCurrentLanguage()

  const items: homeItemProps[] = [
    { 
      class: '__n',
      label: language.MENU_NOTES,
      onClick: () => HistoryService.push(PathConstants.NOTES),
    }, 
    { 
      class: '__c',
      label: language.MENU_CONTACTS,
      onClick: () => HistoryService.push(PathConstants.CONTACTS),
    }, 
    { 
      class: '__g',
      label: language.MENU_GLOSSARY,
      onClick: () => HistoryService.push(PathConstants.GLOSSARY),
    }, 
    { 
      class: '__f',
      label: language.MENU_FAQ,
      onClick: () => HistoryService.push(PathConstants.FAQ),
    }, 
    { 
      class: '__s',
      label: language.MENU_SETTINGS,
      onClick: () => HistoryService.push(PathConstants.SETTINGS),
    }
  ]

  return (
    <div className="home">
        <div className='home__grid'>
              {items.map(item => (
                    <ListItem button className='home__grid__button'>
                        <Paper elevation={2} className={`home__grid__paper${item.class}`} onClick={item.onClick}>
                          <p className='home__paper__string'>{item.label}</p>
                        </Paper>
                    </ListItem>
              ))}
        </div>
    </div>
  )
}

export default Home
