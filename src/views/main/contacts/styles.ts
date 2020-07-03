import { makeStyles, createStyles } from '@material-ui/core/styles'
import { red, pink, purple, blue, green } from '@material-ui/core/colors'

const useStyles = makeStyles(() =>
  createStyles({
    iconButton: {
      //marginLeft: 5,
      padding: 5,
    },
    list: {
      width: '100%',
      padding: '0px 5px 5px',
    },
    CardContent: {
      paddingTop: 8,
      paddingBottom: 8,
    },
    DividerMargin: {
      marginTop: 5,
      marginBottom: 5,
    },
    ListItem: {
      padding: 5,
    },
    TextContact: {
      display: 'flex',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      textAlign: 'start',
    },
    red: { backgroundColor: red[500] },
    pink: { backgroundColor: pink[500] },
    purple: { backgroundColor: purple[500] },
    blue: { backgroundColor: blue[500] },
    green: { backgroundColor: green[500] },
  })
)

export default useStyles
