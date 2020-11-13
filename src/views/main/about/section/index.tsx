import React from 'react'
import SectionProps from './props'
import './styles.css'

const Section = ({ title,ImgSrc }: SectionProps): JSX.Element => {

  return (
    <div className='section'>
      <h5>{title}</h5>
        Cum exercitationem animi autem nihil reiciendis, molestias minima ratione ducimus!  
        Atque aliquid magni eligendi laboriosam laudantium ad illo unde quas in enim. 
      <img src={ImgSrc} alt={`Logo ${title}`} width='80%' height='80%'></img>	
        Dignissimos enim nemo eum sint fugiat eos eveniet minus, error sit blanditiis aperiam mollitia, voluptatibus reiciendis nesciunt exercitationem! Atque ullam eligendi a? 
        Reprehenderit cumque quasi illo dolorem maiores corrupti. Maiores similique at magnam repellat nulla omnis dolorem voluptatem molestias non illum ut odio, fugit adipisci harum doloremque incidunt inventore est. 
    </div>
  )
}

export default Section
