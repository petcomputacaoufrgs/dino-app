import React, { useState, useEffect } from 'react'
import { useLanguage } from '../../../context_provider/app_settings'
import StringUtils from '../../../utils/StringUtils'
import BootstrapSearchBar from '../../../components/bootstrap_search_bar'
import 'bootstrap/dist/css/bootstrap.min.css'
import FaqItemModel from '../../../types/faq/FaqItemModel'
import FaqItems from './faq_items'



const Faq = (): JSX.Element => {
  const language = useLanguage().current
  const [items, setItems] = useState([
    {id: 1.1, question: "O que fazer1??", answer: "Faça isso1: blablablaLorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,sit amet blandit leo lobortis eget."}, 
    {id: 1.2, question: "O que fazer2??", answer: "Faça isso2: blablablaLorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,sit amet blandit leo lobortis eget."},
    {id: 1.3, question: "O que fazer3??", answer: "Faça isso3: blablablaLorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,sit amet blandit leo lobortis eget."},
    {id: 1.4, question: "O que fazer4??", answer: "Faça isso4: blablablaLorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,sit amet blandit leo lobortis eget."},
] as FaqItemModel[])

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([] as FaqItemModel[])

  const handleChange = (event) => setSearchTerm(event.target.value)

  useEffect(() => {
    const results = items.filter((item) =>
      StringUtils.contains(item.question, searchTerm)
    )
    setSearchResults(results)
  }, [items, searchTerm])

  return (
    <div className="faq">
      <BootstrapSearchBar
        value={searchTerm}
        onChange={handleChange}
        placeholder={language.SEARCH_HOLDER}
      />
      <FaqItems items={searchResults} />
    </div>
  )
}

export default Faq
