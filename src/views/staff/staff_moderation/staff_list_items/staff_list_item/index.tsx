import { Avatar, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core'
import React from 'react'
import AvatarIcon from '@material-ui/icons/Person';
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import { useLanguage } from '../../../../../context/language'
import StaffEntity from '../../../../../types/staff/database/StaffEntity'

interface StaffItemProps {
  item: StaffEntity, 
  setSelected: (value: StaffEntity) => void,
  setAnchor: (value: React.SetStateAction<HTMLElement | null>) => void,
}

const StaffItem: React.FC<StaffItemProps> = ({ item, setAnchor, setSelected }) => {

  const language = useLanguage()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget)
    setSelected(item)
  }

  const invitationIsPending = item.userId === undefined
  
  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar><AvatarIcon /></Avatar>
      </ListItemAvatar>
      <ListItemText 
        primary={item.email} 
        secondary={
          <Typography component={'span'} variant={'body2'}>
            {item.sentInvitationDate.toDateString()}
            {invitationIsPending && (<p className='invitation_pending'>{language.data.PENDING}</p>)}
          </Typography>
        }>
      </ListItemText>
      <ListItemSecondaryAction>
        <OptionsIconButton dark onClick={handleClick} />
      </ListItemSecondaryAction>
    </ListItem>
  )
}

export default StaffItem