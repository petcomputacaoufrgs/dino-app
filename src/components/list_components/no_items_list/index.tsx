import React from 'react'
import { useLanguage } from '../../../context/language'

const NoItemsList = () => {

  const language = useLanguage()

  return (
    <div style={{"margin": "auto"}}>
      {language.data.NO_ITEMS_LIST}
    </div>
  )
}

export default NoItemsList