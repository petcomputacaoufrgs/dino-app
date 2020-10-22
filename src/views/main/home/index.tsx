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
                        <Paper elevation={2} style={{
                            width: '100%',
                            height: 'calc(50vw - 18px)',
                            backgroundImage: 'url(../../../assets/icons/menu_icons/glossary.svg)',
                            backgroundSize: 'cover',
                            backgroundColor: '#ADC2B9',
                            display: 'grid',
                            placeItems: 'center',
                            fontSize: '5.5vmin',
                            fontWeight: 'bold',
                        }}>
                              <p className='home__paper__string'>{item}</p>
                        </Paper>
                    </ListItem>
              ))}
        </div>
    </div>
  )
}

export default Home
