import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../../context/language'
import './styles.css'
import DinoTabPanel from '../../../components/tab_panel'
import AvatarIcon from '@material-ui/icons/Person';
import StaffService from '../../../services/staff/StaffService'
import Loader from '../../../components/loader'
import StaffView from '../../../types/staff/view/StaffView'
import FormContent from './form_content'

const StaffModeration: React.FC = () => {

  const language = useLanguage()
  const [staff, setStaff] = useState<StaffView[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [email, setEmail] = useState('')

  useEffect(() => {
		const loadData = async () => {
			const staff = await StaffService.getAll()
			updateData(staff.map(e => { 
        return { 
          email: e.email,
          name: undefined,
          sentInvitationDate: e.sentInvitationDate,
          acceptedInvitation: e.userId !== undefined  
        }}))

			finishLoading()
		}

		let updateData = (staff: StaffView[]) => {
			setStaff(staff)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		StaffService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateData = () => {}
			finishLoading = () => {}
			StaffService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])



  const handleAddEmail = () => {
    StaffService.save({ email, sentInvitationDate: new Date() })
    setEmail('')
  }

  const ListContent = () => {
    return (
      <Loader className='staff_loader' isLoading={isLoading}>
        <List>
          {staff.map((e, index) => 
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar><AvatarIcon /></Avatar>
              </ListItemAvatar>
              <ListItemText 
                primary={e.email} 
                secondary={
                  <Typography component={'span'} variant={'body2'}>
                    {e.sentInvitationDate.toDateString()}
                    {!e.acceptedInvitation && (<p className='invitation_pending'>Pendente</p>)}
                  </Typography>
                }>
              </ListItemText>
            </ListItem>
          )}
        </List>
      </Loader>
    )
  }
  

  return (
    <div className='staff_moderation'>
      <DinoTabPanel panels={[
          { name: language.data.ADD_STAF_TAB, Component: 
            <FormContent value={email} setValue={setEmail} handleAdd={handleAddEmail} />}, 
          { name: language.data.STAFF_LIST_TAB, Component: <ListContent />}
        ]} 
      />
    </div>
    )
}

export default StaffModeration