import { ListItem, ListItemText, ListItemSecondaryAction, Badge } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import PathConstants from '../../../../../constants/app/PathConstants'
import { useLanguage } from '../../../../../context/language'
import { useTreatmentView } from '../../../../../context/staff_data'
import TreatmentEntity from '../../../../../types/treatment/database/TreatmentEntity'
import Icon from '@material-ui/icons/ContactSupport';

interface TreatmentItemProps {
  item: TreatmentEntity,
  onClickMenu: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: TreatmentEntity) => void
}

const TreatmentItemList: React.FC<TreatmentItemProps> = ({ item, onClickMenu }) => {
  const language = useLanguage()
  const treatmentData = useTreatmentView(item.localId)
  const questions = treatmentData ? treatmentData.questions || [] : []

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
          badgeContent={questions.length}
          variant="dot"
        > 
          {/* TODO: Como fazer pra mudar a aba a partir dum link??? */}
          <Icon onClick={e => {}}/>
        </Badge>
        <OptionsIconButton dark onClick={(e) => onClickMenu(e, item)} />
      </ListItemSecondaryAction>
    </ListItem>
  </div>
  )
}

export default TreatmentItemList