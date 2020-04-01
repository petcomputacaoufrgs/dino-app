import React, { createContext } from 'react'
import { Router } from 'react-router'
import PrivateRouterProps from './props'
import history from '../../services/HistoryService'

/**
 * @description Contexto padrão para o router
 */
export const PrivateRouterContext = createContext(new PrivateRouterProps('', '', false))

/**
 * @description Gera uma rota com verificação de autenticação e redirecionamento automático
 * @param props Propriedades do Route
 */
const PrivateRouter = (props: PrivateRouterProps) : JSX.Element => {
    return (
        <Router history={ history } >
            <PrivateRouterContext.Provider value={ props }>
                {props.children}
            </PrivateRouterContext.Provider>
        </Router>
    )
}

export default PrivateRouter
