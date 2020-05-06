import React, { createContext, useContext } from 'react'
import { Router } from 'react-router'
import { History, LocationState } from 'history'
import PrivateRouterProps from './props'

/**
 * @description Contexto padrão para o router
 */
const PrivateRouterContext = createContext(new PrivateRouterProps('', '', () => false))

/**
 * @description Gera os dados necessários para as rotas privadas e de login
 * @param props Propriedades do PrivateRouter
 */
const PrivateRouter = (props: PrivateRouterProps) : JSX.Element => {

    const getHistory = (): History<LocationState> => {
        if (props.browserHistory) {
            return props.browserHistory
        } 
            
        throw Error('PrivateRouter necessita de um History.')
    }


    return (
        <Router history={ getHistory() } >
            <PrivateRouterContext.Provider value={ props }>
                {props.children}
            </PrivateRouterContext.Provider>
        </Router>
    )
}

export const useRouter = () => (
    useContext(PrivateRouterContext)
)

export default PrivateRouter
