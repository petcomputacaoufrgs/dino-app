import React from 'react'
import './styles.css'
import { ReactComponent as DinoLogoSVG } from '../../assets/logos/dinosaur_1.svg'
import PetLogo from '../../assets/logos/pet.png'
import HCLogo from '../../assets/logos/hc.png'
import UFRGSLogo from '../../assets/logos/ufrgs.png'

const Load: React.FC = () => {
  return (
    <div className="load">
      <DinoLogoSVG className="load__dino_logo" title="DinoApp" />
      <div className="load__dino_title">
        <h1>DinoApp</h1>
      </div>
      <div className="load__team">
        <img src={PetLogo} className="load__team__pet" alt="PET Computação" />
        <img
          src={HCLogo}
          className="load__team__hc"
          alt="Hospital de Clínicas"
        />
        <img
          className="load__team__ufrgs"
          src={UFRGSLogo}
          alt="UFRGS - Universidade Federal do Rio Grande do Sul"
        />
      </div>
    </div>
  )
}

export default Load
