import ContactView from '../../../../types/contact/view/ContactView'
import EssentialContactView from '../../../../types/contact/view/EssentialContactView'

export default interface ContactItemListProps {
	item: ContactView | EssentialContactView
	onClick: (item: ContactView) => void
  onClickMenu: (event: React.MouseEvent<HTMLButtonElement>, item: ContactView) => void
}
