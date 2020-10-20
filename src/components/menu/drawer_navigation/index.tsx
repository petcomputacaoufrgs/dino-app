import React, { useState, useEffect } from 'react'
import clsx from 'clsx'
import DrawerNavigationProps from './props'
import MenuItemViewModel from '../../../types/menu/MenuItemViewModel'
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { Divider, IconButton, AppBar, Toolbar, Drawer } from '@material-ui/core'
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon, Menu as MenuIcon} from '@material-ui/icons'
import { List, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import { useLanguage } from '../../../context_provider/app_settings'
import './styles.css'
import SyncInfo from './sync_info'

const DrawerNavigation = (props: DrawerNavigationProps): JSX.Element => {
  const classes = useStyles()

  const theme = useTheme()

  const language = useLanguage().current

  const [open, setOpen] = useState(false)

  const [sync, setSync] = useState(true)

  const handleDrawerOpen = () => {
    setOpen(true)
  }

  useEffect(() => {
    if (sync) {
      setTimeout(() => setSync(false), 3000)
    }
  })

  const onClose = () => {
    setOpen(false)
  }

  const onClick = (item: MenuItemViewModel) => {
    onClose()
    item.onClick()
  }

  const isLastGroup = (groupIndex: number): boolean =>
    props.groupedItems.length - 1 === groupIndex

  const renderContent = (): JSX.Element => {
    if (props.component) {
      return (
        <main
          className={
            props.mini
              ? classes.contentMini
              : clsx(classes.content, {
                  [classes.contentShift]: open,
                })
          }
        >
          <div
            className={props.mini ? classes.toolbar : classes.drawerHeader}
          />
          {props.component}
        </main>
      )
    }

    return <></>
  }

  const renderItems = (items: MenuItemViewModel[]): JSX.Element[] =>
    items.map((item, itemIndex) => (
      <ListItem button key={itemIndex} onClick={() => onClick(item)}>
        <ListItemIcon>
          <img className={classes.image} src={item.image} alt={item.name} />
        </ListItemIcon>
        <ListItemText primary={item.name} />
      </ListItem>
    ))

  const renderGroupItems = (): JSX.Element[] =>
    props.groupedItems.map((items, groupIndex) => (
      <div key={groupIndex}>
        <List>{renderItems(items)}</List>
        {!isLastGroup(groupIndex) && <Divider />}
      </div>
    ))

  const renderAppBar = (): JSX.Element => (
    <AppBar
      className={clsx(
        classes.appBar,
        props.mini
          ? { [classes.appBarShiftMini]: open }
          : { [classes.appBarShift]: open }
      )}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label={language.OPEN_MENU_ARIA_LABEL}
          onClick={handleDrawerOpen}
          edge="start"
          className={clsx(
            props.mini ? classes.menuButtonMini : classes.menuButton,
            props.mini ? { [classes.hide]: open } : open && classes.hide
          )}
        >
          <MenuIcon />
        </IconButton>
        <SyncInfo />
      </Toolbar>
    </AppBar>
  )

  const renderDrawer = (): JSX.Element => (
    <Drawer
      variant={props.mini ? 'permanent' : 'persistent'}
      anchor={props.mini ? undefined : 'left'}
      open={props.mini ? undefined : open}
      className={
        props.mini
          ? clsx(classes.drawer, {
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })
          : classes.drawer
      }
      classes={{
        paper: props.mini
          ? clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            })
          : classes.drawerPaper,
      }}
    >
      <div className={props.mini ? classes.toolbar : classes.drawerHeader}>
        <IconButton onClick={onClose}>
          {theme.direction === 'ltr' ? (
            <ChevronLeftIcon />
          ) : (
            <ChevronRightIcon />
          )}
        </IconButton>
      </div>
      <Divider />
      {renderGroupItems()}
      <button 
        className={open ? 'button__close-drawer' 
        : 'button__close-drawer__closed'} 
        onClick={onClose}
      />
    </Drawer>
  )

  return (
    <div className={classes.root.concat(' drawer_menu')}>
      <CssBaseline />
      {renderAppBar()}
      {renderDrawer()}
      {renderContent()}
    </div>
  )
}

const drawerWidth: number = 240

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    appBar: {
      position: 'fixed',
      height: '54px',
      backgroundColor: '#B32E55',
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
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    appBarShiftMini: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    menuButtonMini: {
      marginRight: 36,
    },
    menuButton: {
      marginRight: theme.spacing(2),
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
    drawerPaper: {
      width: drawerWidth,
    },
    drawerHeader: {
      display: 'flex',
      alignItems: 'center',
      padding: theme.spacing(0, 1),
      justifyContent: 'flex-end',
      height: '54px',
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
      height: '54px',
      padding: theme.spacing(0, 1),
    },
    contentMini: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: -drawerWidth,
    },
    contentShift: {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    },
    image: {
      width: '35px',
      marginLeft: '0px',
    },
  })
)

export default DrawerNavigation
