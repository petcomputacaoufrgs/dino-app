import React, { forwardRef } from 'react';
import { Avatar, Typography, IconButton } from '@material-ui/core'
import { Card, CardHeader, CardContent } from '@material-ui/core'
import { MoreVert } from '@material-ui/icons'
import { useStyles } from '../contact_items'
import ContactItemProps from "./props";

const ContactItem = forwardRef((props: ContactItemProps, ref): JSX.Element => {

    const classes = useStyles(props)

    return (
        <Card className={classes.card} ref={ref}>
            <CardHeader
                avatar={<Avatar aria-label="recipe" className={classes[props.item.color]}>{props.item.name[0]}</Avatar>}
                action={<IconButton aria-label="settings"><MoreVert /></IconButton>}
                title={props.item.name}
                subheader={props.item.number}
            />
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    {props.item.info}
                </Typography>
            </CardContent>
        </Card>
    )
})

export default ContactItem