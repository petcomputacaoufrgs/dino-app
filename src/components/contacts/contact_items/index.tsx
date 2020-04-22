import './styles.css'
import React, { useState } from 'react';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import { Avatar, List, ListItem, ListItemText, ListItemAvatar, Modal } from '@material-ui/core'
//import Divider from '@material-ui/core/Divider';
import ContactItemsProps from './props';
import ContactItem from '../contact_item'
import { Backdrop, Fade } from '@material-ui/core'
import { red, pink, purple, blue, green } from '@material-ui/core/colors';

const useStyles = makeStyles(() =>
    createStyles({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }, root: {
            maxWidth: 345,
        },
        red: {
            backgroundColor: red[500],
        },
        pink: {
            backgroundColor: pink[500],
        },
        purple: {
            backgroundColor: purple[500],
        },
        blue: {
            backgroundColor: blue[500],
        },
        green: {
            backgroundColor: green[500],
        },
    }),
);

const ContactItems = (props: ContactItemsProps): JSX.Element => {

    const [selectedIndex, setSelectedIndex] = useState(0);
    const classes = useStyles();
    const [open, setOpen] = useState(false);

    const handleOpen = (id: number) => {
        setOpen(true);
        setSelectedIndex(id)
    }

    const handleClose = () => {
        setOpen(false)
    }

    return (
        <List className='list'>
            {props.items.map(item =>
                <div className='contact-item' key={item.id}>
                    <ListItem
                        button //selected={selectedIndex === item.id}
                        onClick={() => handleOpen(item.id)}>
                        <ListItemAvatar>
                        <Avatar aria-label="recipe" className={classes[item.color]}>{item.name[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item.name} secondary={item.number} />
                    </ListItem>
                    <Modal
                        aria-labelledby="transition-modal-title"
                        aria-describedby="transition-modal-description"
                        className={classes.modal}
                        open={open && selectedIndex === item.id}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{ timeout: 500, }}
                    >
                        <Fade in={open && selectedIndex === item.id}>
                            <ContactItem id={item.id} name={item.name} number={item.number} info={item.info} color={item.color}/>
                        </Fade>
                    </Modal>
                </div>
            )}
        </List>
    )
}


export default ContactItems