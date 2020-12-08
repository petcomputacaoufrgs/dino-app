export default interface SwitchProps {
  selected: boolean
  setSelected: React.Dispatch<React.SetStateAction<boolean>>
  label: string
}