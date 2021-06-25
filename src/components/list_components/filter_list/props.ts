export default interface DinoFilterListProps {
  filters: {
    checked: boolean,
    label: string
  }[],
  onChangeChecked: (index: number) => void,
}