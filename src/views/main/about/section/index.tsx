import React from 'react'
import SectionProps from './props'
import './styles.css'

const Section = ({ title, ImgSrc, text }: SectionProps): JSX.Element => {

  return (
    <div className='section'>
      <h4>{title}</h4>
        {
          text || `Cum exercitationem animi autem nihil reiciendis, molestias minima ratione ducimus!  
          Atque aliquid magni eligendi laboriosam laudantium ad illo unde quas in enim. 
          Dignissimos enim nemo eum sint fugiat eos eveniet minus, error sit blanditiis aperiam mollitia, voluptatibus reiciendis nesciunt exercitationem! Atque ullam eligendi a? 
          Reprehenderit cumque quasi illo dolorem maiores corrupti. Maiores similique at magnam repellat nulla omnis dolorem voluptatem molestias non illum ut odio, fugit adipisci harum doloremque incidunt inventore est.`
        }
        <img className='section__image' src={ImgSrc} alt={`Logo ${title}`} width='80%' height='80%'></img>
        <div className='section__footnote'>
          Instituto de Informática - UFRGS
          <br/>
          Av. Bento Gonçalves, 9500
          <br/>
          Campus do Vale - Prédio 43424
          <br/>2° Pavimento - Sala 201
        </div>	
    </div>
  )
}

export default Section
