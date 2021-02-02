import ContactView from '../../../../types/contact/view/ContactView'

export default interface ContactItemListProps {
	item: ContactView
	onClick: () => void
	setSelected: (value: ContactView) => void,
  setAnchor: (value: React.SetStateAction<HTMLElement | null>) => void,
}
