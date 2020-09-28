import React, { useState } from 'react'
import AdaptableMenuProps from './props'
import ScreenUtils from '../../../utils/ScreenUtils'
import DrawerNavigation from '../drawer_navigation'
import './styles.css'

/**
 * @description Menu adaptável para mobile e desktop
 * @param props Propriedade com os itens utilizados no menu
 * @returns Elemento JSX com o menu correto
 */
const AdaptableMenu = (props: AdaptableMenuProps): JSX.Element => {
  /** Estado que registra a orientação da tela */
  const [isLandscape, setIfIsLandscape] = useState(ScreenUtils.isLandscape())

  /**
   * @description Função invocada quando a orientação da tela muda
   */
  const onScreenOrientationChange = () => {
    setIfIsLandscape(ScreenUtils.isLandscape())
  }

  /** Configura a função onScreenOrientationChange para ser invocada quando houver mudança na horientação da tela */
  ScreenUtils.setOnScreenOrientationChangeEvent(onScreenOrientationChange)

  /**
   * @description Retorna o menu adaptavél com base no dispositivo utilizado e na horientação da tela
   * @returns Elemento JSX contendo o menu
   */
  const renderAdaptableMenu = (): JSX.Element => {
    return (
      <div className="adaptable_menu">
        <DrawerNavigation
        mini={isLandscape}
        groupedItems={props.groupedItems}
        />
        <div className={isLandscape ? 'adaptable_menu__component_with_mini' : 'adaptable_menu__component'}>
          {props.component}
        </div>
      </div>
    )
  }

  return renderAdaptableMenu()
}

export default AdaptableMenu
