import React from 'react';
//import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import GlossarySearchBar from '../../components/glossary/glossary_search';

const Glossary = () : JSX.Element => {

	const glossary = [
		{
			id: 1,
			title: 'Alopécia',
			subtitle: 'Sintoma',
			text_quick: "Queda de cabelos. Some quick example text to build on the card title and make up the bulk of the card's content.",
			link: '#'
		},
		{
			id: 2,
			title: 'Câncer',
			subtitle: 'Doença',
			text_quick: "Multiplicação de células anormais malignas. Some quick example text to build on the card title and make up the bulk of the card's content.",
			link: '#'
		},
		{
			id: 3,
			title: 'Cateter',
			subtitle: 'Objeto',
			text_quick: "Tubos colocados em veias grandes, fixado embaixo da pele. É por onde se recebe quimioterapia, medicações, soroterapia e sangue. Some quick example text to build on the card title and make up the bulk of the card's content.",
			link: '#'
		}
	]

	return <GlossarySearchBar glossary={glossary} />
}

export default Glossary

