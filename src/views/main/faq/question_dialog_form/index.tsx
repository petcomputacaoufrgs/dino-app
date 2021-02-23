import React, { useState, useEffect } from 'react'
import { TextField } from '@material-ui/core'
import QuestionDialogFormProps from './props'
import Constants from '../../../../constants/app_data/DataConstants'
import TreatmentQuestionEntity from '../../../../types/faq/database/TreatmentQuestionEntity'
import TreatmentQuestionService from '../../../../services/faq/TreatmentQuestionService'
import { useLanguage } from '../../../../context/language'
import './styles.css'
import DinoDialog, { DinoDialogContent, DinoDialogHeader } from '../../../../components/dialogs/dino_dialog'

const QuestionDialogForm: React.FC<QuestionDialogFormProps> = ({ dialogOpen, setDialogOpen, treatment }) => {

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
			} else if (question === '') {
					setError(true)
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

		const getHelperText = () => (error && language.data.INVALID_VALUE) || `${question.length}/${Constants.FAQ_USER_QUESTION.MAX}`

		return (
			<div className='dialog-form'>
				<DinoDialog
					open={dialogOpen}
					onSave={handleSave}
					onClose={handleClose}	
					header={
					<DinoDialogHeader>
						{language.data.titleTreatmentQuestion(treatment.name)}
					</DinoDialogHeader>
					}
				>
					<DinoDialogContent>
						<p style={{'margin': '0'}}>Mande para os profissionais!</p>
						<TextField
								className='dino_textfield'
								required={Constants.FAQ_USER_QUESTION.REQUIRED}
								fullWidth
								value={question}
								onChange={(e) => setQuestion(e.target.value)}
								autoFocus
								margin='dense'
								label={language.data.FORM_QUESTION}
								placeholder={language.data.FORM_QUESTION_PLACEHOLDER}
								type='question'
								multiline
								rowsMax={7}
								inputProps={{ maxLength: Constants.FAQ_USER_QUESTION.MAX }}
								helperText={getHelperText()}
								error={error}
							/>
					</DinoDialogContent>
				</DinoDialog>
			</div>
		)
	}

export default QuestionDialogForm
