import React, { useState } from 'react';
import { useLanguage } from '../../../../provider/app_provider'
import Button from '@material-ui/core/Button';
import { Dialog, DialogActions, DialogContent, Divider } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Slide } from '@material-ui/core'
import AddContactDialogHeader from './header/'
import AddContactDialogContent from './content/'



const TransitionSlide = React.forwardRef(function Transition(
    props: TransitionProps & { children?: React.ReactElement },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} mountOnEnter unmountOnExit {...props} />;
})


const AddContactDialog = (props: {
    dialogOpen: boolean,
    setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}): JSX.Element => {

    const language = useLanguage().current

    const [name, setName] = useState('')
    const [number, setNumber] = useState('')
    const [type, setType] = useState(language.CONTACTS_MOBILE_PHONE)
    const [color, setColor] = useState('')

    const handleClose = () => {
        props.setDialogOpen(false)
    }
    const handleAdd = () => {
        console.log(name, type, number, color)
        handleClose()
    }

    return (

        <Dialog
            TransitionComponent={TransitionSlide}
            open={props.dialogOpen}
            aria-labelledby="form-dialog-title">
            <AddContactDialogHeader
                name={name}
                type={type}
                color={color}
                setColor={setColor}
            />
            <Divider />
            <DialogContent>
                <AddContactDialogContent
                    name={name}
                    setName={setName}
                    number={number}
                    setNumber={setNumber}
                    type={type}
                    setType={setType}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="primary">{language.CANCEL_OPTION_TEXT}</Button>
                <Button onClick={handleAdd} color="primary">{language.ADD_OPTION_TEXT}</Button>
            </DialogActions>
        </Dialog>
    )
}


export default AddContactDialog