import React, {useState} from 'react';
import classes from './TagStyleMultiple.module.css';
import TextInput from '../TextInput/TextInput';

const TagStyleMultiple = props => {
  let selectedChoices = props.question.answer
    ? props.question.answer.split(',')
    : [];

  let updatedChoices = props.question.question_choices.map(ch => {
    return {...ch, checked: selectedChoices.includes(ch.id.toString())};
  });

  let otherChoiceIndex = updatedChoices.findIndex(ch => ch.title === 'Other');
  let otherChoice;
  if (otherChoiceIndex !== -1) {
    otherChoice = updatedChoices[otherChoiceIndex];
  }

  const [choices, setChoices] = useState(updatedChoices);

  const [otherText, setOtherText] = useState('');

  const [showOther, setShowOther] = useState(
    otherChoice ? otherChoice.checked : false,
  );

  const handleChange = choice => {
    let updatedChoice = {...choice};

    console.log('updated choice ', choice);

    updatedChoice.checked = updatedChoice.checked
      ? !updatedChoice.checked
      : true;

    let updatedChoices = [...choices];

    updatedChoices = updatedChoices.map(ch => {
      return ch.id === choice.id ? updatedChoice : ch;
    });
    setChoices(updatedChoices);

    let otherChoiceIndex = updatedChoices.findIndex(ch => ch.title === 'Other');

    if (otherChoiceIndex !== -1) {
      const otherChoice = updatedChoices[otherChoiceIndex];

      setShowOther(otherChoice.checked);
    }
    let selectedChoices = updatedChoices.filter(ch => ch.checked === true);
    let selectedChoicesIds = Array.prototype.map
      .call(selectedChoices, function(item) {
        return item.id;
      })
      .join(',');
    props.onSelect(selectedChoicesIds);
  };

  const onInputChangedHandler = text => {
    props.onOther(text);
  };
  return (
    <div>
      <div className={classes.tagcontainer}>
        {choices.map(choice => {
          return (
            <div
              key={choice.id}
              className={
                classes.container +
                (choice.checked ? ' ' + classes.selected : '')
              }
              onClick={() => handleChange(choice)}>
              {choice.title}
            </div>
          );
        })}
      </div>
      {showOther && (
        <div>
          <TextInput
            question={props.question}
            onChange={onInputChangedHandler}
            other
            otherText={props.question.otherText}
          />
          <div style={{height: '1rem'}} />
        </div>
      )}
    </div>
  );
};

export default TagStyleMultiple;
