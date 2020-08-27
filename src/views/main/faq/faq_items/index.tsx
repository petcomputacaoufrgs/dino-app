import './styles.css'
import React from 'react'
import FaqItemsProps from './props'
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Divider from '@material-ui/core/Divider';


const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      width: '100%',
    },
    heading: {
      fontSize: theme.typography.pxToRem(15),
      fontWeight: theme.typography.fontWeightRegular,
    },
  }),
);

const FaqItems = ({items, title}: FaqItemsProps): JSX.Element => {
  const classes = useStyles();

  return(
      <div className='faq-items'>
        <div className='faq-items__title'>
          <Typography>{title}</Typography>
          <Divider/>
        </div>
      {items.map(item => (
            <Accordion key={item.id}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography className={classes.heading}>{item.question.toUpperCase()}</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  {item.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
      ))}
      </div>
  )
}

export default FaqItems
