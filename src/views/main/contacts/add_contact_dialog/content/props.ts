export interface AddContactDialogContentProps {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  number: string
  setNumber: React.Dispatch<React.SetStateAction<string>>
  dialCode: string
  setDialCode: React.Dispatch<React.SetStateAction<string>>
  type: string
  setType: React.Dispatch<React.SetStateAction<string>>
  validName: boolean
  validNumber: boolean
}

export interface CountryTypeProps {
  name: string
  dial_code: string
  code: string
}
