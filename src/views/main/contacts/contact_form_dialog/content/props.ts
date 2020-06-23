export interface ContactFormDialogContentProps {
  values: { 
    name: string, 
    description:string, 
    number: string
    type: number
    addPhone: boolean
    secNumber: string
    secType: number
    invalidName: boolean
    invalidNumber: string
    helperText: string 
  }
  sets: { 
    setName: React.Dispatch<React.SetStateAction<string>>, 
    setDescription: React.Dispatch<React.SetStateAction<string>>,
    setNumber: React.Dispatch<React.SetStateAction<string>>,
    setType: React.Dispatch<React.SetStateAction<number>>,
    setSecNumber: React.Dispatch<React.SetStateAction<string>>,
    setSecType: React.Dispatch<React.SetStateAction<number>>,
  }
}
