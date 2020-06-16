import React from 'react'
import Chip from '@material-ui/core/Chip'
import Paper from '@material-ui/core/Paper'
import TagListProps from './props'
import './styles.css'

const TagList = (props: TagListProps): JSX.Element => {
  return (
    <Paper className="tag_list" component="ul">
      {props.tagList.map((tag, index) => (
        <li key={index}>
          <Chip label={tag} />
        </li>
      ))}
    </Paper>
  )
}

export default TagList
