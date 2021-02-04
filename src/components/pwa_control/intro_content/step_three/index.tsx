import React from 'react'
import { useLanguage } from '../../../../context/language'
import SyncInfo from '../../../sync_info'
import SyncStateEnum from '../../../../types/sync/SyncStateEnum'
import './styles.css'

const PWAControlIntroContentStepThree: React.FC = () => {
	const language = useLanguage()

	return (
		<div className='pwa_control__intro_content__step_three'>
			<p>{language.data.PWA_INTRO_3_TEXT_1}</p>
			<div className='pwa_control__intro_content__step_three__item'>
				<SyncInfo
					className='pwa_control__intro_content__step_three__sync_info'
					state={SyncStateEnum.NOT_SYNCED}
				/>
				<p>{language.data.PWA_INTRO_3_TEXT_2}</p>
			</div>
			<div className='pwa_control__intro_content__step_three__item'>
				<SyncInfo
					className='pwa_control__intro_content__step_three__sync_info'
					state={SyncStateEnum.SYNCHRONIZING}
				/>
				<p>{language.data.PWA_INTRO_3_TEXT_3}</p>
			</div>
			<div className='pwa_control__intro_content__step_three__item'>
				<SyncInfo
					className='pwa_control__intro_content__step_three__sync_info'
					state={SyncStateEnum.SYNCED}
				/>
				<p>{language.data.PWA_INTRO_2_TEXT_4}</p>
			</div>
		</div>
	)
}

export default PWAControlIntroContentStepThree
