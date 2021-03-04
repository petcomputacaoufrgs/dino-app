import { TextField } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import DinoDialog from '../../../../components/dialogs/dino_dialog'
import DataConstants from '../../../../constants/app_data/DataConstants'
import { useLanguage } from '../../../../context/language'
import GlossaryService from '../../../../services/glossary/GlossaryService'
import GlossaryItemEntity from '../../../../types/glossary/database/GlossaryItemEntity'
import StringUtils from '../../../../utils/StringUtils'
import './styles.css'

interface GlossaryItemFormProps {
  open: boolean,
  item?: GlossaryItemEntity
  handleClose: () => void
}

const getItem = (item: GlossaryItemEntity | undefined) => {
  return item || getEmptyItem()
}

const getEmptyItem = () => {
  return { title: '', subtitle: '', text: '', fullText: ''} as GlossaryItemEntity
}

const GlossaryItemForm: React.FC<GlossaryItemFormProps> = ( props ) => {

  const language = useLanguage()
  const [item, setItem] = useState<GlossaryItemEntity>(getItem(props.item))
  const [error, setError] = useState(false)

  useEffect(() => {
    if(props.open) {
      setItem(getItem(props.item))
    }
    return () => {
      setItem({ title: '', subtitle: '', text: '', fullText: ''})
      setError(false)
    }
  }, [props.open, props.item])


  const handleSave = () => {
    if(StringUtils.isNotEmpty(item.title)) {
      GlossaryService.save(item)
      props.handleClose()
    } else setError(true)
	}

  return (
      <DinoDialog
				open={props.open}
				onSave={handleSave}
				onClose={props.handleClose}
			>
				<div className='glossary_item__form_content'>
          <TextField
            className='dino_textfield'
            required={DataConstants.GLOSSARY_TITLE.REQUIRED}
            fullWidth
            value={item.title}
            onChange={(e) => setItem({...item, title: e.target.value})}
            margin='dense'
            label={`${language.data.TITLE}`}
            type='name'
            error={error}
            inputProps={{ maxLength: DataConstants.GLOSSARY_TITLE.MAX }}
            helperText={(error && language.data.EMPTY_FIELD_ERROR) || `${item.title.length}/${DataConstants.GLOSSARY_TITLE.MAX}` }
          />
          <br />
          <TextField
            className='dino_textfield'
            required={DataConstants.GLOSSARY_SUBTITLE.REQUIRED}
            fullWidth
            value={item.subtitle}
            onChange={(e) => setItem({...item, subtitle: e.target.value})}
            margin='dense'
            label={`${language.data.SUBTITLE}`}
            type='text'
            inputProps={{ maxLength: DataConstants.GLOSSARY_SUBTITLE.MAX }}
            helperText={`${item.subtitle.length}/${DataConstants.GLOSSARY_SUBTITLE.MAX}` }
          />
          <br />
          <TextField
            className='dino_textfield'
            required={DataConstants.GLOSSARY_TEXT.REQUIRED}
            multiline
            rows={3}
            fullWidth
            value={item.text}
            onChange={(e) => setItem({...item, text: e.target.value})}
            margin='dense'
            label={`${language.data.TEXT}`}
            type='text'
            inputProps={{ maxLength: DataConstants.GLOSSARY_TEXT.MAX }}
            helperText={`${item.text.length}/${DataConstants.GLOSSARY_TEXT.MAX}` }
          />
          <br />
          <TextField
            className='dino_textfield'
            required={DataConstants.GLOSSARY_FULLTEXT.REQUIRED}
            multiline
            rows={5}
            fullWidth
            value={item.fullText}
            onChange={(e) => setItem({...item, fullText: e.target.value})}
            margin='dense'
            label={`${language.data.FULL_TEXT}`}
            type='text'
            inputProps={{ maxLength: DataConstants.GLOSSARY_FULLTEXT.MAX }}
            helperText={`${item.fullText.length}/${DataConstants.GLOSSARY_FULLTEXT.MAX}` }
          />
          <br />
        </div>
			</DinoDialog>
  )
}

export default GlossaryItemForm