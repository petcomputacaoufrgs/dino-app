import React from 'react'
import { Avatar, IconButton } from '@material-ui/core'
import { CardHeader, } from '@material-ui/core'
import useStyles from '../../../styles'
import { Edit as EditIcon, } from '@material-ui/icons'
import ContactsConstants from '../../../../../../constants/ContactsConstants'
import { useLanguage } from '../../../../../../provider/app_provider'
import ContactCardHeaderProps from './props'


const ContactCardHeader = (props: ContactCardHeaderProps) => {

    const classes = useStyles()
    const language = useLanguage().current


    const getPhoneType = (): string => {
        if (props.item.type === ContactsConstants.MOBILE)
            return language.CONTACTS_MOBILE_PHONE
        else if (props.item.type === ContactsConstants.RESIDENTIAL)
            return language.CONTACTS_RESIDENTIAL_PHONE
        return language.CONTACTS_PUBLIC_SERVICE_PHONE
    }

    const handleEdit = () => {
        props.onClose()
        setTimeout(() => { props.setEdit(true) }, 300);
    }

    return (
        <CardHeader
            avatar={
                <Avatar aria-label="avatar" className={classes[props.item.color]}>
                    {props.item.name[0].toUpperCase()}
                </Avatar>
            }
            action={
                <>
                    <IconButton aria-label="edit" size='small' className={classes.iconButton} onClick={handleEdit}>
                        <EditIcon />
                    </IconButton>
                </>
            }
            title={props.item.name}
            subheader={getPhoneType()}
        />
    )
}

export default ContactCardHeader