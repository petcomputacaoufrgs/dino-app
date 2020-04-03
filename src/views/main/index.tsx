import React from 'react';
import LogoutButton from '../../components/logout_button';
import './styles.css'

/**
 * @description Tela principal da aplicação
 **/
const Main = () : JSX.Element => {
    return (
        <div className='main'>
            <LogoutButton />
        </div>
    )
}

export default Main