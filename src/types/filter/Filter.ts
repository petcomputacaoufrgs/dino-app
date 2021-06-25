export default interface FilterType {
  checked: boolean,
  label: string,
  validator: (t: any) => boolean
}