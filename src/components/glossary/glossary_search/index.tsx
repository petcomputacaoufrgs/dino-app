import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchIcon from '@material-ui/icons/Search';
import GlossaryItems from '../glossary_items';
import './styles.css';
import LocalStorageService from '../../../services/LocalStorageService'
import GlossaryItemModel from '../../../model/GlossaryItemModel';


const GlossarySearchBar = () : JSX.Element => {

    const [searchTerm, setSearchTerm] = useState("")
    const [searchResults, setSearchResults] = useState(new Array<GlossaryItemModel>())

    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    //Para realizar uma pesquisa global e substituir, incluir a chave g na expressão regular ou se o primeiro parâmetro é uma string, inclua g no parâmetro flags.
    useEffect(() => {
        const items = LocalStorageService.getGlossaryItems()
        const results = items.filter(item =>
            item.title.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
            .includes(searchTerm.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, ""))
        );
        setSearchResults(results);
    }, [searchTerm]);

    return (
        <div className="glossary">
            <div className='search-bar'>
                <div className="input-group">
                    <div className="input-group-prepend">
                        <span className="input-group-text" id="inputGroupPrepend"><SearchIcon /></span>
                    </div>
                    <input className="form-control"
                        type="text"
                        aria-label="Search"
                        value={searchTerm}
                        onChange={handleChange}
                        placeholder="Buscar..."
                    />
                </div>
            </div>
            <GlossaryItems items={searchResults} />
        </div>
    );
}

export default GlossarySearchBar