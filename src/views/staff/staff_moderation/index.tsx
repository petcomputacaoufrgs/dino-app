import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Typography } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../../context/language'
import './styles.css'
import DinoTabPanel from '../../../components/tab_panel'
import AvatarIcon from '@material-ui/icons/Person';
import StaffService from '../../../services/staff/StaffService'
import Loader from '../../../components/loader'
import StaffView from '../../../types/staff/view/StaffView'
import FormContent from '../../../components/dialogs/form_content'
import StringUtils from '../../../utils/StringUtils'
import { useAlert } from '../../../context/alert'
import ListTitle from '../../../components/list_title'

const StaffModeration: React.FC = () => {

  const language = useLanguage()
  const alert = useAlert()

  const [staff, setStaff] = useState<StaffView[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [invalidValue, setInvalidValue] = useState('')

  useEffect(() => {
		const loadData = async () => {
			const staff = await StaffService.getAll()
			updateData(staff.map(e => { 
        return { 
          email: e.email,
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


  const handleSaveEmail = (value: string) => {
    const emails = value.split(',')
    const areInvalid = emails.some(e => !StringUtils.validateEmail(e.trim()))

    if(areInvalid) {
      setInvalidValue(value)
    } else {
      setInvalidValue('')
      StaffService.saveAll(emails.map(e => { 
        return { email: e, sentInvitationDate: new Date() }
      }))
      alert.showSuccessAlert(language.data.STAFF_SAVE_SUCCESS)
    }
  }

  const ListStaff = () => {
    return (
      <Loader className='staff_loader' isLoading={isLoading}>
        <ListTitle title={'Mods'}/>
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
                    {!e.acceptedInvitation && (<p className='invitation_pending'>{language.data.PENDING}</p>)}
                  </Typography>
                }>
              </ListItemText>
            </ListItem>
          )}
        </List>
      </Loader>
    )
  }
  const AddStaff = () => {
    return (
      <div className='add_staff'>
        <p className='add_staff__title'>Adicione Funcionários</p>
        <p>Funcionários são usuários com poderes adiministrativos de adicionar e blablabla</p>
        <p>Para adicionar mais de um(a) funcionário(a), separe seus e-mails por vírgula</p>
        <FormContent
          required
          multiline
          handleSave={handleSaveEmail}
          invalidValue={invalidValue}
          helperText={invalidValue && 'E-mail inválido'}
          type='email'
          margin='dense'
          placeholder='Separe e-mails por vírgula'
          inputProps={{ maxLength: 1000 }}
          label={language.data.FORM_EMAIL}
          saveButtonText={language.data.FORM_ADD_STAFF}
        />         
      </div>
    )
  }
  

  return (
    <div className='staff_moderation'>
      <DinoTabPanel panels={[
          { name: language.data.ADD_STAF_TAB, Component: <AddStaff/> },
          { name: language.data.STAFF_LIST_TAB, Component: <ListStaff/> }
        ]} 
      />
    </div>
    )
}

export default StaffModeration