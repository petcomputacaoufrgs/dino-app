import React, { useEffect, useState } from 'react'
import { SaveButton } from '../../components/button/save_button'
import DinoHr from '../../components/dino_hr'
import { DinoTextfield } from '../../components/textfield'
import DataConstants from '../../constants/app_data/DataConstants'
import { useAlert } from '../../context/alert'
import { useLanguage } from '../../context/language'
import ReportService from '../../services/report/ReportService'
import UserService from '../../services/user/UserService'
import ReportEntity from '../../types/report/database/ReportEntity'
import StringUtils from '../../utils/StringUtils'
import './styles.css'

const ReportBug: React.FC = () => {
	const language = useLanguage()
	const alert = useAlert()
	const [error, setError] = useState<string>()
	const [report, setReport] = useState<ReportEntity>({ what: '' })

	const initialize = () => {
		setReport({ what: '' })
		setError(undefined)
	}

	useEffect(() => initialize(), [])

	const handleSave = async () => {
		if (StringUtils.isEmpty(report.what)) {
			setError(language.data.EMPTY_FIELD_ERROR)
			return
		}

		const user = await UserService.getFirst()
		if (user && user.localId) {
			report.userLocalId = user.localId
		}
		ReportService.save(report)
		alert.showSuccessAlert(language.data.SUCESS)
		initialize()
	}

	const handleChangeWhat = (event: React.ChangeEvent<HTMLInputElement>) => {
		const what = event.target.value as string
		setReport({ ...report, what })
	}

	const handleChangeWhere = (event: React.ChangeEvent<HTMLInputElement>) => {
		const where = event.target.value as string
		setReport({ ...report, where })
	}

	const handleChangeHow = (event: React.ChangeEvent<HTMLInputElement>) => {
		const how = event.target.value as string
		setReport({ ...report, how })
	}

	return (
		<div className='report_bug'>
			<div className='report_bug__div'>
				<h3>{'WHAT'}</h3>
				<DinoHr />
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde incidunt
					ratione iste quibusdam fuga ipsa ullam recusandae alias? Laborum
					reiciendis iusto sunt, maxime quasi modi perspiciatis nam illum quae
					aperiam?
				</p>
				<DinoTextfield
					value={report.what}
					onChange={handleChangeWhat}
					variant='outlined'
					rows={10}
					multiline
					dataProps={DataConstants.REPORT_WHAT}
					errorMessage={error}
				/>
			</div>
			<div className='report_bug__div'>
				<h3>{'HOW'}</h3>
				<DinoHr />
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde incidunt
					ratione iste quibusdam fuga ipsa ullam recusandae alias? Laborum
					reiciendis iusto sunt, maxime quasi modi perspiciatis nam illum quae
					aperiam?
				</p>
				<DinoTextfield
					value={report.how}
					onChange={handleChangeHow}
					variant='outlined'
					multiline
					dataProps={DataConstants.REPORT_HOW}
				/>
			</div>
			<div className='report_bug__div'>
				<h3>{'WHERE'}</h3>
				<DinoHr />
				<p>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Unde incidunt
					ratione iste quibusdam fuga ipsa ullam recusandae alias? Laborum
					reiciendis iusto sunt, maxime quasi modi perspiciatis nam illum quae
					aperiam?
				</p>
				<DinoTextfield
					value={report.where}
					onChange={handleChangeWhere}
					variant='outlined'
					rows={10}
					multiline
					dataProps={DataConstants.REPORT_WHERE}
				/>
			</div>
			<SaveButton onClick={handleSave} />
		</div>
	)
}

export default ReportBug
