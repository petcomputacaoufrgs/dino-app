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
    { 
      title: "PET Computação", 
      img: PetLogo, 
      text: "{\t}O PET (Programa de Educação Tutorial) <p>Computação,</p> criado em 1988, \n é um grupo composto por estudantes de graduação dos cursos de Ciência da Computação e Engenharia da Computação. Coordenado pela professora Érika Cota, o projeto é formado por uma equipe diversa, voltada ao desenvolvimento individual de seus estudantes e também ao fortalecimento da comunidade acadêmica, tanto do Instituto de Informática, quanto externa e interPETs.\n\tO PET Computação é baseado na Tríade Acadêmica de Ensino, Pesquisa e Extensão, e tem como objetivo providenciar a oportunidade dos membros explorarem áreas de interesse além do currículo de seus cursos.\n\tOs projetos desenvolvidos pelo grupo abrangem o desenvolvimento de softwares e aplicações mobile; ministração de minicursos relacionados à computação; projetos de pesquisa e desenvolvimento de artigos acadêmicos; organização de eventos para a comunidade do Instituto, dentre outros. Também são realizados projetos em parceria com outros grupos PET da UFRGS (PETelos).\n\tO escritório fica localizado no campus do vale da UFRGS, no Instituto de Informática, prédio 43424 (antigo 72), sala 201 (segundo andar).",
    },
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
          <hr style={{margin:"10px 24px"}}/>
        </div>
        <div className="card__content" >
          <div className='card__typography'>
            { sections.map((section, index) => 
              <Section title={section.title} ImgSrc={section.img} text={section.text} key={index}/>)}
          </div>
        </div>
      </Paper>
    </div>
  )
}

export default AboutUs
