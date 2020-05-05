import React, { useState } from 'react'
import clsx from 'clsx'
import DrawerNavigationProps from './props'
import MenuItemViewModel from '../../../model/view/MenuItemViewModel'
import { createStyles, makeStyles, Theme, useTheme } from '@material-ui/core/styles'
import Drawer from '@material-ui/core/Drawer'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppBar from '@material-ui/core/AppBar'
import Toolbar from '@material-ui/core/Toolbar'
import IconButton from '@material-ui/core/IconButton'
import MenuIcon from '@material-ui/icons/Menu'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import ChevronRightIcon from '@material-ui/icons/ChevronRight'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import './styles.css'

/**
 * @description Menu lateral
 * @param props Propriedades definidas em MenuDrawerProps 
 */
const DrawerNavigation = (props: DrawerNavigationProps): JSX.Element => {

    /** Classes definidas */
    const classes = useStyles()

    /** Tema do menu: mini drawer esquerdo */
    const theme = useTheme()

    /** Estado do menu de aberto e fechado */
    const [open, setOpen] = useState(false)

    /**
     * @description Altera o estado do menu para abert
     */
    const handleDrawerOpen = ()  => {
        setOpen(true)
    }

    /**
     * @description Altera o estado do menu para fechado
     */
    const onClose = () => {
        setOpen(false)
    }

    /**
     * @description Chama a função correspondente ao item selecionado
     * @param index Indice do item clicado na lista de items da props
     */
    const onClick = (item: MenuItemViewModel) => {
        item.onClick()
        setTimeout(onClose, 100)
    }

    /**
     * @description Retorna se o indice dado pertence ao último item do groupedItems
     * @param groupIndex Indice de um grupo dentro do vetor groupedItems
     */
    const isLastGroup = (groupIndex: number): boolean => (
        (props.groupedItems.length - 1) === groupIndex
    )

    /**
     * @description Retorna o componente do item selecionado no menu atualmente
     */
    const renderContent = (): JSX.Element => {
        if (props.component) {
            return (
                <main
                className={props.mini ? classes.contentMini : clsx(classes.content, {
                    [classes.contentShift]: open,
                })}
                >
                    <div className={props.mini ? classes.toolbar : classes.drawerHeader} />
                    {props.component}
                </main>
            )
        } 
        
        return <></>
    }

    /**
     * @description rendeniza um grupo de itens
     */
    const renderItems = (items: MenuItemViewModel[]): JSX.Element[] => (
        items.map((item, itemIndex) => (
            <ListItem button key={itemIndex} onClick={() => onClick(item)}>
                <ListItemIcon>
                    <img className={classes.image} src={item.image} alt={item.name}/>
                </ListItemIcon>
                <ListItemText primary={item.name} />
            </ListItem>
        ))
    )

    /**
     * @description Rendeniza todos os itens do menu
     */
    const renderGroupItems = (): JSX.Element[] => (
        props.groupedItems.map((items, groupIndex) => (
            <div key={groupIndex}>
                <List>
                    {renderItems(items)}
                </List>
                {!isLastGroup(groupIndex) && <Divider/>}
            </div>
        ))
    )

    /**
     * @description Rendeniza a AppBar se necessário
     */
    const renderAppBar = (): JSX.Element => (
        <AppBar 
        className={clsx(classes.appBar, props.mini 
            ? { [classes.appBarShiftMini]: open, } 
            :  { [classes.appBarShift]: open, }
        )}
        >
            <Toolbar>
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    className={clsx(props.mini ? classes.menuButtonMini : classes.menuButton, props.mini ? {[classes.hide]: open, } : open && classes.hide)}
                >
                    <MenuIcon />
                </IconButton>
            </Toolbar>
        </AppBar>
    )

    /**
     * @description Rendeniza o menu completo
     */
    const renderDrawer = (): JSX.Element => (
        <Drawer 
            variant={props.mini ? 'permanent' : "persistent" }
            anchor={props.mini ? undefined : 'left'}
            open={props.mini ? undefined : open }
            className={props.mini ? clsx(classes.drawer, {
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }) : classes.drawer}
            classes={{
                paper: props.mini ? clsx({
                  [classes.drawerOpen]: open,
                  [classes.drawerClose]: !open,
                }) : classes.drawerPaper,
            }}
        >
            <div className={props.mini ? classes.toolbar : classes.drawerHeader}>
                <IconButton onClick={onClose}>
                    {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                </IconButton>
            </div>
            <Divider />
            {renderGroupItems()}
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


/** 
 * @description Tamanho do drawer lateral
 * */ 
const drawerWidth: number = 240

/** 
 * @description Estilos do Menu
 * */ 
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            display: 'flex',
        },
        appBar: {
            position: 'fixed',
            height: '45px',
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
            height: '45px',
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
            height: '45px',
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
    }),
)

export default DrawerNavigation