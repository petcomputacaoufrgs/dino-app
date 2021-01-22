import React from 'react'
import { useLanguage } from '../../context/language'
import { ReactComponent as EngDinoSVG} from '../../assets/icons/dino/eng_dino.svg'
import Button from '../../components/button'
import TabControlService from '../../services/tab_control/TabControlService'
import './styles.css'

const SecondaryTab: React.FC = () => {
  const language = useLanguage()
  
  const handleChangeToMainTab = () => {
    TabControlService.changeToMainTab()
  }

  return (
    <div className='secondary_tab'>
      <div className='secondary_tab__message'>
        <EngDinoSVG />
        <p>{language.data.SECONDARY_TAB_MESSAGE}</p>
      </div>
      <Button onClick={handleChangeToMainTab}>{language.data.SECONDARY_TAB_BUTTON_TEXT}</Button>
    </div>
  )
}

export default SecondaryTab