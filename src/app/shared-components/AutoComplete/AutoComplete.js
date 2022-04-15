import React, {useEffect, useState} from 'react';
import classes from './AutoComplete.module.css';

import {Autocomplete, TextField} from '@mui/material';

const AutoComplete = props => {
  const [value, setValue] = React.useState(props.question.answer);
  const [answerChoices, setAnswerChoices] = useState([]);

  const handleChange = (event, newValue) => {
    console.log('On change ', newValue);
  };
  useEffect(() => {
    let answers = [];
    props.question.question_choices.map(choice => {
      answers.push({label: choice.title, value: choice.id});
    });
    setAnswerChoices(answers);
  }, []);

  return (
    <div>
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={answerChoices}
        onChange={handleChange}
        sx={{
          width: '100%',
          border: '1px solid',
          borderRadius: '0.5rem',
          borderColor: 'lightgray',
          boxShadow: '0px 0px 2px rgb(0 0 0 / 20%)',
        }}
        renderInput={params => (
          <TextField {...params} label="" InputLabelProps={{shrink: false}} />
        )}
      />
    </div>
  );
};

export default AutoComplete;
