import { ListItem, ListItemText, ListItemSecondaryAction } from '@material-ui/core'
import React from 'react'
import { Link } from 'react-router-dom'
import OptionsIconButton from '../../../../../components/button/icon_button/options_icon_button'
import PathConstants from '../../../../../constants/app/PathConstants'
import TreatmentEntity from '../../../../../types/treatment/database/TreatmentEntity'

interface TreatmentItemProps {
  item: TreatmentEntity,
  onClickMenu: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>, item: TreatmentEntity) => void
}

const TreatmentItemList: React.FC<TreatmentItemProps> = ({ item, onClickMenu }) => {

  return (
    <div className='contacts__list__item'>
    <ListItem >
      <ListItemText
        primary={item.name}
        secondary={
        <Link className='history_link' to={`${PathConstants.STAFF_FAQ}/${item.localId}`}>
          {`Ver F.A.Q. de ${item.name}`} 
        </Link>}
      />
      <ListItemSecondaryAction>
        <OptionsIconButton dark onClick={(e) => onClickMenu(e, item)} />
      </ListItemSecondaryAction>
    </ListItem>
  </div>
  )
}

export default TreatmentItemList