import { Avatar, List, ListItem, ListItemAvatar, ListItemText, TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import Button from '../../../components/button'
import { useLanguage } from '../../../context/language'
import './styles.css'
import { ReactComponent as SaveSVG } from '../../../assets/icons/save.svg'
import DinoTabPanel from '../../../components/tab_panel'
import AvatarIcon from '@material-ui/icons/Person';
import StaffService from '../../../services/staff/StaffService'
import StaffEntity from '../../../types/staff/database/StaffEntity'
import Loader from '../../../components/loader'

const StaffModeration: React.FC = () => {

  const [staff, setStaff] = useState<StaffEntity[]>([])
	const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
		const loadData = async () => {
			const staff = await StaffService.getAll()
			updateData(staff)
			finishLoading()
		}

		let updateData = (staff: StaffEntity[]) => {
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

  const language = useLanguage()
  const [email, setEmail] = useState('')

  const handleAddEmail = () => {
    StaffService.save({ email, sentInvitationDate: new Date() })
    setEmail('')
  }


  const renderFormContent = () => {
    return (
    <div className='dialog_form__content'>
      <TextField
        required
        fullWidth
        value={email}
        onChange={e => setEmail(e.target.value as string)}
        margin='dense'
        id='email'
        label={language.data.FORM_EMAIL}
        type='email'
        multiline
        placeholder='Separe múltiplos e-mails por vírgula'
        inputProps={{ maxLength: 50 }}
        //error={isNameInvalid(props.name)}
      />
      <Button
        className='staff_moderation__save_button'
        onClick={handleAddEmail}
      >
        <SaveSVG className='staff_moderation__save_button__icon' />
        {language.data.FORM_ADD_STAFF}
      </Button>
    </div>
    )
  }

  const renderListContent = () => {

    return (
      <Loader className='staff_loader' isLoading={isLoading}>
        <List>
          {staff.map((e, index) => 
            <ListItem key={index}>
              <ListItemAvatar>
                <Avatar><AvatarIcon /></Avatar>
              </ListItemAvatar>
              <ListItemText primary={e.email} secondary={e.sentInvitationDate.toDateString()} />
            </ListItem>
          )}
        </List>
      </Loader>
    )
  }
  

  return (
    <div className='staff_moderation'>
      <DinoTabPanel panels={[
          { name: language.data.ADD_STAF_TAB, Component: renderFormContent()}, 
          { name: language.data.STAFF_LIST_TAB, Component: renderListContent()}
        ]} 
      />
    </div>
    )
}

export default StaffModeration