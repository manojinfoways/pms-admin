import React from 'react';
import {Typography} from '@mui/material';
import classes from './Question.module.css';

import DateControl from '../DateControl/DateControl';
import SingleChoice from '../SingleChoice/SingleChoice';
import MultiChoice from '../MultiChoice/MultiChoice';
import TagStyle from '../TagStyle/TagStyle';
import TagStyleMultiple from '../TagStyleMultiple/TagStyleMultiple';

import TextInput from '../TextInput/TextInput';
import AutoComplete from '../AutoComplete/AutoComplete';
import TextArea from '../TextArea/TextArea';
import Dropdown from '../Dropdown/Dropdown';

const Question = (props) => {
  const onInputChangedHandler = (text) => {
    const questionUpdated = {...props.data};
    questionUpdated.answer = text !== '' ? text : null;
    props.onAnswer(questionUpdated);
  };

  const onChoiceChangedHandler = (text) => {
    const questionUpdated = {...props.data};
    questionUpdated.answer = text;
    props.onAnswer(questionUpdated);
  };

  const onOtherTextChangedHandler = (text) => {
    const questionUpdated = {...props.data};
    questionUpdated.otherText = text;
    props.onAnswer(questionUpdated);
  };

  return (
    <div className={classes.fullWidth}>
      <Typography style={{fontSize: '1rem', fontWeight: '500'}}>
        {props.data ? props.data.title : ''}
      </Typography>
      <div className={classes.container}>
        {props.data.questionTypeId && props.data.questionTypeId === 1 && (
          <TextInput
            question={props.data}
            onChange={onInputChangedHandler}
            disabled={props.disabled}
          />
        )}
        {props.data.question_type &&
          props.data.question_type.title === 'TEXT_AREA' && (
            <TextArea
              question={props.data}
              onChange={onInputChangedHandler}
              disabled={props.disabled}
            />
          )}
        {props.data.questionTypeId && props.data.questionTypeId === 2 && (
          <DateControl
            question={props.data}
            onChange={onInputChangedHandler}
            disabled={props.disabled}
          />
        )}

        {props.data.questionTypeId && props.data.questionTypeId === 3 && (
          <SingleChoice
            question={props.data}
            onSelect={onChoiceChangedHandler}
            disabled={props.disabled}
          />
        )}
        {props.data.questionTypeId && props.data.questionTypeId === 10 && (
          <TagStyle
            question={props.data}
            onSelect={onChoiceChangedHandler}
            disabled={props.disabled}
          />
        )}

        {props.data.questionTypeId && props.data.questionTypeId === 11 && (
          <TagStyleMultiple
            question={props.data}
            onSelect={onChoiceChangedHandler}
            onOther={onOtherTextChangedHandler}
          />
        )}
        {props.data.questionTypeId && props.data.questionTypeId === 4 && (
          <MultiChoice
            question={props.data}
            onSelect={onChoiceChangedHandler}
            onOther={onOtherTextChangedHandler}
            disabled={props.disabled}
          />
        )}
        {props.data.question_type &&
          props.data.question_type.title === 'AUTO_COMPLETE' && (
            <AutoComplete
              question={props.data}
              onChange={onInputChangedHandler}
              disabled={props.disabled}
            />
          )}
        {props.data.questionTypeId && props.data.questionTypeId === 8 && (
          <Dropdown
            question={props.data}
            onChange={onInputChangedHandler}
            disabled={props.disabled}
          />
        )}
        {props.data.question_type &&
          props.data.question_type.title !== 'TEXT_INPUT' &&
          props.data.question_type.title !== 'TEXT_AREA' &&
          props.data.question_type.title !== 'DATE' &&
          props.data.question_type.title !== 'RADIO' &&
          props.data.question_type.title !== 'TAG' &&
          props.data.question_type.title !== 'TAG_MULTIPLE' &&
          props.data.question_type.title !== 'CHECKBOX' &&
          props.data.question_type.title !== 'AUTO_COMPLETE' &&
          props.data.question_type.title !== 'DROP_DOWN' &&
          props.data.question_type.title !== 'LABEL' && (
            <div>{props.data.question_type.title}</div>
          )}
      </div>

      {/*  */}
    </div>
  );
};

export default Question;
