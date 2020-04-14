import React, { useContext } from 'react'
import { Avatar } from '@material-ui/core'
import { LanguageProviderContext } from '../../../components/language_provider'
import './styles.css'

const Home = () => {
    const languageContext = useContext(LanguageProviderContext)

    const avatarSrc = 'https://www.i9treinamentos.com/wp-content/uploads/elementor/thumbs/Conhe%C3%A7a-a-rela%C3%A7%C3%A3o-dos-%C3%BAltimos-munic%C3%ADpios-que-aderiram-ao-Crian%C3%A7a-Feliz-min-odgh9gqs3mqak9ehgnoa188p46tdlfwj066qj6w3o4.jpg'

    const username = 'Henrique Pereira'
    
    return (
        <div className='home'>
            <p className='home__welcome_message'>{languageContext.WELCOME_MESSAGE}</p>
            <Avatar src={avatarSrc} alt={languageContext.AVATAR_ALT} className='home__avatar' />
            <p className='home__username'>{username}</p>
        </div>
    )
}

export default Home