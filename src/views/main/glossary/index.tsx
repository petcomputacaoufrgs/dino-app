import React, { useState, useEffect } from 'react'
import GlossaryItems from './glossary_items'
import MuiSearchBar from '../../../components/mui_search_bar'
import 'bootstrap/dist/css/bootstrap.min.css'
import GlossaryItemEntity from '../../../types/glossary/database/GlossaryItemEntity'
import Loader from '../../../components/loader'
import { useLanguage } from '../../../context/language'
import GlossaryService from '../../../services/glossary/GlossaryService'
import './styles.css'

const Glossary: React.FC = () => {
	const language = useLanguage()

	const [glossary, setGlossary] = useState<GlossaryItemEntity[]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
		const loadData = async () => {
			const glossary = await GlossaryService.getAll()
			updateData(glossary)
			finishLoading()
		}

		let updateData = (glossary: GlossaryItemEntity[]) => {
			setGlossary(glossary)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		GlossaryService.addUpdateEventListenner(loadData)

		if (isLoading) {
			loadData()
		}

		return () => {
			updateData = () => {}
			finishLoading = () => {}
			GlossaryService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	const handleChange = (event: any) => setSearchTerm(event.target.value)

	const filteredGlossary = GlossaryService.filterGlossary(glossary, searchTerm)

	return (
		<div className='glossary'>
			<MuiSearchBar
				value={searchTerm}
				onChange={handleChange}
				placeholder={language.data.SEARCH_HOLDER}
			/>
			<Loader className='glossary_loader' isLoading={isLoading}>
				<GlossaryItems items={filteredGlossary} />
			</Loader>
		</div>
	)
}

export default Glossary
