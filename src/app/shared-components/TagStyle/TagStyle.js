import React, {useState} from 'react';
import classes from './TagStyle.module.css';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const TagStyle = (props) => {
  const [selected, setSelected] = useState(parseInt(props.question.answer));

  const handleChange = (choice) => {
    if (props.disabled) return;

    console.log('Selected ', choice.id);
    setSelected(choice.id);
    props.onSelect(choice.id);
  };
  return (
    <div className={classes.tagcontainer}>
      {props.question.question_choices.map((choice) => {
        return (
          <div key={choice.id}>
            <div
              className={
                classes.container +
                (choice.id === selected ? ' ' + classes.selected : '')
              }
              onClick={() => handleChange(choice)}>
              {choice.title}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TagStyle;
