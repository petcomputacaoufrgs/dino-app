import FaqOptionsModel from "../../../../types/faq/FaqOptionsModel"

export default interface FaqOptionsProps {
  open: boolean
  handleChangeOpenDialog: () => void 
  checkboxAskAgain?: boolean
  //currentFaq?: FaqOptionsModel
} 