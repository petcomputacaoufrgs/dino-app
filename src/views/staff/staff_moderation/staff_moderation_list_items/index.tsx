import { List } from '@material-ui/core'
import React, { useState } from 'react'
import AgreementDialog from '../../../../components/agreement_dialog'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import ItemListMenu from '../../../../components/item_list_menu'
import ListTitle from '../../../../components/list_title'
import { useAlert } from '../../../../context/alert'
import { useLanguage } from '../../../../context/language'
import StaffService from '../../../../services/staff/StaffService'
import StaffEntity from '../../../../types/staff/database/StaffEntity'
import StringUtils from '../../../../utils/StringUtils'
import EmailForm from '../email_form'
import StaffItem from './staff_moderation_list_item'

interface ListStaffProps {
  items: StaffEntity[],
} 

const ListStaff: React.FC<ListStaffProps> = ({ items }) => {

  const language = useLanguage()
  const alert = useAlert()

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
  const [selectedItem, setSelectedItem] = useState<StaffEntity | undefined>(undefined)
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)
  const [openEditDialog, setOpenEditDialog] = useState(false)
  const [error, setError] = useState(false)
  
  const closeEditDialog = () => setOpenEditDialog(false)

  const handleEdit = () => {
    if(selectedItem !== undefined) {
      const isInvalid = !StringUtils.validateEmail(selectedItem.email)
      setError(isInvalid)
      if(!isInvalid) {
        StaffService.save(selectedItem)
        alert.showSuccessAlert(language.data.STAFF_SAVE_SUCCESS)
        closeEditDialog()
        setSelectedItem(undefined)
      }
    }
  }

  const handleDelete = () => {
    if(selectedItem !== undefined) {
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
        onEdit={() => setOpenEditDialog(true)}
        onDelete={() => setOpenDeleteDialog(true)}
      />
      {selectedItem !== undefined && 
        <DinoDialog 
          open={openEditDialog}
          handleSave={handleEdit}
          handleClose={closeEditDialog} 
        >
          <EmailForm 
            value={selectedItem.email}
            handleChange={(value) => setSelectedItem({...selectedItem, email: value})}
            error={error}
          />
        </DinoDialog>
      }
      <AgreementDialog
        open={openDeleteDialog}
        description={language.data.DELETE_CONTACT_OPTION_TEXT}
        question={language.data.DELETE_CONTACT_QUESTION}
        onAgree={handleDelete}
        onDisagree={() => setOpenDeleteDialog(false)}
      />
    </div>
  )
} 

export default ListStaff