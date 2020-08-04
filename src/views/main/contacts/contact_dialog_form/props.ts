import ContactModel from '../../../../types/contact/ContactModel'
import PhoneModel from '../../../../types/contact/PhoneModel'


export interface ContactFormDialogProps {
  dialogOpen: boolean
  setDialogOpen: React.Dispatch<React.SetStateAction<number>>
  action: number
  item?: ContactModel
}

export interface ContactFormDialogViewProps {
  open: boolean, 
  handleClose: () => void,
  action: number,
  name: string,
  description: string,
  phones: PhoneModel[],
  color: string,
  invalidName: boolean,
  invalidPhone: {
    number: string;
    text: string;
  },
  handleChangeName: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleChangeDescription: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleChangeType: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void,
  handleChangeNumber: (event: React.ChangeEvent<HTMLInputElement>, index: number) => void,
  handleChangeColor: () => void,
  handleAddPhone: () => void,
  handleDeletePhone: (number: string) => void,
  handleSave: () => void
  
}
