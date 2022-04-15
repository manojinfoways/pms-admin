import React, {useState} from 'react';
import classes from './SingleChoice.module.css';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

const SingleChoice = (props) => {
  const [selected, setSelected] = useState(parseInt(props.question.answer));

  const handleChange = (choice) => {
    if (props.disabled) return;

    console.log('Selected ', choice.id);

    setSelected(choice.id);
    props.onSelect(choice.id);
  };
  return (
    <div>
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

      {/* <FormControl component="fieldset">
        <RadioGroup
          aria-label="gender"
          //   defaultValue="female"
          name="radio-buttons-group">
          {props.question.question_choices.map(choice => {
            return (
              <FormControlLabel
                key={choice.id}
                value={choice.id}
                control={<Radio />}
                label={choice.title}
              />
            );
          })}
        </RadioGroup>
      </FormControl> */}
    </div>
  );
};

export default SingleChoice;
