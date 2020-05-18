import React, { useState, useEffect } from 'react'
import BottomNavigationProps from './props'
import MenuItemViewModel from '../../model/view/MenuItemViewModel'
import DrawerNavigation from '../drawer_navigation'
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles'
import { default as MaterialBottomNavigation } from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import './styles.css'

/**
 * @description Menu de navegação inferior
 * @param props Propriedades utilizadas no menu, incluindo os itens que serão utilizados
 */
const BottomNavigation = (props: BottomNavigationProps) => {

    /** Classes utilizadas */
    const classes = useStyles()

    /** Salva o indice do item selecionado no vetor de itens */
    const [selectecItemIndex, setSelectedItemIndex] = useState(props.selectedItem)
  
    /**
     * @description Executa os procedimentos para modificar o item do menu
     * @param event Dados do evento disparado
     * @param newValue Indice do novo item selecionado no vetor de items
     */
    const onChange = (event: React.ChangeEvent<{}>, indexNewSelectedItem: string) => {
        const intIndex = Number(indexNewSelectedItem)

        setSelectedItemIndex(intIndex)

        const selectedItem = getFirstMenuItemsGroup()[intIndex]

        selectedItem.onClick()
    }

    /** Lida com a atualização externa da props */
    useEffect(() => {
        setSelectedItemIndex(props.selectedItem ? props.selectedItem : 0)
    }, [props.selectedItem])

    /**
     * @description Retorna o primeiro e principal grupo de itens do menu
     * @returns Primeiro grupo de itens do menu
     */
    const getFirstMenuItemsGroup = (): MenuItemViewModel[] => {
        if (props.groupedItems.length !== 0) {
            return props.groupedItems[0]
        }

        return []
    }

    /**
     * @description Retorna todos os grupos de itens com exceção do primeiro
     * @returns Lista de itens secundários do menu
     */
    const getSecondaryMenuItemsGroups = (): MenuItemViewModel[][] => (
        props.groupedItems.slice(1)
    )

    /**
     * @description Rendeniza os itens principais do menu
     * @returns Elemento JSX com os itens principais em um BottomNavigation
     */
    const renderMainItems = (): JSX.Element => (
        <MaterialBottomNavigation 
            value={selectecItemIndex} 
            onChange={onChange}
        >
            {getFirstMenuItemsGroup().map((item, index) => (
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
    )

    /**
     * @description Retorna o menu lateral com os itens secundários
     * @returns Elemento JSX com o menu lateral contendo os itens secundários do menu
     */
    const renderSecondaryItems = (): JSX.Element => (
        <DrawerNavigation 
            mini={false} 
            groupedItems={getSecondaryMenuItemsGroups()} />
    )

    /**
     * @description Carrega o componente com os items do menu dentro de rotas
     */
    const renderContent = () : JSX.Element  => {
        return props.component
    }
  
    return (
        <div className='bottom_navigation'>
            {renderSecondaryItems()}
            <div className='bottom_navigation__component'>
                {renderContent()}
            </div>
            {renderMainItems()}
        </div>
    );
}

/** 
 * @description Estilos do Menu
 * */ 
const useStyles = makeStyles((theme: Theme) => 
    createStyles({
        image: {
            width: '35px'
        }
    })
)

export default BottomNavigation