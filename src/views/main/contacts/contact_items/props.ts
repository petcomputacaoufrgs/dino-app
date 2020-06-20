import ContactModel from '../../../../services/contact/api_model/ContactModel'

export default interface ContactItemsProps {
  items: Array<ContactModel>
  setItems: React.Dispatch<React.SetStateAction<ContactModel[]>>
}
