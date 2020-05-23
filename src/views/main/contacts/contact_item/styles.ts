import { red, pink, purple, blue, green } from '@material-ui/core/colors'
import { makeStyles, createStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(() =>
    createStyles({
        red: { backgroundColor: red[500] },
        pink: { backgroundColor: pink[500] },
        purple: { backgroundColor: purple[500] },
        blue: { backgroundColor: blue[500] },
        green: { backgroundColor: green[500] },

        card: {
            maxWidth: '70%',
            outline: 0,
        },
    }),


)

export default useStyles