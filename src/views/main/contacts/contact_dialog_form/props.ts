import ContactModel from '../../../../types/contact/ContactModel'
import PhoneModel from '../../../../types/contact/PhoneModel'


export interface ContactFormDialogProps {
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<number>>
  action: number
  item?: ContactModel
}

export interface ContactFormDialogViewProps {
  ref: React.Ref<unknown>, 
  open: boolean, 
  handleClose: () => void,
  action: number,
  name: string,
  description: string,
  color: string,
  phones: PhoneModel[],
  handleChangeColor: () => void,
  invalidName,
  invalidPhone,
  handleDeletePhone,
  handleChangeName,
  handleChangeDescription,
  handleChangeType,
  handleChangeNumber,
  handleAddPhone,
  handleSave
  
}
