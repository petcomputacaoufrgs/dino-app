import React from 'react';
import { useLanguage } from '../../../../../provider/app_provider'
import { Avatar, CardHeader, IconButton } from '@material-ui/core';
import { ColorLens as ColorLensIcon } from '@material-ui/icons'
import useStyles from '../../styles'
import ContactFormDialogHeaderProps from './props'
import ContactsConstants from '../../../../../constants/ContactsConstants'


const AddContactDialogHeader = (props: ContactFormDialogHeaderProps): JSX.Element => {

    const classes = useStyles(props)

    const language = useLanguage().current

    const getType = (): string => {
        if (props.type === ContactsConstants.MOBILE)
            return language.CONTACTS_MOBILE_PHONE
        else if (props.type === ContactsConstants.RESIDENTIAL)
            return language.CONTACTS_RESIDENTIAL_PHONE
        return language.CONTACTS_PUBLIC_SERVICE_PHONE
    }

    const handleChangeColor = () => {

        const colors = ['', 'red', 'pink', 'purple', 'blue', 'green']

        for (let i = 0; i < colors.length; i++) {
            if (props.color === colors[i])
                props.setColor(colors[(i + 1) % colors.length])
        }
    }

    return (
        <CardHeader
            avatar={
                <Avatar aria-label="avatar" className={classes[props.color]}>
                    {props.name ? props.name[0].toUpperCase() : '?'}
                </Avatar>}
            action={
                <IconButton
                    aria-label="color"
                    size='small'
                    className={classes.iconButton}
                    onClick={handleChangeColor}
                >
                    <ColorLensIcon />
                </IconButton>
            }
            title={props.name || language.CONTACTS_ADD_CONTACT}
            subheader={getType()}
        />
    )
}

export default AddContactDialogHeader