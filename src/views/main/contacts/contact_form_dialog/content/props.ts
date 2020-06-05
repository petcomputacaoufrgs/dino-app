export interface ContactFormDialogContentProps {
  open: boolean
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  description: string
  setDescription: React.Dispatch<React.SetStateAction<string>>
  number: string
  setNumber: React.Dispatch<React.SetStateAction<string>>
  type: number
  setType: React.Dispatch<React.SetStateAction<number>>
  addPhoneAction: boolean
  secNumber: string
  setSecNumber: React.Dispatch<React.SetStateAction<string>>
  secType: number
  setSecType: React.Dispatch<React.SetStateAction<number>>
  validName: boolean
  validNumber: boolean
}
