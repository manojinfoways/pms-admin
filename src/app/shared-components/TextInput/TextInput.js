import React from "react";
import classes from "./TextInput.module.css";

const TextInput = (props) => {
  const [value, setValue] = React.useState(
    props.other ? props.otherText : props.question.answer
  );

  const handleChange = (event) => {
    setValue(event.target.value);
    props.onChange(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        id={props.question.id}
        className={classes.input}
        value={value}
        disabled={props.disabled}
        onChange={handleChange}
      />
    </div>
  );
};

export default TextInput;
