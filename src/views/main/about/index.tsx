import React from 'react'
//import { useCurrentLanguage } from '../../../context_provider/app_settings'
import { Paper } from '@material-ui/core'
import './styles.css'
import PetLogo from '../../../assets/logos/pet.png'
import HCLogo from '../../../assets/logos/hc.png'
import UfrgsLogo from '../../../assets/logos/ufrgs.png'
import Section from './section'

const AboutUs = (): JSX.Element => {

  //const language = useCurrentLanguage()
  const sections = [
    { title: "PET Computação", img: PetLogo,},
    { title: "Hospital de Clínicas", img: HCLogo,},
    { title: "UFRGS", img: UfrgsLogo,},
  ]

  return (
    <div className="about-us">
      <Paper elevation={5}>
        <div className="card__header" >
          <h3 className='card__header__title'>
            Sobre Nós
          </h3>
          <div className='card__typography muted'>
            Lorem ipsum dolor sit amet
          </div>
          <hr style={{margin:"10px 24"}}/>
        </div>
        <div className="card__content" >
          <div className='card__typography'>
            { sections.map((section, index) => 
              <Section title={section.title} ImgSrc={section.img} key={index}/>)}
          </div>
        </div>
      </Paper>
    </div>
  )
}

export default AboutUs
