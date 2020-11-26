import React from 'react'
import { Fab } from '@material-ui/core'
import AddIcon from '@material-ui/icons/Add'
import './styles.css'
import { useCurrentLanguage } from '../../context/provider/app_settings'

const ButtonAdd = (props: { onClick: () => void }): JSX.Element => {
  const language = useCurrentLanguage()

  return (
    <div>
      <Fab
        onClick={props.onClick}
        className="button-add"
        aria-label={language.ADD_BUTTON}
      >
        <AddIcon />
      </Fab>
    </div>
  )
}

export default ButtonAdd
