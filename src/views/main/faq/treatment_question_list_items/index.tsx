import React, { useState } from 'react'
import { Avatar, CardContent, CardHeader, ListItem, ListItemText } from '@material-ui/core'
import OptionsIconButton from '../../../../components/button/icon_button/options_icon_button'
import { useLanguage } from '../../../../context/language'
import AvatarIcon from '@material-ui/icons/QuestionAnswer';
import TreatmentQuestionEntity from '../../../../types/faq/database/TreatmentQuestionEntity'
import MuiSearchBar from '../../../../components/mui_search_bar'
import ListTitle from '../../../../components/list_title'

const TreatmentQuestionItems: React.FC<{ items: Array<TreatmentQuestionEntity> }> = ({ items }) => {

  const language = useLanguage()

  const [searchTerm, setSearchTerm] = useState('')

  const handleClick = () => {}

  return <>
    <MuiSearchBar
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value as string)}
    />
    <ListTitle title={language.data.USERS_QUESTIONS}/>
    {items.map((item, index) => 
        <div key={index}>
          <CardHeader
            avatar={<Avatar><AvatarIcon /></Avatar>}
            action={<OptionsIconButton dark onClick={handleClick} />}
            title={item.localTreatmentId}
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
}

export default TreatmentQuestionItems