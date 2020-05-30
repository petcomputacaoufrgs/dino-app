import React from 'react';
import { useLanguage } from '../../../../../provider/app_provider'
import { Avatar, CardHeader, IconButton } from '@material-ui/core';
import ColorLensIcon from '@material-ui/icons/ColorLens'
import useStyles from '../../styles'

const AddContactDialogHeader = (props:
    { name: string, type: string, color: string, setColor: React.Dispatch<React.SetStateAction<string>> }
): JSX.Element => {

    const classes = useStyles(props)

    const language = useLanguage().current

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
                    onClick={handleChangeColor}
                >
                    <ColorLensIcon />
                </IconButton>
            }
            title={props.name || language.CONTACTS_ADD_CONTACT}
            subheader={props.type}
        />
    )
}

export default AddContactDialogHeader