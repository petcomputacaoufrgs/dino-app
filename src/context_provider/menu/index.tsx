import React, { useState, createContext, useContext, useEffect } from 'react'
import MenuContextType from '../../types/context_provider/MenuContextType'
import MenuContextUpdater from '../../context_updater/MenuContextUpdater'

const MenuContext = createContext<MenuContextType>({
    component: <></>
})

const MenuContextProvider: React.FC = (props) => {
    const [component, setComponent] = useState<JSX.Element>(() => <></>)

    useEffect(() => {
        const updateData = (component: JSX.Element) => {
            setComponent(component)
        }

        let handleLocalDataChanged = (component: JSX.Element) => {
            updateData(component)
        }

        MenuContextUpdater.setCallback(handleLocalDataChanged)

        const cleanBeforeUpdate = () => {
            handleLocalDataChanged = (component: JSX.Element) => { }
        }

        return cleanBeforeUpdate
    })

    const value: MenuContextType = {
        component: component,
    }

    return (
        <MenuContext.Provider value={value}>
            {props.children}
        </MenuContext.Provider>
    )
}

export const useMenu = () => useContext(MenuContext)

export default MenuContextProvider
