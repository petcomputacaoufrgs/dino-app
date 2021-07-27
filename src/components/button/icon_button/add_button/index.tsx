import React from 'react'
import { useLanguage } from '../../../../context/language'
import { ReactComponent as AddIconSVG } from '../../../../assets/icons/general_use/add.svg'
import './styles.css'
import DinoIconButton from '..'

interface AddButtonProps {
  handleAdd: () => void,
  label?: string
}

const AddButton: React.FC<AddButtonProps> = ({ handleAdd, label }) => {

  const language = useLanguage()
  
  return (
    <DinoIconButton
      ariaLabel={`${language.data.ADD} ${label}`}
      className='add_button'
      icon={AddIconSVG}
      onClick={handleAdd}
      circular
    />
  )
}

export default AddButton
