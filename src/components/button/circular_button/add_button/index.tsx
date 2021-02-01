import React from 'react'
import { useLanguage } from '../../../../context/language'
import { ReactComponent as AddIconSVG } from '../../../../assets/icons/add.svg'
import CircularButton from '..'
import './styles.css'

interface AddButtonProps {
  handleAdd: () => void,
  label?: string

}

const AddButton: React.FC<AddButtonProps> = ({ handleAdd, label }) => {

  const language = useLanguage()
  
  return (
    <CircularButton
      ariaLabel={language.data.ADD_OPTION_TEXT + label}
      className='add_button'
      icon={AddIconSVG}
      onClick={handleAdd}
    />
  )
}

export default AddButton
