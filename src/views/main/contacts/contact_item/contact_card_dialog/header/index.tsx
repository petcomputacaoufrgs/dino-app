import React from 'react'
import { Avatar, IconButton } from '@material-ui/core'
import { CardHeader, } from '@material-ui/core'
import useStyles from '../../../styles'
import { Edit as EditIcon, } from '@material-ui/icons'
import ContactCardHeaderProps from './props'
import ContactsService from '../../../../../../services/contact/ContactsService'


const ContactCardHeader = (props: ContactCardHeaderProps) => {

    const classes = useStyles()

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
            subheader={ContactsService.getPhoneTypes(props.item.phones)}
        />
    )
}

export default ContactCardHeader