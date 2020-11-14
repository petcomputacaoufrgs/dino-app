import React, { useState } from 'react'
import { useCurrentLanguage } from '../../../context_provider/app_settings'
import { ListItem, Paper, Dialog, DialogContentText,DialogContent,DialogTitle,DialogActions, Button } from '@material-ui/core'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import HomeItemProps from './props'
import './styles.css'

const Home = () => {

  const [open, setOpen] = useState(-1)

  const handleFirstLogin = () => setOpen(0)

  const handleNextDialog = () => setOpen(open + 1)

  const language = useCurrentLanguage()

  const items: HomeItemProps[] = [
    { class: '__n', label: language.MENU_NOTES, path: PathConstants.NOTES,},
    { class: '__c', label: language.MENU_CONTACTS, path: PathConstants.CONTACTS, },
    { class: '__g', label: language.MENU_GLOSSARY, path: PathConstants.GLOSSARY, },
    { class: '__f', label: language.MENU_FAQ, path: PathConstants.FAQ, },
    { class: '__s', label: language.MENU_SETTINGS, path: PathConstants.SETTINGS, },
    { class: '__a', label: language.MENU_ABOUT_US, path: PathConstants.ABOUT_US, },
  ]

  return (
    <div className="home">
      <div className="home__grid">
        {items.map((item, index) => (
          <ListItem key={index} button className="home__grid__button">
            <Paper
              elevation={2}
              className="home__grid__paper"
              onClick={() => setTimeout(() => HistoryService.push(item.path), 150)}
            >
              <div className={'paper__img ' + item.class}>
                <p className="home__paper__string">{item.label}</p>
              </div>
            </Paper>
          </ListItem>
        ))}
      </div>
      <Button onClick={handleFirstLogin}>Click Me!</Button>
      {
        [1,2,3].map((e,index,array) => { return (
            <Dialog open={open === index}>
              <DialogTitle id="alert-dialog-slide-title">{`${index + 1}/${array.length}: Use Google's location service?`}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-slide-description">
                    Let Google help apps determine location. This means sending anonymous location data to
                    Google, even when no apps are running.
                  </DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleNextDialog} color="primary">
                    Disagree
                  </Button>
                  <Button onClick={handleNextDialog} color="primary">
                    Agree
                  </Button>
                </DialogActions>
            </Dialog>
        )})
      }

    </div>
  )
}

export default Home
