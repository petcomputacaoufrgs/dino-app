import React from 'react';

import {useParams} from 'react-router-dom'

const GlossaryItem = () : JSX.Element => {     
  const {id} =  useParams() 

  return <div>{id}</div>
}

export default GlossaryItem