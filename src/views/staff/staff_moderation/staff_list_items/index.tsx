import { List } from '@material-ui/core'
import React, { useState } from 'react'
import AgreementDialog from '../../../../components/agreement_dialog'
import DinoDialog, { DinoDialogContent } from '../../../../components/dialogs/dino_dialog'
import ItemListMenu from '../../../../components/item_list_menu'
import ListTitle from '../../../../components/list_title'
import MuiSearchBar from '../../../../components/mui_search_bar'
import { useLanguage } from '../../../../context/language'
import StaffService from '../../../../services/staff/StaffService'
import StaffEntity from '../../../../types/staff/database/StaffEntity'
import StringUtils from '../../../../utils/StringUtils'
import EmailTextField from '../email_textfield'
import StaffCard from '../staff_card'
import StaffItem from './staff_list_item'
import './styles.css'

interface ListStaffProps {
  items: StaffEntity[],
} 

const ListStaff: React.FC<ListStaffProps> = ({ items }) => {

  const language = useLanguage()

  const [anchor, setAnchor] = React.useState<null | HTMLElement>(null)
  const [selectedItem, setSelectedItem] = useState<StaffEntity | undefined>(undefined)
  const [toView, setToView] = useState(false)
  const [toDelete, setToDelete] = useState(false)
  const [toEdit, setToEdit] = useState(false)
  const [error, setError] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  
  const closeEditDialog = () => setToEdit(false)

  const handleEdit = () => {
    if(selectedItem) {
      const isInvalid = !StringUtils.validateEmail(selectedItem.email)
      setError(isInvalid)
      if(!isInvalid) {
        StaffService.save(selectedItem)
        closeEditDialog()
        setSelectedItem(undefined)
      }
    }
  }

  const handleDelete = () => {
    if(selectedItem) {
      StaffService.delete(selectedItem)
      setSelectedItem(undefined)
    }
  }

  const handleClick = (item: StaffEntity) => {
    setSelectedItem(item)
    setToView(true)
  }

	const handleClickMenu = (event: React.MouseEvent<HTMLButtonElement>, item: StaffEntity) => {
		setAnchor(event.currentTarget)
    setSelectedItem(item)
	}

  const filteredData = items.filter(item => StringUtils.contains(item.email, searchTerm))

  return (
    <div>
      <MuiSearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value as string)}
      />
      <ListTitle title={language.data.STAFF}/>
      <List>
        {filteredData.map((item, index) => 
          <StaffItem 
            item={item} 
            key={index} 
            onClick={handleClick}
            onClickMenu={handleClickMenu} 
          />
        )}
      </List>
      <ItemListMenu
        anchor={anchor}
        setAnchor={setAnchor}
        onEdit={() => setToEdit(true)}
        onDelete={() => setToDelete(true)}
      />
      {selectedItem && 
        <>
          <DinoDialog 
            open={toEdit}
            onSave={handleEdit}
            onClose={closeEditDialog} 
          >
            <DinoDialogContent>
              <EmailTextField 
                value={selectedItem.email}
                handleChange={(value) => setSelectedItem({...selectedItem, email: value})}
                error={error}
              />
            </DinoDialogContent>
          </DinoDialog>
          <StaffCard 
            open={toView}
            item={selectedItem}
            onClose={() => setToView(false)}
            onEdit={() => setToEdit(true)}
            onDelete={() => setToDelete(true)}
          />
          <AgreementDialog
            open={toDelete}
            question={language.data.deleteItemText(language.data.STAFF)}
            onAgree={handleDelete}
            onDisagree={() => setToDelete(false)}
          />
        </>
      }
    </div>
  )
} 

export default ListStaff