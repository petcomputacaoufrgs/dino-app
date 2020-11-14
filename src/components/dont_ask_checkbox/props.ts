export default interface DontAskCheckbox {
  checked: boolean
  handleChecked: () => void
  label?: string
  labelPlacement?: "end" | "start" | "top" | "bottom"
}