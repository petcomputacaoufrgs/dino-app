import React from 'react'
import useStyles from '../../styles'
import ContactItemListProps from './props'
import { Avatar, ListItem, ListItemText, ListItemAvatar } from '@material-ui/core'
import ContactsService from '../../../../../services/contact/ContactsService'


const ContactItemList = (props: ContactItemListProps): JSX.Element => {

    const classes = useStyles(props)

    return (
        <ListItem button onClick={() => props.onClick(props.item.id)}>
            <ListItemAvatar>
                <Avatar aria-label="recipe" className={classes[props.item.color]}>
                    {props.item.name[0]}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={props.item.name} secondary={ContactsService.getPhoneTypes(props.item.phones)}
            />
        </ListItem>
    )
}

export default ContactItemList
