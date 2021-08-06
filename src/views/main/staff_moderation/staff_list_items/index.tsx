import { List } from '@material-ui/core'
import React, { useState } from 'react'
import AgreementDialog from '../../../../components/dialogs/agreement_dialog'
import DinoDialog, {
	DinoDialogContent,
} from '../../../../components/dialogs/dino_dialog'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import ListTitle from '../../../../components/list_components/list_title'
import NoItemsList from '../../../../components/list_components/no_items_list'
import DinoSearchBar from '../../../../components/search_bar'
import { useAlert } from '../../../../context/alert'
import { useLanguage } from '../../../../context/language'
import { IsNotClient } from '../../../../context/private_router'
import StaffService from '../../../../services/staff/StaffService'
import CRUDEnum from '../../../../types/enum/CRUDEnum'
import StaffEntity from '../../../../types/staff/database/StaffEntity'
import ArrayUtils from '../../../../utils/ArrayUtils'
import StringUtils from '../../../../utils/StringUtils'
import EmailTextField from '../email_textfield'
import StaffCard from '../staff_card'
import StaffItem from './staff_list_item'
import './styles.css'

interface ListStaffProps {
	items: StaffEntity[]
}

const ListStaff: React.FC<ListStaffProps> = ({ items }) => {
	const language = useLanguage()
	const alert = useAlert()
	const isNotClient = IsNotClient()

	const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)
	const [selectedItem, setSelectedItem] = useState<StaffEntity | undefined>(
		undefined,
	)
	const [toAction, setToAction] = useState(CRUDEnum.NOP)
	const [error, setError] = useState<string>()
	const [searchTerm, setSearchTerm] = useState('')

	const handleCloseDialog = () => setToAction(CRUDEnum.NOP)

	const handleEdit = async () => {
		if (selectedItem) {
			const email = selectedItem.email.trim()

			const isInvalid = await StaffService.isEmailInvalid(email, language.data)

			setError(isInvalid)

			if (!isInvalid) {
				StaffService.save(selectedItem)
				alert.showSuccessAlert(language.data.STAFF_SAVE_SUCCESS)
				handleCloseDialog()
				setSelectedItem(undefined)
			}
		}
	}

	const handleDelete = () => {
		if (selectedItem) {
			StaffService.delete(selectedItem)
			setSelectedItem(undefined)
		}
	}

	const handleClick = (item: StaffEntity) => {
		setSelectedItem(item)
		setToAction(CRUDEnum.READ)
	}

	const handleClickMenu = (
		event: React.MouseEvent<HTMLButtonElement>,
		item: StaffEntity,
	) => {
		setAnchor(event.currentTarget)
		setSelectedItem(item)
	}

	const filteredData = items.filter(item =>
		StringUtils.contains(item.email, searchTerm),
	)

	return (
		<div>
			<DinoSearchBar
				value={searchTerm}
				onChange={e => setSearchTerm(e.target.value as string)}
			/>
			<ListTitle title={language.data.STAFF} />
			{ArrayUtils.isNotEmpty(filteredData) ? (
				<List>
					{filteredData.map((item, index) => (
						<StaffItem
							item={item}
							key={index}
							onClick={handleClick}
							onClickMenu={handleClickMenu}
						/>
					))}
				</List>
			) : (
				<NoItemsList />
			)}
			<ItemListMenu
				anchor={anchor}
				setAnchor={setAnchor}
				onEdit={() => setToAction(CRUDEnum.UPDATE)}
				onDelete={() => setToAction(CRUDEnum.DELETE)}
				disable={isNotClient || selectedItem?.userId !== undefined}
			/>
			{selectedItem && (
				<>
					<DinoDialog
						open={toAction === CRUDEnum.UPDATE}
						onSave={handleEdit}
						onClose={handleCloseDialog}
					>
						<DinoDialogContent>
							<EmailTextField
								value={selectedItem.email}
								handleChange={value =>
									setSelectedItem({ ...selectedItem, email: value })
								}
								error={error}
							/>
						</DinoDialogContent>
					</DinoDialog>
					<StaffCard
						open={toAction === CRUDEnum.READ}
						item={selectedItem}
						onClose={handleCloseDialog}
						onEdit={() => setToAction(CRUDEnum.UPDATE)}
						onDelete={() => setToAction(CRUDEnum.DELETE)}
					/>
					<AgreementDialog
						open={toAction === CRUDEnum.DELETE}
						question={language.data.deleteItemText(language.data.STAFF)}
						onAgree={handleDelete}
						onDisagree={handleCloseDialog}
					/>
				</>
			)}
		</div>
	)
}

export default ListStaff
