import React from 'react'
import useStyles from '../../styles'
import ContactItemListProps from './props'
import { Avatar, ListItem, ListItemText, ListItemAvatar } from '@material-ui/core'
import ContactsConstants from '../../../../../constants/ContactsConstants'
import { useLanguage } from '../../../../../provider/app_provider'


const ContactItemList = (props: ContactItemListProps): JSX.Element => {

    const classes = useStyles(props)

    const language = useLanguage().current

    const getType = (): string => {
        if (props.item.type === ContactsConstants.MOBILE)
            return language.CONTACTS_MOBILE_PHONE
        else if (props.item.type === ContactsConstants.RESIDENTIAL)
            return language.CONTACTS_RESIDENTIAL_PHONE
        return language.CONTACTS_PUBLIC_SERVICE_PHONE
    }

    return (
        <ListItem button onClick={() => props.onClick(props.item.id)}>
            <ListItemAvatar>
                <Avatar aria-label="recipe" className={classes[props.item.color]}>
                    {props.item.name[0]}
                </Avatar>
            </ListItemAvatar>
            <ListItemText primary={props.item.name} secondary={getType()}
            />
        </ListItem>
    )
}

export default ContactItemList
