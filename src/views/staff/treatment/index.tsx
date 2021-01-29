import React, { useEffect, useState } from 'react'
import CircularButton from '../../../components/button/circular_button'
import Loader from '../../../components/loader'
import MuiSearchBar from '../../../components/mui_search_bar'
import { useLanguage } from '../../../context/language'
import TreatmentService from '../../../services/treatment/TreatmentService'
import StringUtils from '../../../utils/StringUtils'
import { ReactComponent as AddIconSVG } from '../../../assets/icons/add.svg'
import TreatmentEntity from '../../../types/treatment/database/TreatmentEntity'
import TreatmentItems from './treatment_items'
import FormContent from '../../../components/form_content'
import { Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@material-ui/core'
import TransitionSlide from '../../../components/slide_transition'
import './styles.css'
import TextButton from '../../../components/button/text_button'

interface TreatmentProps {
	ref: React.Ref<unknown>,
}

const Treatment: React.FC<TreatmentProps> = React.forwardRef(({ ref },) => {

	const language = useLanguage()

	const [value, setValue] = useState('')
	const [isLoading, setIsLoading] = useState(true)
	const [treatments, setTreatments] = useState<Array<TreatmentEntity>>([])
	const [add, setAdd] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')
	const [error, setError] = useState(false)
	
	const filteredTreatments = treatments.filter(e => StringUtils.contains(e.name, searchTerm))


	useEffect(() => {
		const loadData = async () => {

			updateTreatments(await TreatmentService.getAll())
	
			finishLoading()
		}

		TreatmentService.addUpdateEventListenner(loadData)

		let updateTreatments = (data: TreatmentEntity[]) => {
			setTreatments(data)
		}

		let finishLoading = () => {
			setIsLoading(false)
		}

		if (isLoading) {
			loadData()
		}

		return () => {
			updateTreatments = () => {}
			finishLoading = () => {}
			TreatmentService.removeUpdateEventListenner(loadData)
		}
	}, [isLoading])

	const handleChange = (event: React.ChangeEvent<{ value: string }>) => {
		setSearchTerm(event.target.value)
  }
  
	const handleAdd = () => setAdd(true)

	const handleClose = () => {
		setValue('')
		setError(false)
		setAdd(false)
	}

	const handleSave = () => {
		if(!StringUtils.isEmpty(value)) {
			console.log(value)
			TreatmentService.save({ name: value })
			handleClose()
		} else {
			setError(true)
		}
	}

	const renderAddTreatment = () => {
		return (
			<div className='treatment__dialog_form__content'>
				<Dialog
				  ref={ref}
					open={add}
					maxWidth='xs'
					onClose={handleClose}
					TransitionComponent={TransitionSlide}
					fullWidth
				>
					<DialogTitle>
						Adicionar Tratamento
					</DialogTitle>
					<DialogContent dividers>
						<TextField
							className='treatment__dialog_form__content__textfield'
							margin='dense'
							required
							fullWidth
							label='{props.label}'
							type='name'
							helperText={error && 'Não pode ser vazio'}
							value={value}
							onChange={(e) => setValue(e.target.value as string)}
							error={error}
						/>
					</DialogContent>
						<DialogActions className='treatment_action__buttons'>
							<TextButton onClick={handleClose}>
								{language.data.DIALOG_CANCEL_BUTTON_TEXT}
							</TextButton>
							<TextButton onClick={handleSave}>
								{language.data.DIALOG_SAVE_BUTTON_TEXT}
							</TextButton>
						</DialogActions>
				</Dialog>
			</div>
		)
	}
	

	return (
		<div className='treatments'>
			<Loader className='treatments__loader' isLoading={isLoading}>
				<MuiSearchBar
					value={searchTerm}
					onChange={handleChange}
					placeholder={language.data.SEARCH_HOLDER}
				/>
				<TreatmentItems items={filteredTreatments} />
				<CircularButton
					ariaLabel={language.data.CONTACTS_ADD_CONTACT}
					className='add_button'
					icon={AddIconSVG}
					onClick={handleAdd}
				/>
			</Loader>
			{renderAddTreatment()}
		</div>
	)
})

export default Treatment