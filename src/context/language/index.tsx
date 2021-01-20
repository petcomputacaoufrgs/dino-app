import React, { useState, useEffect, createContext, useContext } from 'react'
import LanguageBase from '../../constants/languages/LanguageBase'
import UserSettingsService from '../../services/user/UserSettingsService'

export interface LanguageContextType {
	data: LanguageBase
	loading: boolean
}

const LanguageContext = createContext<LanguageContextType>({
	data: UserSettingsService.getDefaultLanguage(),
	loading: true,
})

const LanguageProvider: React.FC = ({ children }) => {
	const [first, setFirst] = useState(true)
	const [value, setValue] = useState({
		data: UserSettingsService.getDefaultLanguage(),
		loading: true,
	})

	useEffect(() => {
		const loadFirstSettingsInfo = async () => {
			const dbSettings = await UserSettingsService.getFirst()
			if (dbSettings) {
				setValue({
					data: UserSettingsService.getLanguage(dbSettings),
					loading: false,
				})
			} else {
				setValue({
					data: UserSettingsService.getDefaultLanguage(),
					loading: false,
				})
			}
		}

		UserSettingsService.addUpdateEventListenner(loadFirstSettingsInfo)

		if (first) {
			loadFirstSettingsInfo()
		}

		return () => {
			UserSettingsService.removeUpdateEventListenner(loadFirstSettingsInfo)
		}
	}, [first])

	useEffect(() => {
		if (first) {
			setFirst(false)
		}
	}, [first])

	return (
		<LanguageContext.Provider value={value}>
			{children}
		</LanguageContext.Provider>
	)
}

export const useLanguage = () => useContext(LanguageContext)

export default LanguageProvider
