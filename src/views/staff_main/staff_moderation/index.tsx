import { Avatar, List, ListItem, ListItemAvatar, ListItemText, TextField } from '@material-ui/core'
import React, { useState } from 'react'
import Button from '../../../components/button'
import { useLanguage } from '../../../context/language'
import './styles.css'
import { ReactComponent as SaveSVG } from '../../../assets/icons/save.svg'
import DinoTabPanel from '../../../components/tab_panel'
import AvatarIcon from '@material-ui/icons/Person';

const StaffModeration: React.FC = () => {

  const language = useLanguage()
  const [email, setEmail] = useState('')

  const handleAddEmail = () => {
    setEmail('')
  }


  const renderFormContent = () => {
    return (
    <div className='dialog_form__content'>
      <TextField
        required
        fullWidth
        value={email}
        onChange={(event) => setEmail(event.target.value as string)}
        margin='dense'
        id='email'
        label={language.data.FORM_EMAIL}
        type='email'
        multiline
        placeholder='Separe múltiplos e-mails por vírgula'
        inputProps={{ maxLength: 50 }}
        //error={isNameInvalid(props.name)}
      />
      <Button
        className='staff_moderation__save_button'
        onClick={handleAddEmail}
      >
        <SaveSVG className='staff_moderation__save_button__icon' />
        {language.data.FORM_ADD_STAFF}
      </Button>
    </div>
    )
  }

  const renderListContent = () => {

    const staff = [
      { primary: 'mayra.cademartori@gmail.com', secondary: "Jan 9, 2014"},
      { primary: 'aaaaaa.cademartori@gmail.com', secondary: "Jan 23, 2014"} 
    ]

    return (
      <List>
        {staff.map((e, index) => 
          <ListItem key={index}>
            <ListItemAvatar>
              <Avatar><AvatarIcon /></Avatar>
            </ListItemAvatar>
            <ListItemText primary={e.primary} secondary={e.secondary} />
          </ListItem>
        )}
      </List>
    )
  }
  

  return (
    <div className='staff_moderation'>
      <DinoTabPanel panels={[
          { name: language.data.ADD_STAF_TAB, Component: renderFormContent()}, 
          { name: language.data.STAFF_LIST_TAB, Component: renderListContent()}
        ]} 
      />
    </div>
    )
}

export default StaffModeration