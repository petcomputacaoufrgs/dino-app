import React, {useState, useEffect} from 'react'
import ContactsConstants from '../../../../../../constants/ContactsConstants'
import ContactCardContentProps from './props'
import useStyles from '../../../styles'
import { Typography, CardContent, List, ListItem, ListItemText, ListItemIcon, ListItemSecondaryAction, Divider, IconButton } from '@material-ui/core'
import { Person as PersonIcon, Phone as PhoneIcon, Home as HomeIcon, LocalHospital as LocalHospitalIcon, Delete as DeleteIcon } from '@material-ui/icons'
import PhoneModel from '../../../../../../services/contact/api_model/PhoneModel'
import ContactModel from '../../../../../../services/contact/api_model/ContactModel'
import Service from '../../../../../../services/contact/ContactsService'

const ContactCardContent = (props: ContactCardContentProps) => {

    const classes = useStyles()
    const [phones, setPhones] = useState(new Array<PhoneModel>())

    useEffect(() => setPhones([...props.item.phones]), [])

    const getTypePhoneIcon = (phone: PhoneModel) => {
        if (phone.type === ContactsConstants.MOBILE)
            return <PhoneIcon />
        else if (phone.type === ContactsConstants.RESIDENTIAL)
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
                {phones.map((phone) => (
                    <ListItem button className={classes.ListItem} key={phone.number}>
                        <ListItemIcon>
                            {getTypePhoneIcon(phone)}
                        </ListItemIcon>
                        <ListItemText primary={
                            <Typography variant="subtitle1" color="textSecondary" component="p">
                                {phone.number}
                            </Typography>}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete" 
                            onClick={() => setPhones([...Service.deletePhone(props.item, phone)])}>
                                <DeleteIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                ))}
            </List>
        </CardContent>
    )
}

export default ContactCardContent