import React, { useState, Fragment } from 'react'
import clsx from 'clsx'
import MenuDrawerProps from './props'
import AppConstants from '../../constants/AppConstants'
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import Typography from '@material-ui/core/Typography'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'


/**
 * @description Menu lateral
 * @param props Propriedades definidas em MenuDrawerProps 
 */
const MenuDrawer = (props: MenuDrawerProps) => {

    /** Classes definidas */
    const classes = useStyles()

    /** Tema do menu: mini drawer esquerdo */
    const theme = useTheme()

    /** Estado do menu de aberto e fechado */
    const [open, setOpen] = useState(false)

    /**
     * @description Altera o estado do menu para abert
     */
    const handleDrawerOpen = () => {
        setOpen(true)
    }

    /**
     * @description Altera o estado do menu para fechado
     */
    const handleDrawerClose = () => {
        setOpen(false)
    }

    return (
        <Fragment>
            <CssBaseline />
            <AppBar 
                className={clsx(classes.appBar, {
                    [classes.appBarShift]: open,
                  })}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        className={clsx(classes.menuButton, {
                            [classes.hide]: open,
                        })}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" noWrap>
                        {AppConstants.APP_NAME}
                    </Typography>
                </Toolbar>
            </AppBar>
            <Drawer 
                variant="permanent"
                className={clsx(classes.drawer, {
                    [classes.drawerOpen]: open,
                    [classes.drawerClose]: !open,
                  })}
                classes={{
                    paper: clsx({
                      [classes.drawerOpen]: open,
                      [classes.drawerClose]: !open,
                    }),
                }}
            >
                <div className={classes.toolbar}>
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </div>
                <Divider />
                <List>
                    {props.items.map((item, index) => (
                        <ListItem button key={item.name}>
                            <ListItemIcon>
                                <img className={classes.image} src={item.image} alt={item.name}/>
                            </ListItemIcon>
                            <ListItemText primary={item.name} />
                        </ListItem>
                    ))}
                </List>
            </Drawer>
        </Fragment>
    )
}


/** 
 * @description Tamanho do drawer lateral
 * */ 
const drawerWidth = 240

/** 
 * @description Estilos do Menu
 * */ 
export const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            position: 'fixed',
            justifyContent: 'center',
            zIndex: theme.zIndex.drawer + 1,
            transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
            }),
        },
        appBarShift: {
            marginLeft: drawerWidth,
            width: `calc(100% - ${drawerWidth}px)`,
            transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
            }),
        },
        menuButton: {
            marginRight: 36,
        },
        hide: {
            display: 'none',
        },
        drawer: {
            width: drawerWidth,
            flexShrink: 0,
            whiteSpace: 'nowrap',
        },
        drawerOpen: {
            width: drawerWidth,
            transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
            }),
        },
        drawerClose: {
            transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
            }),
            overflowX: 'hidden',
            width: theme.spacing(7) + 1,
            [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
            },
        },
        toolbar: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            padding: theme.spacing(0, 1),
            // necessary for content to be below app bar
            ...theme.mixins.toolbar,
        },
        content: {
            flexGrow: 1,
            padding: theme.spacing(3),
        },
        image: {
            width: '35px',
            marginLeft: '0px',
        }
    }),
);

export default MenuDrawer