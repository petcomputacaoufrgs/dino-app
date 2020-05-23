import { makeStyles, createStyles } from '@material-ui/core/styles'

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
    }
  }),
)

export default useStyles