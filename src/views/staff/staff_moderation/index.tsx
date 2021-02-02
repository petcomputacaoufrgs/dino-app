import { List } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../../context/language'
import { useAlert } from '../../../context/alert'
import { IsNotClient } from '../../../context/private_router'
import DinoTabPanel from '../../../components/tab_panel'
import StaffService from '../../../services/staff/StaffService'
import Loader from '../../../components/loader'
import StaffView from '../../../types/staff/view/StaffView'
import FormContent from '../../../components/dialogs/form_content'
import StringUtils from '../../../utils/StringUtils'
import ListTitle from '../../../components/list_title'
import ItemListMenu from '../../../components/item_list_menu'
import './styles.css'
import StaffItem from './staff_moderation_list_items/staff_moderation_list_item'

const StaffModeration: React.FC = () => {

  const language = useLanguage()
  const alert = useAlert()
  const isNotClient = IsNotClient()

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

    const handleEdit = () => {
      if(selectedItem !== undefined) {
        console.log(selectedItem)
        setSelectedItem(undefined)
      }
    }

    const handleDelete = () => {
      if(selectedItem !== undefined) {
        console.log(selectedItem)
        setSelectedItem(undefined)
      }
    }

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)
    const [selectedItem, setSelectedItem] = useState<StaffView | undefined>(undefined)

    return (
      <div>
        <Loader className='staff_loader' isLoading={isLoading}>
          <ListTitle title={language.data.STAFF}/>
          <List>
            {staff.map((e, index) => 
              <StaffItem 
                item={e} 
                key={index} 
                setSelected={setSelectedItem} 
                setAnchor={setAnchorEl}
              />
            )}
          </List>
        </Loader>
        <ItemListMenu
          anchor={anchorEl}
          setAnchor={setAnchorEl}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    )
  }
  const AddStaff = () => {
    return (
      <div className='add_staff'>
        <p className='add_staff__title'>Adicione Funcionários</p>
        <p>Funcionários são usuários com poderes adiministrativos de adicionar e blablabla. 
          Apenas a conta do <i>Client</i> original é capaz de adicionar e remover outros funcionários. 
          Para adicionar mais de um(a) funcionário(a), separe seus e-mails por vírgula</p>
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
          disabled={isNotClient}
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