import React from 'react'
import { ListItem, ListItemText, ListItemSecondaryAction, Badge } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import PathConstants from '../../../../../constants/app/PathConstants'
import { useLanguage } from '../../../../../context/language'
import { useTreatmentView } from '../../../../../context/staff_data'
import TreatmentEntity from '../../../../../types/treatment/database/TreatmentEntity'
import Icon from '@material-ui/icons/ContactSupport';
import TreatmentQuestionService from '../../../../../services/treatment/TreatmentQuestionService'
import ArrayUtils from '../../../../../utils/ArrayUtils'

interface TreatmentItemProps {
  item: TreatmentEntity,
  onClickMenu: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: TreatmentEntity) => void
}

const TreatmentItemList: React.FC<TreatmentItemProps> = ({ item, onClickMenu }) => {
  const language = useLanguage()
  const history = useHistory()
  const treatmentView = useTreatmentView(item.localId)

  //TODO tirar literal de aba
  const redirectToUserQuestions = () => {
    history.push(`${PathConstants.STAFF_FAQ}/${item.localId}/1`);
  }

  return (
    <div className='treatment__list_item'>
      <ListItem >
        <ListItemText
          className='treatment__list_item__text'
          primary={item.name}
          secondary={
            <Link className='dino__history_link' to={`${PathConstants.STAFF_FAQ}/${item.localId}`}>
              {language.data.seeFAQItemsText(language.data.TREATMENT)}
            </Link>
          }
        />
        <ListItemSecondaryAction>
          <Badge
            overlap="circle"
            color="secondary"
            invisible={ArrayUtils.isEmpty(treatmentView?.questions)}
            variant="dot"
          >
            <Icon onClick={redirectToUserQuestions} />
          </Badge>
          <OptionsIconButton dark onClick={(e) => onClickMenu(e, item)} />
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  )
}

export default TreatmentItemList