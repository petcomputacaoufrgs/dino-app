import React, { useState } from 'react'
import Button from '../../../../components/button'
import { useAlert } from '../../../../context/alert'
import { useLanguage } from '../../../../context/language'
import { IsNotClient } from '../../../../context/private_router'
import StaffService from '../../../../services/staff/StaffService'
import StringUtils from '../../../../utils/StringUtils'
import EmailTextField from '../email_textfield'
import { ReactComponent as SaveSVG } from '../../../../assets/icons/save.svg'
import './styles.css'

const AddStaffForm = () => {

  const [emailValue, setEmailValue] = useState('')
  const [error, setError] = useState(false)
  const isNotClient = IsNotClient()
  const alert = useAlert()
  const language = useLanguage()

  const handleAddEmail = () => {
    const email = emailValue.trim()
    const isInvalid = !StringUtils.validateEmail(email)
    setError(isInvalid)
    if(!isInvalid) {
      StaffService.save({ email, sentInvitationDate: new Date() })
      alert.showSuccessAlert(language.data.STAFF_SAVE_SUCCESS)
    }
  }
  
  return (
    <div className='add_staff'>
      <p className='add_staff__title'>Adicione Funcionários</p>
      <p>Funcionários são usuários com poderes adiministrativos de adicionar e blablabla. 
        Apenas a conta do <i>Client</i> original é capaz de adicionar e remover outros funcionários.</p>
      <div className='dialog_form__content'>
        <EmailTextField 
          value={emailValue}
          handleChange={(value) => setEmailValue(value)}
          error={error}
        />
        <Button disabled={isNotClient} onClick={handleAddEmail} className='save_button'>
          <SaveSVG className='save_button__icon' />
          {language.data.FORM_ADD_STAFF}
        </Button>
      </div>         
    </div>
  )
}

export default AddStaffForm