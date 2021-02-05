import React, { useState, useEffect } from 'react'
import {
	TextField,
} from '@material-ui/core'
import QuestionDialogFormProps from './props'
import Constants from '../../../../constants/faq/FaqConstants'
import TreatmentQuestionEntity from '../../../../types/faq/database/TreatmentQuestionEntity'
import TreatmentQuestionService from '../../../../services/faq/TreatmentQuestionService'
import { useLanguage } from '../../../../context/language'
import './styles.css'
import DinoDialog from '../../../../components/dialogs/dino_dialog'

const QuestionDialogForm = React.forwardRef(
	(
		{ dialogOpen, setDialogOpen, treatment }: QuestionDialogFormProps,
		ref: React.Ref<unknown>,
	): JSX.Element => {
		const language = useLanguage()
		const [question, setQuestion] = useState('')
		const [error, setError] = useState(false)

		const handleClose = () => {
			setDialogOpen(false)
		}

		const handleSave = () => {
			if (treatment && question !== '') {
				const entity: TreatmentQuestionEntity = {
					question: question,
					localTreatmentId: treatment.localId,
				}
				
				TreatmentQuestionService.save(entity)

				handleClose()
			} else {
				if (question === '') {
					setError(true)
				}
			}
		}

		useEffect(() => {
			if (dialogOpen === false) {
				return () => {
					setQuestion('')
					setError(false)
				}
			}
		}, [dialogOpen])

		const handleChangeQuestion = (
			event: React.ChangeEvent<HTMLInputElement>,
		) => {
			setQuestion(event.target.value as string)
		}

		return (
			<div className='dialog-form'>
				<DinoDialog
					open={dialogOpen}
					onSave={handleSave}
					onClose={handleClose}	
				>
					<TextField
							required
							fullWidth
							value={question}
							onChange={handleChangeQuestion}
							autoFocus
							margin='dense'
							id='question'
							label={language.data.FORM_QUESTION}
							placeholder={language.data.FORM_QUESTION_PLACEHOLDER}
							type='question'
							multiline
							rowsMax={7}
							inputProps={{ maxLength: Constants.TREATMENT_QUESTION_MAX }}
							helperText={`${question.length}/${Constants.TREATMENT_QUESTION_MAX}`}
							error={question.length === Constants.TREATMENT_QUESTION_MAX || error}
						/>
				</DinoDialog>
			</div>
		)
	},
)

export default QuestionDialogForm
