import React, { useState } from 'react'
import BottomNavigationProps from './props'
import { makeStyles } from '@material-ui/core/styles'
import { default as MaterialBottomNavigation } from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'

/**
 * @description Menu de navegação inferior
 * @param props Propriedades utilizadas no menu, incluindo os itens que serão utilizados
 */
const BottomNavigation = (props: BottomNavigationProps) => {

    /** Classes utilizadas */
    const classes = useStyles()

    /** Salva o indice do item selecionado no vetor de itens */
    const [selectecItemIndex, setSelectedItemIndex] = useState(props.selectedItem ? props.selectedItem : 0)
  
    /**
     * @description Executa os procedimentos para modificar o item do menu
     * @param event Dados do evento disparado
     * @param newValue Indice do novo item selecionado no vetor de items
     */
    const handleChange = (event: React.ChangeEvent<{}>, indexNewSelectedItem: string) => {
        const intIndex = Number(indexNewSelectedItem)

        setSelectedItemIndex(intIndex)

        const selectedItem = props.items[intIndex]

        selectedItem.onClick(intIndex)

        props.onChange(intIndex)
    }
  
    return (
      <MaterialBottomNavigation value={selectecItemIndex} onChange={handleChange} className={classes.root}>
        {props.items.map((item, index) => (
            <BottomNavigationAction 
                key={index} 
                label={item.name} 
                value={index} 
                icon={
                    <img className={classes.image} src={item.image} alt={item.name} />
                } 
            />
        ))}
      </MaterialBottomNavigation>
    );
}

/** 
 * @description Estilos do Menu
 * */ 
const useStyles = makeStyles({
    root: {
        position: 'fixed',
        width: '100%',
        height: '70px',
        display: 'flex',
        alignItems: 'center',
        bottom: 0,
        left: 0
    },
    image: {
        width: '40px'
    }
  })

export default BottomNavigation