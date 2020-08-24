import React from 'react'
import FormItemProps from './props'
import './styles.css'

const FormItem: React.FC<FormItemProps> = ({ iconSrc, iconAlt, item }) => {
    return (
      <div className="calendar__add__modal__form__item">
        <div className="calendar__add_modal__form__item__icon">
          {iconSrc && <img src={iconSrc} alt={iconAlt} />}
        </div>
        <div className="calendar__add_modal__form__item__field">{item}</div>
      </div>
    )
}

export default FormItem