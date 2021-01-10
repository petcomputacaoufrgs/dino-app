import ContactView from "../../../../types/contact/view/ContactView"

export default interface ContactMenuItemsProps {
  anchor: HTMLElement | null
  setAnchor: React.Dispatch<React.SetStateAction<HTMLElement | null>>
  item: ContactView
  onEdit: React.Dispatch<React.SetStateAction<ContactView | undefined>>
  onDelete: React.Dispatch<React.SetStateAction<ContactView | undefined>>
  onCloseDialog: () => void
}
