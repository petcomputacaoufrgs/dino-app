import PhoneModel from '../../../../../services/contact/api_model/PhoneModel'

export interface ContactFormDialogContentProps {
  values: { 
    name: string, 
    description:string, 
    phones: PhoneModel[]
    addPhone: boolean,
    invalidName: boolean,
    helperText: {number:string, text: string} 
  }
  sets: { 
    setName: React.Dispatch<React.SetStateAction<string>>, 
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    setPhones: React.Dispatch<React.SetStateAction<PhoneModel[]>>,
    setAddPhone: React.Dispatch<React.SetStateAction<boolean>>,
  }
  handleDeletePhone: (number: string) => void
}
