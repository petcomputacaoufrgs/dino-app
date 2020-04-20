//import './styles.css'
import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import GamesIcon from '@material-ui/icons/Games';
import Divider from '@material-ui/core/Divider';


//(props: {  items: Array<GlossaryItemModel> })

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            backgroundColor: theme.palette.background.paper,
        },
    }),
);

const ContactItems = (props): JSX.Element => {

    return (
        <List className={useStyles().root}>
            {props.items.map(item =>
                <ListItem>
                    <ListItemAvatar>
                        <Avatar><GamesIcon /></Avatar>
                    </ListItemAvatar>
                    <ListItemText primary={item.name} secondary={item.number} />
                </ListItem>
            )}
        </List>
    )
}


export default ContactItems