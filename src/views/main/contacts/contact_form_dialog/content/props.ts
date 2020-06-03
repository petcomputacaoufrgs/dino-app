export interface ContactFormDialogContentProps {
  name: string
  setName: React.Dispatch<React.SetStateAction<string>>
  number: string
  setNumber: React.Dispatch<React.SetStateAction<string>>
  dialCode: string
  setDialCode: React.Dispatch<React.SetStateAction<string>>
  type: number
  setType: React.Dispatch<React.SetStateAction<number>>
  validName: boolean
  validNumber: boolean
}

export interface CountryTypeProps {
  name: string
  dial_code: string
  code: string
}
