import React, { forwardRef } from 'react'
import { Avatar, CardContent, CardHeader, Dialog, ListItem, ListItemIcon, ListItemText } from '@material-ui/core'
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import TransitionSlide from '../../../../components/slide_transition'
import AvatarIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import StaffEntity from '../../../../types/staff/database/StaffEntity'
import { useLanguage } from '../../../../context/language'

interface StaffCardProps {
  open: boolean,
  item: StaffEntity,
  onClose: () => void,
  onEdit: () => void,
  onDelete: () => void,
}

const StaffCard: React.FC<StaffCardProps> = forwardRef(({ open, onClose, item, onEdit, onDelete }, ref: React.Ref<unknown>) => {
	
  const handleEdit = () => {
    onClose()
    onEdit()
  }

  const handleDelete = () => {
    onClose()
    onDelete()
  }

  const StaffCardHeader = () => {

    const language = useLanguage()

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
    }
    return (
      <>
        <CardHeader
          avatar={<Avatar><AvatarIcon /></Avatar>}
          action={<OptionsIconButton onClick={handleClick} />}
          title={item.name || language.data.MEMBER_OF_STAFF}
          subheader={item.sentInvitationDate.toDateString()}
        />
        <ItemListMenu
          anchor={anchorEl}
          setAnchor={setAnchorEl}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCloseDialog={onClose}
        />
      </>
    )
  }

  return (
    <Dialog
      ref={ref}
      open={open}
      fullWidth
      onClose={onClose}
      TransitionComponent={TransitionSlide}
    >
      <StaffCardHeader />
      <CardContent>
        <ListItem divider>
          <ListItemIcon><EmailIcon /></ListItemIcon>
          <ListItemText className='dino__text__wrap' primary={item.email}/>
        </ListItem>
      </CardContent>
    </Dialog>
  )
}
)

export default StaffCard
