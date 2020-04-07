import React from 'react';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from '@material-ui/core/IconButton';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles.css';
import { useHistory } from 'react-router-dom'

const ArrowBack = (): JSX.Element => {
    let history = useHistory();

    return (
        <IconButton className="arrow-back" aria-label="voltar" onClick={() => history.goBack()}>
            <ArrowBackIcon color="action" />
        </IconButton>
    )
}

export default ArrowBack