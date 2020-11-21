import React from 'react'
import FormItemProps from './props'
import Button from '../../../../../../components/button'
import './styles.css'

const FormItem: React.FC<FormItemProps> = ({
  iconSrc,
  iconAlt,
  onIconClick,
  item,
}) => {
  const handleIconClick = () => {
    if (onIconClick) {
      onIconClick()
    }
  }

  const renderImage = (): JSX.Element => {
    if (iconSrc) {
      if (onIconClick) {
        return (
          <Button
            onClick={handleIconClick}
            className="calendar__edit_event_modal__form__item__icon__button"
          >
            <img src={iconSrc} alt={iconAlt} />
          </Button>
        )
      } else {
        return <img src={iconSrc} alt={iconAlt} />
      }
    }

    return <></>
  }

  return (
    <div className="calendar__add__modal__form__item">
      <div className="calendar__edit_event_modal__form__item__icon">
        {renderImage()}
      </div>
      <div className="calendar__edit_event_modal__form__item__field">
        {item}
      </div>
    </div>
  )
}

export default FormItem
