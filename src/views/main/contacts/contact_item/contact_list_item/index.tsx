import React from 'react'
import useStyles from '../../styles'
import ContactItemListProps from './props'
import { Avatar, ListItem, ListItemText, ListItemAvatar, ListItemSecondaryAction, IconButton, Menu, MenuItem } from '@material-ui/core'
import ContactsService from '../../../../../services/contact/ContactsService'
import { MoreVert } from '@material-ui/icons'

const ContactItemList = (props: ContactItemListProps): JSX.Element => {

    const classes = useStyles(props)
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
    }

    const handleClose = () => {
        setAnchorEl(null)
    }

    const handleEdit = () => {
        props.setSelected(props.item.id)
        props.setEdit(true)
        handleClose()
    }
    const handleDelete = () => {
        props.setSelected(props.item.id)
        props.setDelete(true)
        handleClose()
    }

    return (
        <>
            <ListItem button onClick={() => props.onClick(props.item.id)}>
                <ListItemAvatar>
                    <Avatar aria-label="recipe" className={classes[props.item.color]}>
                        {props.item.name[0]}
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary={props.item.name} secondary={ContactsService.getPhoneTypes(props.item.phones)}
                />
                <ListItemSecondaryAction>
                    <IconButton edge="end" aria-label="options" onClick={handleClick}>
                        <MoreVert />
                    </IconButton>
                </ListItemSecondaryAction>
            </ListItem>
            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={handleEdit}>Editar</MenuItem>
                <MenuItem onClick={handleDelete}>Excluir</MenuItem>
            </Menu>
        </>
    )
}

export default ContactItemList
