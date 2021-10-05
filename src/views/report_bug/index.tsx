import CloseIcon from '@material-ui/icons/Close'
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

const getDefault = () => {
	return {
		what: '',
		where: '',
		how: '',
	} as ReportEntity
}

const ReportBug: React.FC = () => {
	const language = useLanguage()
	const alert = useAlert()
	const [error, setError] = useState<string>()
	const [report, setReport] = useState<ReportEntity>(getDefault())
	const [cardFile, setCardFile] = useState<any>()

	const initialize = () => {
		setReport(getDefault())
		setError(undefined)
	}

	useEffect(() => {
		console.log(cardFile)
	}, [cardFile])

	useEffect(() => initialize(), [])

	const handleSave = async () => {
		if (StringUtils.isEmpty(report.what)) {
			setError(language.data.EMPTY_FIELD_ERROR)
			return
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

	const handleUploadFile = (e: any) => {
		if (!e.target.files || e.target.files.length === 0) {
			console.log('aui?')
			return removeFile()
		}
		setCardFile(e.target.files[0])
	}

	const removeFile = () => {
		setCardFile(undefined)
	}
	return (
		<div className='report_bug'>
			<div className='report_bug__div'>
				<h3>{language.data.WHAT}</h3>
				<DinoHr />
				<p>{language.data.BUG_REPORT_WHAT}</p>
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
				<h3>{language.data.HOW}</h3>
				<DinoHr />
				<p>{language.data.BUG_REPORT_HOW}</p>
				<DinoTextfield
					value={report.how}
					onChange={handleChangeHow}
					variant='outlined'
					multiline
					rows={10}
					dataProps={DataConstants.REPORT_HOW}
				/>
			</div>
			<div className='report_bug__div'>
				<h3>{language.data.WHERE}</h3>
				<DinoHr />
				<p>{language.data.BUG_REPORT_WHERE}</p>
				<DinoTextfield
					value={report.where}
					onChange={handleChangeWhere}
					variant='outlined'
					multiline
					dataProps={DataConstants.REPORT_WHERE}
				/>
			</div>
			<div className='report_bug__div'>
				<h3>{language.data.UPLOAD}</h3>
				<DinoHr />
				<p>{language.data.BUG_REPORT_UPLOAD}</p>
				<div className='report__save_button'>
					<label htmlFor='file_button'>Enviar arquivo</label>
					<input
						type='file'
						onChange={handleUploadFile}
						accept='image/*'
						id='file_button'
					/>
					<div className='select_file_button__file_name__containter'>
						<p className='select_file_button__file_name'>
							{cardFile?.name || 'Não selecionado'}
						</p>
						{cardFile && <CloseIcon fontSize='small' onClick={removeFile} />}
					</div>
				</div>
			</div>
			<SaveButton onClick={handleSave} />
		</div>
	)
}

export default ReportBug
