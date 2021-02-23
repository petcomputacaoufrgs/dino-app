import React, { useState, useEffect } from 'react'
import { TextField } from '@material-ui/core'
import QuestionDialogFormProps from './props'
import Constants from '../../../../constants/faq/FaqConstants'
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

		const maxLength =  Constants.TREATMENT_QUESTION_MAX
		const getHelperText = () => (error && language.data.INVALID_VALUE) || `${question.length}/${maxLength}`

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
								required
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
								inputProps={{ maxLength }}
								helperText={getHelperText()}
								error={error}
							/>
					</DinoDialogContent>
				</DinoDialog>
			</div>
		)
	}

export default QuestionDialogForm
