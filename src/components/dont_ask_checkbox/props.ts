export default interface DontAskCheckboxFormProps {
  children: JSX.Element | JSX.Element[]
  labelPlacement?: "end" | "start" | "top" | "bottom"
  dontAskOption?: boolean
  dontAskChecked?:boolean
  handleDontAskChecked?: () => void
}