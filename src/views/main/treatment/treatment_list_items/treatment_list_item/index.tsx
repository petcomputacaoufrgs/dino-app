import React from 'react'
import { ListItem, ListItemText, ListItemSecondaryAction, Badge } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import PathConstants from '../../../../../constants/app/PathConstants'
import { useLanguage } from '../../../../../context/language'
import { useTreatmentView } from '../../../../../context/staff_data'
import Icon from '@material-ui/icons/ContactSupport';
import ArrayUtils from '../../../../../utils/ArrayUtils'
import TreatmentItemProps from './props'

const TreatmentItemList: React.FC<TreatmentItemProps> = ({ item, onClickMenu }) => {
  const language = useLanguage()
  const history = useHistory()
  const treatmentView = useTreatmentView(item.localId)

  const redirectToUserQuestions = () => history.push(`${PathConstants.STAFF_FAQ}/${item.localId}/${PathConstants.USER_QUESTIONS_TAB}`)

  return (
    <div className='treatment__list_item'>
      <ListItem >
        <ListItemText
          className='treatment__list_item__text'
          primary={item.name}
          secondary={
            <Link className='dino__history_link' to={`${PathConstants.STAFF_FAQ}/${item.localId}/${PathConstants.FAQ_TAB}`}>
              {language.data.seeFAQItemsText(language.data.TREATMENT)}
            </Link>
          }
        />
        <ListItemSecondaryAction>
          <Badge
            overlap="circle"
            color="secondary"
            invisible={ArrayUtils.isEmpty(treatmentView?.questions)}
            badgeContent={treatmentView?.questions?.length}
          >
            <Icon onClick={redirectToUserQuestions} />
          </Badge>
          <OptionsIconButton onClick={(e) => onClickMenu(e, item)} />
        </ListItemSecondaryAction>
      </ListItem>
    </div>
  )
}

export default TreatmentItemList