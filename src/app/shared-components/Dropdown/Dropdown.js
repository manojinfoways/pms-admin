import React from "react";
import classes from "./Dropdown.module.css";
import FormControl from "@mui/material/FormControl";
import { TextField, MenuItem } from "@mui/material";

const Dropdown = (props) => {
  const [value, setValue] = React.useState(props.question.answer);

  const handleChange = (event) => {
    setValue(event.target.value);
    props.onChange(event.target.value);
  };

  return (
    <TextField
      id={props.question.id}
      select
      value={value}
      className={classes.dropdown}
      label=""
      variant="outlined"
      InputLabelProps={{ shrink: false }}
      disabled={props.disabled}
      onChange={handleChange}
    >
      {props.question.question_choices.map((choice) => {
        return (
          <MenuItem value={choice.id} key={choice.id}>
            {choice.title}
          </MenuItem>
        );
      })}
    </TextField>
  );
};

export default Dropdown;
