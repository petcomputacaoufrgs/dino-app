import React from 'react'
import { useCurrentLanguage } from '../../../context_provider/app_settings'
import { Avatar, Typography } from '@material-ui/core'
import { useUser } from '../../../context_provider/user'
import './styles.css'
import { Divider, Card, CardContent, CardHeader, IconButton, ListItem, List } from '@material-ui/core'
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

  const user = useUser()

  const classes = useStyles();

  const spacing = 2

  return (
    <div className="home">
{/**      <Typography className="home__welcome_message" component="p">
        {language.WELCOME_MESSAGE}
      </Typography>
      <Avatar
        src={user.picture}
        alt={language.AVATAR_ALT}
        className="home__avatar"
      />
      <Typography className="home__username" component="p">
        {user.name}
      </Typography> */}


        {[0, 1, 2, 4].map((value) => (
          <div 
          style={{padding:'15px'}}
        >
            <ListItem button style={{padding:'0px', width:'fit-content'}}>
            <Card raised style={{display:'flex'}}>
              <CardHeader 
                title='Componente!' 
                subheader='Algo'
              />
              <CardContent>
                <IconButton><ArrowRight/></IconButton>
              </CardContent>
            </Card>
            </ListItem>
            </div>
        ))}
    </div>
  )
}

export default Home
