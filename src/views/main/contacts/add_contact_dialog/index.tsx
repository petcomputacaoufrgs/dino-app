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
    const [dialCode, setDialCode] = useState("+55")
    const [number, setNumber] = useState('')
    const [type, setType] = useState(language.CONTACTS_MOBILE_PHONE)
    const [color, setColor] = useState('')
    const [validName, setValidName] = useState(true)
    const [validNumber, setValidNumber] = useState(true)

    const validInfo = (): boolean => {
        setValidName(name !== '')
        setValidNumber(number !== '')
        return name !== '' && number !== ''
    }

    const cleanInfo = () => {
        setName('')
        setNumber('')
        setType(language.CONTACTS_MOBILE_PHONE)
        setColor('')
        setValidName(true)
        setValidNumber(true)
    }


    const handleClose = () => {
        props.setDialogOpen(false)
    }
    const handleCancel = () => {
        props.setDialogOpen(false)
        cleanInfo()
    }
    const handleAdd = () => {
        if (validInfo()) {
            console.log(name, type, dialCode, number, color)
            handleClose()
            cleanInfo()
        }
    }

    return (

        <Dialog
            fullWidth
            maxWidth='xs'
            onClose={handleClose}
            TransitionComponent={TransitionSlide}
            open={props.dialogOpen}
            aria-labelledby="form-dialog">
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
                    dialCode={dialCode}
                    setDialCode={setDialCode}
                    type={type}
                    setType={setType}
                    validName={validName}
                    validNumber={validNumber}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCancel} color="primary">{language.CANCEL_OPTION_TEXT}</Button>
                <Button onClick={handleAdd} color="primary">{language.ADD_OPTION_TEXT}</Button>
            </DialogActions>
        </Dialog>
    )
}


export default AddContactDialog