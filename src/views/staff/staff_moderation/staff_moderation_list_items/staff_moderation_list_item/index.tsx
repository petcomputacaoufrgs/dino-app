import { Avatar, List, ListItem, ListItemAvatar, ListItemSecondaryAction, ListItemText, Typography } from '@material-ui/core'
import React from 'react'
import AvatarIcon from '@material-ui/icons/Person';
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import StaffView from '../../../../../types/staff/view/StaffView'
import { useLanguage } from '../../../../../context/language'

interface StaffItemProps {
  item: StaffView, 
  setSelected: (value: StaffView) => void,
  setAnchor: (value: React.SetStateAction<HTMLElement | null>) => void,
}

const StaffItem: React.FC<StaffItemProps> = ({ item, setAnchor, setSelected }) => {

  const language = useLanguage()

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchor(event.currentTarget)
    setSelected(item)
  }
  
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
            {!item.acceptedInvitation && (<p className='invitation_pending'>{language.data.PENDING}</p>)}
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