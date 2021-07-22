import React, { useEffect, useState } from 'react'
import { SaveButton } from '../../components/button/save_button'
import { useLanguage } from '../../context/language'
import { ReportDiv } from './report_div'
import './styles.css'

const ReportBug: React.FC = () => {
	const language = useLanguage()
	const [error, setError] = useState<string>()
	const [value, setValue] = useState('')

	useEffect(() => {
		setError(undefined)
		setValue('')
	}, [])

	const handleSave = () => {
		setError(language.data.INVALID_VALUE)
	}

	return (
		<div className='report_bug'>
			<ReportDiv
				title={`Reportar o Problema`}
				value={value}
				onChange={e => setValue(e.target.value)}
				description={`Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident esse
				modi veniam aperiam dicta reprehenderit maiores deleniti, error odit id
				possimus, ratione quod tempora, quis suscipit aliquid quisquam.
				Laboriosam, veritatis?`}
				error={error !== undefined}
				helperText={error}
			/>
			<ReportDiv
				title={`Reportar o Problema`}
				value={value}
				onChange={e => setValue(e.target.value)}
				description={`Lorem ipsum dolor sit amet consectetur, adipisicing elit. Provident esse
				modi veniam aperiam dicta reprehenderit maiores deleniti, error odit id
				possimus, ratione quod tempora, quis suscipit aliquid quisquam.
				Laboriosam, veritatis?`}
			/>
			{/* <Button className='settings__save_button' onClick={handleSave}>
				{language.data.SAVE}
			</Button> */}
			<SaveButton onClick={handleSave} />
		</div>
	)
}

export default ReportBug
