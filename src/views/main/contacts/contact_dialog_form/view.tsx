import React from 'react'
import Button from '@material-ui/core/Button'
import {
  Dialog,
  DialogActions,
  DialogContent,
  Divider,
} from '@material-ui/core'
import ContactFormDialogHeader from './header'
import ContactFormDialogContent from './content'
import TransitionSlide from '../../../../components/slide_transition'
import { ContactFormDialogViewProps } from './props'
import { useLanguage } from '../../../../context_provider/app_settings'

const View = React.forwardRef(
  (
    {
      open,
      handleClose,
      action,
      name,
      phones,
      color,
      description,
      invalidName,
      invalidPhone,
      handleChangeColor,
      handleDeletePhone,
      handleChangeName,
      handleChangeDescription,
      handleChangeType,
      handleChangeNumber,
      handleAddPhone,
      handleSave,
    }: ContactFormDialogViewProps,
    ref: React.Ref<unknown>
  ): JSX.Element => {
    const language = useLanguage().current

    return (
      <Dialog
        ref={ref}
        open={open}
        fullWidth
        onClose={handleClose}
        TransitionComponent={TransitionSlide}
      >
        <ContactFormDialogHeader
          action={action}
          name={name}
          color={color}
          handleChangeColor={handleChangeColor}
          handleAddPhone={handleAddPhone}
        />
        <Divider />
        <DialogContent>
          <ContactFormDialogContent
            name={name}
            description={description}
            phones={phones}
            helperText={invalidPhone}
            invalidName={invalidName}
            handleChangeName={handleChangeName}
            handleChangeDescription={handleChangeDescription}
            handleChangeType={handleChangeType}
            handleChangeNumber={handleChangeNumber}
            handleDeletePhone={handleDeletePhone}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            {language.DIALOG_CANCEL_BUTTON_TEXT}
          </Button>

          <Button onClick={handleSave} color="primary">
            {language.DIALOG_SAVE_BUTTON_TEXT}
          </Button>
        </DialogActions>
      </Dialog>
    )
  }
)

export default View
