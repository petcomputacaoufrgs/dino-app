import React, { useState } from 'react'
import { Avatar, CardContent, CardHeader, ListItem, ListItemText } from '@material-ui/core'
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import { useLanguage } from '../../../../context/language'
import AvatarIcon from '@material-ui/icons/QuestionAnswer';
import MuiSearchBar from '../../../../components/mui_search_bar'
import ListTitle from '../../../../components/list_title'
import QuestionDialogForm from '../question_dialog_form'
import AddButton from '../../../../components/button/circular_button/add_button'
import TreatmentView from '../../../../types/faq/view/TreatmentView'

const TreatmentQuestionItems: React.FC<{ view?: TreatmentView }> = ({ view }) => {

  const language = useLanguage()

  const [searchTerm, setSearchTerm] = useState('')
  const [toAdd, setToAdd] = useState(false)

  const handleClick = () => {}

  return <> 
    <MuiSearchBar
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value as string)}
    />
    <ListTitle title={language.data.USERS_QUESTIONS}/>
    {/* TODO: excluir isso pq staff n deve ter acesso. é só pra teste */}
    { view ? 
      <>
        <AddButton
          handleAdd={() => setToAdd(true)}
          label={language.data.NEW_TREATMENT}
        />
        <QuestionDialogForm
          treatment={view.treatment}
          dialogOpen={toAdd}
          onClose={() => setToAdd(false)}
        />
        {view.questions?.map((item, index) => 
          <div key={index}>
            <CardHeader
              avatar={<Avatar><AvatarIcon /></Avatar>}
              action={<OptionsIconButton dark onClick={handleClick} />}
              title={view.treatment.name}
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