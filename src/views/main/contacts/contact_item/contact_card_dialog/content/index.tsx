import React from 'react'
import ContactsConstants from '../../../../../../constants/ContactsConstants'
import ContactCardContentProps from './props'
import { Typography, CardContent } from '@material-ui/core'
import useStyles from '../../../styles'
import { List, ListItem, ListItemText, ListItemIcon, Divider } from '@material-ui/core'
import { Person as PersonIcon, Phone as PhoneIcon, Home as HomeIcon, LocalHospital as LocalHospitalIcon } from '@material-ui/icons'

const ContactCardContent = (props: ContactCardContentProps) => {

    const classes = useStyles()

    const getTypePhoneIcon = () => {
        if (props.item.type === ContactsConstants.MOBILE)
            return <PhoneIcon />
        else if (props.item.type === ContactsConstants.RESIDENTIAL)
            return <HomeIcon />

        return <LocalHospitalIcon />
    }

    const getDescription = () => {
        if (props.item.description)
            return (
                <ListItem button className={classes.ListItem}>
                    <ListItemIcon >
                        <PersonIcon />
                    </ListItemIcon>
                    <ListItemText primary={
                        <Typography
                            variant="body2"
                            color="textSecondary"
                            component="p"
                            className={classes.TextContact}>
                            {props.item.description}
                        </Typography>
                    }
                    />
                </ListItem>)
        return <></>
    }

    return (
        <CardContent className={classes.CardContent}>
            {getDescription()}
            <List component="nav" aria-label="idk">
                <Divider className={classes.DividerMargin} />
                <ListItem button className={classes.ListItem}>
                    <ListItemIcon>
                        {getTypePhoneIcon()}
                    </ListItemIcon>
                    <ListItemText primary={
                        <Typography variant="subtitle1" color="textSecondary" component="p">
                            {props.item.phone}
                        </Typography>}
                    />
                </ListItem>
            </List>
        </CardContent>
    )
}

export default ContactCardContent