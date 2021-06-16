import React, { useState } from 'react'
import { Avatar, CardContent, CardHeader, ListItem, ListItemText } from '@material-ui/core'
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import { useLanguage } from '../../../../context/language'
import AvatarIcon from '@material-ui/icons/QuestionAnswer'
import MuiSearchBar from '../../../../components/mui_search_bar'
import ListTitle from '../../../../components/list_components/list_title'
import QuestionDialogForm from '../question_dialog_form'
import { useTreatmentView } from '../../../../context/staff_data'
import { useParams } from 'react-router-dom'
import ItemListMenu from '../../../../components/list_components/item_list_menu'
import TreatmentAnswerDialog from './answer_dialog'
import TreatmentQuestionEntity from '../../../../types/faq/database/TreatmentQuestionEntity'
import TreatmentQuestionService from '../../../../services/treatment/TreatmentQuestionService'
import TreatmentView from '../../../../types/faq/view/TreatmentView'
import ArrayUtils from '../../../../utils/ArrayUtils'
import NoItemsList from '../../../../components/list_components/no_items_list'

const TreatmentQuestionItems: React.FC = () => {
  //não encontrava o localId
  const { localId } = useParams<{ localId?: string }>()

  const language = useLanguage()

  const [searchTerm, setSearchTerm] = useState('')
  const [toAdd, setToAdd] = useState(false)
  const [toAnswer, setToAnswer] = useState(false)
  const [selectedQuestion, setSelectedQuestion] = useState<TreatmentQuestionEntity>()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)

  const treatmentView = useTreatmentView(Number(localId))

  const handleShowItemMenu = (
    event: React.MouseEvent<HTMLButtonElement>,
    treatmentQuestion: TreatmentQuestionEntity
  ) => {
    setSelectedQuestion(treatmentQuestion)
    setAnchorEl(event.currentTarget)
  }

  const handleAnswerOption = () => {
    setToAnswer(true)
  }

  const handleCloseAnswerDialog = () => {
    setToAnswer(false)
    setSelectedQuestion(undefined)
  }

  const handleDeleteOption = () => {
    if (selectedQuestion) {
      TreatmentQuestionService.delete(selectedQuestion)
      setSelectedQuestion(undefined)
    }
  }

  const handleCloneDialog = () => {
    setAnchorEl(null)
  }

  const renderTreatmentQuestions = (treatmentView: TreatmentView) => {
    if(ArrayUtils.isEmpty(treatmentView.questions)) {
      return <NoItemsList />
    }
    return (treatmentView.questions!.map((item, index) =>
      <div key={index}>
        <CardHeader
          avatar={<Avatar><AvatarIcon /></Avatar>}
          action={
            <OptionsIconButton
              dark
              onClick={(event) => handleShowItemMenu(event, item)}
            />
          }
          title={treatmentView.treatment.name}
          subheader={item.lastUpdate?.toDateString()}
        />
        <CardContent>
          <ListItem divider>
            <ListItemText primary={item.question} />
          </ListItem>
        </CardContent>
      </div>
    ))
  }

  return <>
    <MuiSearchBar
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value as string)}
    />
    <ListTitle title={language.data.USERS_QUESTIONS} />
    { treatmentView ?
      <>
        <QuestionDialogForm
          treatment={treatmentView.treatment}
          dialogOpen={toAdd}
          onClose={() => setToAdd(false)}
        />
        {selectedQuestion && 
          <TreatmentAnswerDialog
            treatmentQuestion={selectedQuestion}
            dialogOpen={toAnswer}
            onClose={handleCloseAnswerDialog}
          />
        }
        {renderTreatmentQuestions(treatmentView)}
        <ItemListMenu
          anchor={anchorEl}
          setAnchor={setAnchorEl}
          onEdit={handleAnswerOption}
          onDelete={handleDeleteOption}
          onCloseDialog={handleCloneDialog}
          editText={language.data.ANSWER}
        />
      </>
      : <></>}
  </>
}

export default TreatmentQuestionItems