import React from 'react'
import { useCurrentLanguage } from '../../../context_provider/app_settings'
import { Avatar, Typography } from '@material-ui/core'
import { useUser } from '../../../context_provider/user'
import './styles.css'
import { Divider, Card, CardContent, CardHeader, IconButton, ListItem, List, Paper } from '@material-ui/core'
import {ArrowRight} from '@material-ui/icons'
import Grid, { GridSpacing } from '@material-ui/core/Grid';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      height: 140,
      width: 100,
    },
    control: {
      padding: theme.spacing(2),
    },
  }),
);

const Home = () => {
  const language = useCurrentLanguage()

  return (
    <div className="home">
      <div style={{padding:'15px', width:'100%'}}>
        <div className='home__grid'>
              {[language.MENU_NOTES, language.MENU_GLOSSARY, language.MENU_FAQ, language.MENU_SETTINGS].map((item) => (
                    <ListItem button style={{padding:'0px', height: '100%'}}>
                        <Paper className='home__paper'>
                          <h5>{item}</h5>
                        </Paper>
                    </ListItem>
              ))}
        </div>
      </div>
    </div>
  )
}

export default Home
