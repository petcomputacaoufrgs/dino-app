import React from 'react'
import useStyles from '../../styles'
import ContactItemListProps from './props'
import { Avatar, ListItem, ListItemText, ListItemAvatar } from '@material-ui/core'
import ContactsConstants from '../../../../../constants/ContactsConstants'
import { useLanguage } from '../../../../../provider/app_provider'


const ContactItemList = (props: ContactItemListProps): JSX.Element => {

    const classes = useStyles(props)

    const language = useLanguage().current

    const getPhoneType = (phones: Array<any>): string => {

        let mobile = false
        let residential = false

        phones.forEach(phone => {
            if (phone.type === ContactsConstants.MOBILE)
                mobile = true
            if (phone.type === ContactsConstants.RESIDENTIAL)
                residential = true
        })

        if (mobile && residential)
            return language.CONTACTS_MOBILE_PHONE + ", " + language.CONTACTS_RESIDENTIAL_PHONE
        else if (mobile)
            return language.CONTACTS_MOBILE_PHONE
        else if (residential)
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
            <ListItemText primary={props.item.name} secondary={getPhoneType(props.item.phones)}
            />
        </ListItem>
    )
}

export default ContactItemList
