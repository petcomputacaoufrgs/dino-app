import React from 'react'
import './styles.css'
import DinoLogo from '../../assets/logos/dinosaur_1.svg'
import DinoHr from '../../components/dino_hr'
import DinoLogoHeaderProps from './props' 

const DinoLogoHeader = ({title, subtitle, size}: DinoLogoHeaderProps): JSX.Element => {
  return (
    <div className="dino_header">
      <img
        className="header__image"
        src={DinoLogo}
        alt="Logo DinoApp"
        width="20%"
        height="20%"
      ></img>
      { size === 'small' ? 
        <h5 className="header__title">{title}</h5>
        : <h3 className="header__title">{title}</h3>
      }
      {subtitle ?       
      <div className="typography muted">
        {subtitle}
      </div> : <></>}
      <DinoHr />
    </div>
  )
}
export default DinoLogoHeader