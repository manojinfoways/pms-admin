import React from "react";
import classes from "./TextArea.module.css";

import { TextareaAutosize } from "@mui/material";

const TextArea = (props) => {
  const [value, setValue] = React.useState(props.question.answer);

  const handleChange = (event) => {
    setValue(event.target.value);
    props.onChange(event.target.value);
  };

  return (
    <TextareaAutosize
      id={props.question.id}
      minRows={3}
      maxRows={7}
      value={value}
      onChange={handleChange}
      className={classes.text_area}
    />
  );
};

export default TextArea;
