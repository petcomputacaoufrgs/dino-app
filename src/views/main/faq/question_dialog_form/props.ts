import FaqEntity from "../../../../types/faq/database/FaqEntity"

export default interface QuestionDialogFormProps {
  dialogOpen: boolean
  faq: FaqEntity
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>
}
