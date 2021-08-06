import React from 'react'
import MenuService from '../../../services/menu/MenuService'
import DinoIconButton from '../../../components/button/icon_button'
import { useLanguage } from '../../../context/language'
import Button from '../../../components/button'
import LanguageBase from '../../../constants/languages/LanguageBase'
import MenuItemViewModel from '../../../types/menu/MenuItemViewModel'
import { GetPermission } from '../../../context/private_router'
import PermissionEnum from '../../../types/enum/PermissionEnum'
import './styles.css'

const Home: React.FC = () => {
	const language = useLanguage()

	const searchMainPages = (getMainPages: (language: LanguageBase) => MenuItemViewModel[]) => 
		getMainPages(language.data).filter(item => item.name !== language.data.HOME)

	const getGroupedMenuByPermission = () => {
		const userPermission = GetPermission()

		switch(userPermission) {
			case PermissionEnum.STAFF: return MenuService.getStaffMainPages
			case PermissionEnum.ADMIN: return MenuService.getAdminMainPages
			default: return MenuService.getMainPages
		}
	}

	const items = searchMainPages(getGroupedMenuByPermission())

	return (
		<div className='home'>
			<div className='home__grid'>
				{items
					.filter(item => item.image)
					.map((item, index) => (
						<div className='home__grid__item' key={index}>
							<DinoIconButton
								icon={item.image!}
								className='home__grid__button'
								onClick={item.onClick}
							/>
							<p className='home__grid__item__name'>{item.name}</p>
						</div>
					))}
			</div>
			<div className='info__grid'>
				{items
					.filter(item => !item.image)
					.map((item, index) => (
						<Button
							key={index}
							className='info__grid__item'
							onClick={item.onClick}
						>
							<p>{item.name}</p>
						</Button>
					))}
			</div>
		</div>
	)
}

export default Home

