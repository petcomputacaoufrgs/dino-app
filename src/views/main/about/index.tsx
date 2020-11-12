import React from 'react'
import { useCurrentLanguage } from '../../../context_provider/app_settings'
import { Divider, Paper } from '@material-ui/core'
import './styles.css'

const AboutUs = (): JSX.Element => {

  const language = useCurrentLanguage()

  return (
    <div className="glossary-item">
      <Paper elevation={5}>
        <div className="card__header" >
          <h3 className='card__header__title'>
            Sobre Nós
          </h3>
          <div className='card__typography muted'>
            Lorem ipsum dolor sit amet
          </div>
        </div>
        <Divider/>
        <div className="card__content" >
          <div className='card__typography'>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate ipsam numquam, nesciunt consequatur fuga porro itaque blanditiis error, aspernatur veritatis nam quae. Enim inventore dolores laboriosam excepturi tempora commodi, dolorum minus velit magnam quod explicabo impedit, aperiam aspernatur! Cum exercitationem animi autem nihil reiciendis, molestias minima ratione ducimus! Atque aliquid magni eligendi laboriosam laudantium ad illo unde quas in enim. Dignissimos enim nemo eum sint fugiat eos eveniet minus, error sit blanditiis aperiam mollitia, voluptatibus reiciendis nesciunt exercitationem! Atque ullam eligendi a? Reprehenderit cumque quasi illo dolorem maiores corrupti. Maiores similique at magnam repellat nulla omnis dolorem voluptatem molestias non illum ut odio, fugit adipisci harum doloremque incidunt inventore est. Temporibus, iure eligendi quos, ratione quaerat, ad tenetur ut eveniet amet incidunt maxime veritatis unde ducimus nam? Nisi laborum reiciendis, eum enim doloribus temporibus adipisci quis inventore, quibusdam, architecto et laboriosam nam tenetur quidem vel accusamus id! Corrupti perspiciatis aliquid a inventore aspernatur facilis, eos nulla omnis ea tempora deserunt voluptatibus provident. Sunt nemo quam culpa voluptatibus molestiae ullam a quisquam non dolor minima vero, cumque esse quibusdam. Voluptatem nostrum perspiciatis optio recusandae, numquam ea commodi fugiat ducimus ab repudiandae incidunt, corporis dicta porro odio nam magni rerum eveniet! Provident!
          </div>
        </div>
      </Paper>
    </div>
  )
}

export default AboutUs
