import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import SearchIcon from '@material-ui/icons/Search';
import GlossaryItems from '../glossary_items';
import './styles.css';
import LocalStorageService from '../../../services/LocalStorageService'


const GlossarySearchBar = () : JSX.Element => {

    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const handleChange = event => {
        setSearchTerm(event.target.value);
    };

    useEffect(() => {
        const items = LocalStorageService.getGlossaryItems()
        const results = items.filter(item =>
            item.title.toLowerCase().includes(searchTerm.toLowerCase())
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