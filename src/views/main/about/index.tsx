import React from 'react'
import { Paper } from '@material-ui/core'
import './styles.css'
import PetLogo from '../../../assets/logos/pet.png'
import HCLogo from '../../../assets/logos/hc.png'
import UfrgsLogo from '../../../assets/logos/ufrgs.png'
import Section from './section'
import DinoLogo from '../../../assets/logos/dinosaur_1.svg'
import DinoHr from '../../../components/dino_hr'

const AboutUs = (): JSX.Element => {
  const sections = [
    {
      title: 'PET Computação',
      img: PetLogo,
      text: `\tO PET (Programa de Educação Tutorial) Computação, criado em 1988, é um grupo composto por estudantes de graduação dos cursos de Ciência da Computação e Engenharia da Computação. Coordenado pela professora Érika Cota, o projeto é formado por uma equipe diversa, voltada ao desenvolvimento individual de seus estudantes e também ao fortalecimento da comunidade acadêmica, tanto do Instituto de Informática, quanto externa e interPETs.
\tO PET Computação é baseado na Tríade Acadêmica de Ensino, Pesquisa e Extensão, e tem como objetivo providenciar a oportunidade dos membros explorarem áreas de interesse além do currículo de seus cursos.
\tOs projetos desenvolvidos pelo grupo abrangem o desenvolvimento de softwares e aplicações mobile; ministração de minicursos relacionados à computação; projetos de pesquisa e desenvolvimento de artigos acadêmicos; organização de eventos para a comunidade do Instituto, dentre outros. Também são realizados projetos em parceria com outros grupos PET da UFRGS (PETelos).`,
      footnote: `Instituto de Informática - UFRGS\nAv. Bento Gonçalves, 9500\nCampus do Vale - Prédio 43424\n2° Pavimento - Sala 201`,
    },
    { title: 'Hospital de Clínicas', img: HCLogo },
    { title: 'UFRGS', img: UfrgsLogo },
  ]

  return (
    <div className="about-us">
      <Paper elevation={1}>
        <div className="card__header">
          <img
            className="card__header__image"
            src={DinoLogo}
            alt="Logo DinoApp"
            width="20%"
            height="20%"
          ></img>
          <h3 className="card__header__title">Sobre Nós</h3>
          <div className="card__typography muted">
            Programa de Educação Tutorial
          </div>
          <DinoHr />
        </div>
        <div className="card__content">
          <div className="card__typography">
            {sections.map((section, index) => (
              <Section
                title={`${index + 1}. ${section.title}`}
                ImgSrc={section.img}
                text={section.text}
                footnote={section.footnote}
                key={index}
              />
            ))}
          </div>
        </div>
      </Paper>
    </div>
  )
}

export default AboutUs
