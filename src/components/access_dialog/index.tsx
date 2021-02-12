import React from 'react'
import AccessDialogProps from './props'
import { useLanguage } from '../../context/language/index'
import Button from '../button'
import './styles.css'

const AccessDialog: React.FC<AccessDialogProps> = ({
	open,
    icon: Icon,
	children,
}) => {
	const language = useLanguage()

	return (
		<>
		{open &&
        <div className="warning_dialog dialog_input">
        <div className="warning_dialog__circle">
            <Icon />
        </div>
          <div className='warning_dialog__content'>
                {children}
                <div className='warning_dialog__content_form'>
                    <label>Senha:</label><br/>
                    <input type="password" id="password" />
                    <a> Esqueceu sua senha? </a>
                    <div className='warning_dialog__content__buttons'>
                        <Button>Cancelar</Button>
                        <Button>Acessar</Button>
                    </div>
                </div>
          </div>
        </div>}
		</>
	)
}

export default AccessDialog