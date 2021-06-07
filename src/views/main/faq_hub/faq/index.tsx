import React, { useState } from 'react'
import LinkButton from '../../../../components/button/link_button'
import MuiSearchBar from '../../../../components/mui_search_bar'
import { useLanguage } from '../../../../context/language'
import { HasStaffPowers } from '../../../../context/private_router'
import TreatmentService from '../../../../services/treatment/TreatmentService'
import FaqView from '../../../../types/faq/view/FaqView'
import FaqItems from '../faq_list_items'
import QuestionDialogForm from '../question_dialog_form'

const Faq: React.FC<{ view?: FaqView }> = ({ view }) => {
  const language = useLanguage()
  const isStaff = HasStaffPowers()
  const [dialogOpen, setQuestionDialogOpen] = useState(false)
	const [searchTerm, setSearchTerm] = useState('')

  return (
    <>
      <MuiSearchBar
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value as string)}
      />
      { view ? 
        <>
          <FaqItems data={TreatmentService.getFaqViewByFilter(view, searchTerm)} />
          {!isStaff && 
            <LinkButton
              text={language.data.NOT_FOUND_QUESTION_FAQ}
              onClick={() => setQuestionDialogOpen(true)}
            />
          }
          <QuestionDialogForm
            treatment={view.treatment}
            dialogOpen={dialogOpen}
            onClose={() => setQuestionDialogOpen(false)}
          /> 
        </> : <> </>
      }
    </>
  )
}

export default Faq