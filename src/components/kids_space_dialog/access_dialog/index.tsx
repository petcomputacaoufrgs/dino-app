import React from 'react'
import AccessDialogProps from './props'
import { useLanguage } from '../../../context/language/index'
import Button from '../../button'
import '../styles.css'
import './styles.css'

const AccessDialog: React.FC<AccessDialogProps> = ({
	open,
    icon: Icon,
    onClose,
    onConfirm
}) => {
	const language = useLanguage()

	return (
		<>
		{open &&
        <div className="kids_space_dialog access_dialog">
        <div className="kids_space_dialog__circle">
            <Icon />
        </div>
          <div className='kids_space_dialog__content'>
                <p>{language.data.ACCESS_PARENTS_AREA}</p>
                <div className='access_dialog__form'>
                    <label>{language.data.PASSWORD}</label><br/>
                    <input type="password" id="password" />
                    <a href={'https://i.guim.co.uk/img/media/936a06656761f35e75cc20c9098df5b2e8c27ba7/0_398_4920_2952/master/4920.jpg?width=1200&height=1200&quality=85&auto=format&fit=crop&s=97df6bd31d4f899da5bf4933a39672da'}> {language.data.FORGOT_PASSWORD}</a>
                    <div className='access_dialog__buttons'>
                        <Button onClick={onClose}>{language.data.DIALOG_CANCEL_BUTTON_TEXT}</Button>
                        <Button onClick={onConfirm}>{language.data.ACCESS_BUTTON}</Button>
                    </div>
                </div>
          </div>
        </div>}
		</>
	)
}

export default AccessDialog