import React from 'react'
import SectionProps from './props'
import './styles.css'

const Section = ({ title, ImgSrc, text, footnote }: SectionProps): JSX.Element => {

  return (
    <div className='section'>
      <h4 className='section__title'>{title}</h4>
        <div className='section__text'>
          {text || `\tCum exercitationem animi autem nihil reiciendis, molestias minima ratione ducimus!  Atque aliquid magni eligendi laboriosam laudantium ad illo unde quas in enim. \n\tDignissimos enim nemo eum sint fugiat eos eveniet minus, error sit blanditiis aperiam mollitia, voluptatibus reiciendis nesciunt exercitationem! Atque ullam eligendi a? \n\tReprehenderit cumque quasi illo dolorem maiores corrupti. \n\tMaiores similique at magnam repellat nulla omnis dolorem voluptatem molestias non illum ut odio, fugit adipisci harum doloremque incidunt inventore est.`}
          <img className='section__image' src={ImgSrc} alt={`Logo ${title}`} width='80%' height='80%'></img>
          <div className='section__footnote'>{footnote}</div>	
        </div>
    </div>
  )
}

export default Section
