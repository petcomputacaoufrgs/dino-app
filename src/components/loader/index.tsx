import React, { useState, useEffect } from 'react'
import LoaderSVG from '../../images/loader.svg'
import LoaderProps from './props'
import './styles.css'

/* Classe principal básica do componente */
const MainClass = 'loader'

/* Classe principal para Loader inativo */
const ClosedClass = 'loader__closed'

/* Classe principal para Loader entrando em estado inativo */
const EndingClass = 'loader__ending'

/**
 * @description Loader de tela cheia
 */
const Loader = (props: LoaderProps) => {
    /* Configura o estado de loading */
    const [loading, setLoading] = useState(props.loading)

    /* Configura o estado de closed para finalizar a exibição do Loader */
    const [closed, setClosed] = useState(!props.loading)

    /* Atualiza o estado de loading pela mudança de propriedade*/
    useEffect(() => {
        if (loading) { 
            if (!props.loading) { // Caso tenha mudado o estado de loading para false
                setLoading(props.loading)

                setClosed(true)
            }
        } else if (props.loading) { // Caso tenha mudado do estado de loading para true
            setLoading(props.loading)
        }
    }, [loading, props.loading])

    /**
     * @description Retorna a classe principal baseado no estado atual do componente
     */
    const getMainClass = () => {
        const className = MainClass

        if (!loading) {
            if (closed) {
                return className.concat(' ').concat(ClosedClass)
            } else {
                return className.concat(' ').concat(EndingClass)
            }
        }

        return className
    }

    return (
        <div className={getMainClass()}>
            <img 
                className='loader__image' 
                src={LoaderSVG} 
                alt={props.alt ? props.alt : 'Imagem de círculo girando indicando carregamento.'}
            />
        </div>
    )
}

export default Loader