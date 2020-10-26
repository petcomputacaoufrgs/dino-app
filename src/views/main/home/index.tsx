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
      onClick: () => setTimeout(() => HistoryService.push(PathConstants.NOTES), 300),
    }, 
    { 
      class: '__c',
      label: language.MENU_CONTACTS,
      onClick: () => setTimeout(() => HistoryService.push(PathConstants.CONTACTS), 300),
    }, 
    { 
      class: '__g',
      label: language.MENU_GLOSSARY,
      onClick: () => setTimeout(() => HistoryService.push(PathConstants.GLOSSARY), 300),
    }, 
    { 
      class: '__f',
      label: language.MENU_FAQ,
      onClick: () => setTimeout(() => HistoryService.push(PathConstants.FAQ), 300),
    }, 
    { 
      class: '__s',
      label: language.MENU_SETTINGS,
      onClick: () => setTimeout(() => HistoryService.push(PathConstants.SETTINGS), 300),
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
