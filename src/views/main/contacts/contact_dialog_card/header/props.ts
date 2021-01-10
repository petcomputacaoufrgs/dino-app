import ContactView from '../../../../../types/contact/view/ContactView'

export default interface ContactCardHeaderProps {
  item: ContactView
  onClick: (event: React.MouseEvent<HTMLButtonElement>) => void
}
