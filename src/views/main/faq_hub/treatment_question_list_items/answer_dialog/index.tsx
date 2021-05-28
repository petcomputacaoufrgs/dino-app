import { TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import DinoDialog, { DinoDialogContent, DinoDialogHeader } from '../../../../../components/dialogs/dino_dialog'
import { useLanguage } from '../../../../../context/language'
import TreatmentQuestionEntity from '../../../../../types/faq/database/TreatmentQuestionEntity'
import Constants from '../../../../../constants/app_data/DataConstants'
import StringUtils from '../../../../../utils/StringUtils'
import FaqItemService from '../../../../../services/faq/FaqItemService'
import FaqItemEntity from '../../../../../types/faq/database/FaqItemEntity'
import './styles.css'
import TreatmentQuestionService from '../../../../../services/treatment/TreatmentQuestionService'

const TreatmentAnswerDialog: React.FC<{
    dialogOpen: boolean
    onClose: () => void
    treatmentQuestion: TreatmentQuestionEntity
}> = ({
    dialogOpen,
    onClose,
    treatmentQuestion
}) => {
    const language = useLanguage()
    const [answer, setAnswer] = useState("")
    const [error, setError] = useState(false)

	useEffect(() => {
		if (!dialogOpen) {
			return () => {
				setAnswer("")
				setError(false)
			}
		}
	}, [dialogOpen])

    const handleSave = () => {
        if (StringUtils.isEmpty(answer)) {
            setError(true)
		} else {
            saveAnswer()
			onClose()
		}
    }

    const saveAnswer = async () => {
        const newFaqItem: FaqItemEntity = {
            answer: answer,
            question: treatmentQuestion.question,
            localTreatmentId: treatmentQuestion.localTreatmentId
        }
        await FaqItemService.save(newFaqItem)
        TreatmentQuestionService.delete(treatmentQuestion)
    }

    const handleClose = () => {
        onClose()
    }

    const getHelperText = () => (error && language.data.EMPTY_FIELD_ERROR) || `${answer.length}/${Constants.FAQ_ANSWER.MAX}`

    return (
        <DinoDialog
            open={dialogOpen}
            onSave={handleSave}
            onClose={handleClose}
            header={
                <DinoDialogHeader>
                    <h2>{language.data.ANSWER}</h2>
                </DinoDialogHeader>
            }
        >
            <DinoDialogContent>
                <form className='treatment_question__answer'>
                    <h3>{treatmentQuestion.question}</h3>
                    <TextField
                        className='dino__textfield'
                        required={Constants.FAQ_ANSWER.REQUIRED}
                        fullWidth
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        autoFocus
                        margin='dense'
                        label={language.data.FORM_ANSWER}
                        placeholder={language.data.TREATMENT_QUESTION_ANSWER_PLACEHOLDER}
                        type='question'
                        multiline
                        rowsMax={7}
                        inputProps={{ maxLength: Constants.FAQ_ANSWER.MAX }}
                        helperText={getHelperText()}
                        error={error}
                    />
                </form>
            </DinoDialogContent>
        </DinoDialog>
    )
}

export default TreatmentAnswerDialog