import React from 'react'
import { useCurrentLanguage } from '../../../context_provider/app_settings'
import './styles.css'
import { ListItem, Paper } from '@material-ui/core'

const Home = () => {
  const language = useCurrentLanguage()

  return (
    <div className="home">
        <div className='home__grid'>
              {[language.MENU_NOTES, language.MENU_GLOSSARY, language.MENU_FAQ, language.MENU_SETTINGS].map((item) => (
                    <ListItem button style={{padding:'0px', height: '100%'}}>
                        <Paper className='home__paper'>
                            <p className='home__paper__string'>{item}</p>
                        </Paper>
                    </ListItem>
              ))}
        </div>
    </div>
  )
}

export default Home
