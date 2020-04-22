import './styles.css'
import React, { useState } from 'react';
import ContactItemsProps from './props';
import ContactItem from '../contact_item'
import { Avatar, List, ListItem, ListItemText, ListItemAvatar, Modal, Divider } from '@material-ui/core'
import { Backdrop, Fade, Slide, Zoom } from '@material-ui/core'

import { red, pink, purple, blue, green } from '@material-ui/core/colors';
import { makeStyles, createStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles(() =>
    createStyles({
        modal: {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            outline: 0,
            '&$selected': {
                outline: 0,
            },
        },
        card: {
            maxWidth: '70%',
            outline: 0,
        },
        red: { backgroundColor: red[500], },
        pink: { backgroundColor: pink[500], },
        purple: { backgroundColor: purple[500], },
        blue: { backgroundColor: blue[500], },
        green: { backgroundColor: green[500], },
    }),
)


const ContactItems = (props: ContactItemsProps): JSX.Element => {

    const [selectedItem, setSelectedItem] = useState(0)
    const [open, setOpen] = useState(false);
    const classes = useStyles()

    const handleOpen = (id: number) => {
        setOpen(true)
        setSelectedItem(id)
    }
    const handleClose = () => setOpen(false)

    const isOpen = (id: number) => open && selectedItem === id

    return (
        <List className='list'>
            {props.items.map(item =>
                <div className='contact-item' key={item.id}>
                    <ListItem
                        button onClick={() => handleOpen(item.id)}>
                        <ListItemAvatar>
                            <Avatar aria-label="recipe" className={classes[item.color]}>{item.name[0]}</Avatar>
                        </ListItemAvatar>
                        <ListItemText primary={item.name} secondary={item.number} />
                    </ListItem>
                    <Modal
                        className={classes.modal}
                        open={isOpen(item.id)}
                        onClose={handleClose}
                        closeAfterTransition
                        BackdropComponent={Backdrop}
                        BackdropProps={{ timeout: 500, }}
                        disableAutoFocus//POR ESSA EU MEREÇO UM PRÊMIO ERRO CHATO DA PORRA
                    >
                        <Slide in={isOpen(item.id)}
                            direction='up' mountOnEnter unmountOnExit>
                                <ContactItem item={item} />
                        </Slide>
                    </Modal>
                    <Divider />
                </div>
            )}
        </List>
    )
}


export default ContactItems