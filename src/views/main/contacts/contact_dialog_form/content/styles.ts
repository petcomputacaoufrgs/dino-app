import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
  selector: {
    marginTop: 8,
    marginBottom: 4,
  },
})

export default useStyles
