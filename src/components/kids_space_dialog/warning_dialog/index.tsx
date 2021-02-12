import React from 'react'
import WarningDialogProps from './props'
import { useLanguage } from '../../../context/language/index'
import '../styles.css'
import './styles.css'

const WarningDialog: React.FC<WarningDialogProps> = ({
	open,
    icon: Icon,
	children,
}) => {
	const language = useLanguage()

	return (
		<>
		{open && 
		<div className="warning_dialog">
            <div className="warning_dialog__circle">
                <Icon />
            </div>
  			<div className='warning_dialog__content'>
    			{children}
  			</div>
		</div>}
		</>
	)
}

export default WarningDialog