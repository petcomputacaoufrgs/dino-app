import React from 'react'
import useStyles from '../../styles'
import ContactItemListProps from './props'
import { Avatar, List, ListItem, ListItemText, ListItemAvatar } from '@material-ui/core'


const ContactItemList = (props: ContactItemListProps): JSX.Element => {

    const classes = useStyles(props)

    return (
        <ListItem button onClick={() => props.onClick(props.item.id)}>
            <ListItemAvatar>
                <Avatar aria-label="recipe" className={classes[props.item.color]}>
                    {props.item.name[0]}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={props.item.name} secondary={props.item.type}
            />
        </ListItem>
    )
}

export default ContactItemList
