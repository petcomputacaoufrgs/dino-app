import React, { useEffect, useState } from 'react'
import { useLanguage } from '../../../context/language'
import { useAlert } from '../../../context/alert'
import { IsNotClient } from '../../../context/private_router'
import DinoTabPanel from '../../../components/tab_panel'
import StaffService from '../../../services/staff/StaffService'
import StringUtils from '../../../utils/StringUtils'
import './styles.css'
import StaffEntity from '../../../types/staff/database/StaffEntity'
import Button from '../../../components/button'
import EmailForm from './email_form'
import ListStaff from './staff_moderation_list_items'
import Loader from '../../../components/loader'

const StaffModeration: React.FC = () => {

  const language = useLanguage()
  const alert = useAlert()
  const isNotClient = IsNotClient()

  const [staff, setStaff] = useState<StaffEntity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [emailValue, setEmailValue] = useState('')
  const [error, setError] = useState(false)

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


  const handleAddEmail = () => {
    const email = emailValue.trim()
    const isInvalid = !StringUtils.validateEmail(email)
    setError(isInvalid)
    if(!isInvalid) {
      StaffService.save({ email, sentInvitationDate: new Date() })
      alert.showSuccessAlert(language.data.STAFF_SAVE_SUCCESS)
    }
  }

  const AddStaff = () => {

    return (
      <div className='add_staff'>
        <p className='add_staff__title'>Adicione Funcionários</p>
        <p>Funcionários são usuários com poderes adiministrativos de adicionar e blablabla. 
          Apenas a conta do <i>Client</i> original é capaz de adicionar e remover outros funcionários.</p>
        <div className='dialog_form__content'>
          <EmailForm 
            value={emailValue}
            handleChange={(value) => setEmailValue(value)}
            error={error}
          />
          <Button disabled={isNotClient} onClick={() => handleAddEmail}>
            {/* <SaveSVG className='save_button__icon' /> */}
            {language.data.SETTINGS_SAVE}
          </Button>
        </div>         
      </div>
    )
  }

  return (
    <div className='staff_moderation'>
      <DinoTabPanel panels={[
          { name: language.data.ADD_STAF_TAB, Component: <AddStaff /> },
          { name: language.data.STAFF_LIST_TAB, Component: 
            <Loader className='staff_loader' isLoading={isLoading}>
              <ListStaff items={staff} />
            </Loader> 
          }
        ]} 
      />
    </div>
    )
}

export default StaffModeration