import ContactItemModel from '../../../../services/contact/api_model/ContactModel'

export default interface ContactItemListProps {
  item: ContactItemModel
  setEdit: React.Dispatch<React.SetStateAction<number>>
  setDelete: React.Dispatch<React.SetStateAction<number>>
  onClick: (id: number) => void
  children?: JSX.Element | Array<JSX.Element>
}
