import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import GlossarySearchBar from '../../components/glossary/glossary_search';


class Glossary {

	text = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur porttitor nisl vitae commodo mattis. Nunc pellentesque dui non pellentesque ullamcorper. Maecenas sit amet nisi facilisis, auctor felis vitae, fermentum risus. Maecenas gravida arcu vel tortor bibendum viverra. Donec lacus tortor, euismod id ipsum quis, volutpat pulvinar libero. Cras euismod varius odio pulvinar dignissim. Morbi quis dui vitae orci volutpat auctor. Mauris vestibulum purus purus, dignissim placerat risus lacinia sed. Nam in dignissim risus, quis lacinia odio. Sed ullamcorper pellentesque dignissim. Morbi tristique, orci eget sollicitudin finibus, est sem vestibulum lectus, in luctus sem mi nec diam. Vestibulum pretium pharetra lorem vel mollis. Sed et purus ultricies, finibus metus vel, tempus quam. Pellentesque mauris nulla, egestas eu odio eu, finibus pulvinar ligula. Mauris ut iaculis neque. Duis ipsum dui, convallis sed lacus a, cursus imperdiet tortor."
	items = [
		{
			id: 1,
			title: 'Alopécia',
			subtitle: 'Sintoma',
			text_quick: "Queda de cabelos. Some quick example text to build on the card title and make up the bulk of the card's content.",
			text_long: this.text
		},
		{
			id: 2,
			title: 'Câncer',
			subtitle: 'Doença',
			text_quick: "Multiplicação de células anormais malignas. Some quick example text to build on the card title and make up the bulk of the card's content.",
			text_long: this.text
		},
		{
			id: 3,
			title: 'Cateter',
			subtitle: 'Objeto',
			text_quick: "Tubos colocados em veias grandes, fixado embaixo da pele. É por onde se recebe quimioterapia, medicações, soroterapia e sangue. Some quick example text to build on the card title and make up the bulk of the card's content.",
			text_long: this.text
		}
	]

	//return <GlossarySearchBar glossary={glossary} />
}

export default new Glossary()

