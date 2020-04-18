import React, { useState, useEffect } from 'react'
import PacmanLoader from "react-spinners/PacmanLoader"
import LoaderProps from './props'
import './styles.css'

/**
 * @description Loader de tela cheia
 */
const Loader = (props: LoaderProps) => {
    /* Configura o estado de loading */
    const [loading, setLoading] = useState(props.loading)

    /* Atualiza o estado de loading pela mudança de propriedade */
    useEffect(() => {
        setLoading(props.loading)
    }, [props.loading])

    const getClass = (): string => {
        if (loading) {
            return 'loader'
        }
        return ''
    }

    return (
        <div className={getClass()}>
            <PacmanLoader
                size={40}
                color={"#B32E55"}
                loading={loading}
            />
        </div>
    )
}

export default Loader