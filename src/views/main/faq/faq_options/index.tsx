import React, { useState, useEffect } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import {FormControl,Select,MenuItem} from '@material-ui/core'
import FaqService from '../../../../services/faq/FaqService'
import { FaqTitleOptionsModel } from '../../../../types/faq/FaqOptionsModel'


const FaqOptions = (): JSX.Element => {

    const [faqOptions, setFaqOptions] = useState([] as FaqTitleOptionsModel[])
    const [open, setOpen] = useState(false)
    const [faqId, setFaqId] = React.useState<string | number>('')

    const handleChangeFaq = (event: React.ChangeEvent<{ value: unknown }>) => {
        setFaqId(event.target.value as number)
        handleChangeUserFaq()
    }

    const handleChangeOpen = () => setOpen(!open)

    useEffect(() => {
        const getFaqOptions = async () => {
        if(open) {
          const optionsItems = await FaqService.getFaqOptions() as FaqTitleOptionsModel[]
          if(optionsItems.length > 0)
            setFaqOptions(optionsItems)
        }
      }
      getFaqOptions()
      }, [open])

      const handleChangeUserFaq = async () => {
        if(faqId) {
          FaqService.saveUserFaqId(Number(faqId))
          FaqService.getUserFaq()
          
          //setItems(items)
        }
        handleChangeOpen()
      }

    return (
      
      <FormControl fullWidth variant="standard">
              <Select
                open={open}
                onClick={handleChangeOpen}
                fullWidth
                labelId="select-outlined-label"
                id="select-outlined"
                value={faqId}
                onChange={handleChangeFaq}
                label="treatment"
                placeholder="treatment"
              >
                {faqOptions.map(faq => 
                  <MenuItem key={faq.id} value={faq.id}>{faq.title}</MenuItem>
                )}
              </Select>
            </FormControl>
    )
  }

  export default FaqOptions