import ContactModel from '../../../../types/contact/ContactModel'

export default interface ContactItemsProps {
  items: Array<ContactModel>
  setItems: React.Dispatch<React.SetStateAction<ContactModel[]>>
}
