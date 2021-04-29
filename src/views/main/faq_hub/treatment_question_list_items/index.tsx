import React, { useState } from 'react'
import { Avatar, CardContent, CardHeader, ListItem, ListItemText } from '@material-ui/core'
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import { useLanguage } from '../../../../context/language'
import AvatarIcon from '@material-ui/icons/QuestionAnswer';
import MuiSearchBar from '../../../../components/mui_search_bar'
import ListTitle from '../../../../components/list_title'
import QuestionDialogForm from '../question_dialog_form'
import AddButton from '../../../../components/button/circular_button/add_button'
import { useTreatmentView } from '../../../../context/staff_data'
import { useParams } from 'react-router-dom'

const TreatmentQuestionItems: React.FC = () => {

  //não encontrava o localId
  const { localId } = useParams<{ localId?: string }>()
  
  const language = useLanguage()

  const [searchTerm, setSearchTerm] = useState('')
  const [toAdd, setToAdd] = useState(false)
  const treatmentView = useTreatmentView(Number(localId))

  //TODO what?
  const handleClick = () => {}

  return <> 
    <MuiSearchBar
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value as string)}
    />
    <ListTitle title={language.data.USERS_QUESTIONS}/>
    {/* TODO: excluir isso pq staff n deve ter acesso. é só pra teste */}
    { treatmentView ? 
      <>
        <AddButton
          handleAdd={() => setToAdd(true)}
          label={language.data.NEW_TREATMENT}
        />
        <QuestionDialogForm
          treatment={treatmentView.treatment}
          dialogOpen={toAdd}
          onClose={() => setToAdd(false)}
        />
        {treatmentView.questions?.map((item, index) => 
          <div key={index}>
            <CardHeader
              avatar={<Avatar><AvatarIcon /></Avatar>}
              action={<OptionsIconButton dark onClick={handleClick} />}
              title={treatmentView.treatment.name}
              subheader={item.lastUpdate?.toDateString()}
            />
            <CardContent>
              <ListItem divider>
                <ListItemText primary={item.question}/>
              </ListItem>
            </CardContent>
          </div>
        )}
      </>
   : <></> }
  </>
}

export default TreatmentQuestionItems