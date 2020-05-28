import { makeStyles, createStyles } from '@material-ui/core/styles'
import { red, pink, purple, blue, green } from '@material-ui/core/colors'

const useStyles = makeStyles(() =>
  createStyles({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      outline: 0,
    },
    list: {
      width: '100%',
      padding: '0px 5px 5px',
    },
    card: {
      maxWidth: '70%',
      outline: 0,
    },
    red: { backgroundColor: red[500] },
    pink: { backgroundColor: pink[500] },
    purple: { backgroundColor: purple[500] },
    blue: { backgroundColor: blue[500] },
    green: { backgroundColor: green[500] },
  })
)

export default useStyles
