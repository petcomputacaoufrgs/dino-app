//import './styles.css'
import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { Avatar, Typography, IconButton } from '@material-ui/core'
import { Card, CardHeader, CardContent } from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import ContactItemModel from "../../../model/ContactItemModel";
import { red, pink, purple, blue, green } from '@material-ui/core/colors';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            maxWidth: 345,
        },
        red: {
            backgroundColor: red[500],
        },
        pink: {
            backgroundColor: pink[500],
        },
        purple: {
            backgroundColor: purple[500],
        },
        blue: {
            backgroundColor: blue[500],
        },
        green: {
            backgroundColor: green[500],
        },
    }),
);

const ContactItem = (props: ContactItemModel): JSX.Element => {

    const classes = useStyles(props)

    return (
        <Card className={classes.root}>
            <CardHeader
                avatar={<Avatar aria-label="recipe" className={classes[props.color]}>{props.name[0]}</Avatar>}
                action={<IconButton aria-label="settings"><MoreVert /></IconButton>}
                title={props.name}
                subheader={props.number}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {props.info}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default ContactItem