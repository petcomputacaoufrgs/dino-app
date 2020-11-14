import React, { useState } from 'react'
import { useCurrentLanguage } from '../../../context_provider/app_settings'
import { ListItem, Paper, Dialog, DialogContentText,DialogContent,DialogTitle,DialogActions, Button, Checkbox } from '@material-ui/core'
import PathConstants from '../../../constants/app/PathConstants'
import HistoryService from '../../../services/history/HistoryService'
import HomeItemProps from './props'
import './styles.css'
import FirstLoginDialog from './first_login_dialog'

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
        [{
          title:"AAAAAAAAAAAAAAA?",
          text:"AAAAAAA Lorem ipsum dolor sit amet",
        },
        {
          title:"BBBBBBBBBBBB?",
          text: "BBBBBBBB Lorem ipsum dolor sit amet",
        },
        {
          title:"CCCCCCCCCCC?",
          text:"CCCCCCCC Lorem ipsum dolor sit amet",
        }].map((dialog, index, array) => 
          <FirstLoginDialog
            open={open === index}
            dialog={dialog}
            dialogId={index + 1}
            totalDialogs={array.length}
            handleNextDialog={handleNextDialog}
            key={index}
          />
          )
      }

    </div>
  )
}

export default Home
