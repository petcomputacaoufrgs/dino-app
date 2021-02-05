import { List } from '@material-ui/core'
import React, { useState } from 'react'
import AgreementDialog from '../../../../components/agreement_dialog'
import DinoDialog, { DinoDialogContent } from '../../../../components/dialogs/dino_dialog'
import ItemListMenu from '../../../../components/item_list_menu'
import ListTitle from '../../../../components/list_title'
import { useLanguage } from '../../../../context/language'
import StaffService from '../../../../services/staff/StaffService'
import StaffEntity from '../../../../types/staff/database/StaffEntity'
import StringUtils from '../../../../utils/StringUtils'
import EmailTextField from '../email_textfield'
import StaffItem from './staff_list_item'
import './styles.css'

interface ListStaffProps {
  items: StaffEntity[],
} 

const ListStaff: React.FC<ListStaffProps> = ({ items }) => {

  const language = useLanguage()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedItem, setSelectedItem] = useState<StaffEntity | undefined>(undefined)
  const [toDelete, setToDelete] = useState(false)
  const [toEdit, setToEdit] = useState(false)
  const [error, setError] = useState(false)
  
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

  return (
    <div>
        <ListTitle title={language.data.STAFF}/>
        <List>
          {items.map((item, index) => 
            <StaffItem 
              item={item} 
              key={index} 
              setSelected={setSelectedItem} 
              setAnchor={setAnchorEl}
            />
          )}
        </List>
      <ItemListMenu
        anchor={anchorEl}
        setAnchor={setAnchorEl}
        onEdit={() => setToEdit(true)}
        onDelete={() => setToDelete(true)}
      />
      {selectedItem && 
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
      }
      <AgreementDialog
        open={toDelete}
        description={language.data.DELETE_CONTACT_OPTION_TEXT}
        question={language.data.DELETE_CONTACT_QUESTION}
        onAgree={handleDelete}
        onDisagree={() => setToDelete(false)}
      />
    </div>
  )
} 

export default ListStaff