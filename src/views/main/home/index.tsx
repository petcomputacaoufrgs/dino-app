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
                    <ListItem button className='home__grid__button'>
                        <Paper elevation={2} className='home__grid__paper'>
                            <p className='home__paper__string'>{item}</p>
                            <img src="https://s2.glbimg.com/z_gIOSUdsxyNGClgVLYVBHBziyw=/0x0:400x400/400x400/s.glbimg.com/po/tt2/f/original/2016/05/20/new-google-favicon-logo.png"></img>
                        </Paper>
                    </ListItem>
              ))}
        </div>
    </div>
  )
}

export default Home
