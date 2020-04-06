import React from 'react';
import {useParams} from 'react-router-dom'
import Glossary from '../../../views/glossary'

const GlossaryItem = () : JSX.Element => {     
  const {id} =  useParams()
  console.log(id)

  const cardInfo = Glossary.items.find(
     item =>item.id === Number(id)
     )
    
    
     //return <h6>{cardInfo.text_long}</h6>
  return cardInfo !== undefined ? <h6>{cardInfo.text_long}</h6> : <h1>Card Not Found</h1> 
  //return <h2>{id}</h2>
}

export default GlossaryItem