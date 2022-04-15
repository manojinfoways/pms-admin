import React, { useState } from "react";
import classes from "./MultiChoice.module.css";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextInput from "../TextInput/TextInput";

const MultiChoice = (props) => {
  let selectedChoices = props.question.answer
    ? props.question.answer.split(",")
    : [];

  let updatedChoices = props.question.question_choices.map((ch) => {
    return { ...ch, checked: selectedChoices.includes(ch.id.toString()) };
  });

  let otherChoiceIndex = updatedChoices.findIndex((ch) => ch.title === "Other");
  let otherChoice;
  if (otherChoiceIndex !== -1) {
    otherChoice = updatedChoices[otherChoiceIndex];
  }

  const [choices, setChoices] = useState(updatedChoices);

  const [otherText, setOtherText] = useState("");

  const [showOther, setShowOther] = useState(
    otherChoice ? otherChoice.checked : false
  );

  const handleChange = (choice) => {
    if (props.disabled) return;

    let updatedChoice = { ...choice };

    console.log("updated choice ", choice);

    updatedChoice.checked = updatedChoice.checked
      ? !updatedChoice.checked
      : true;

    let updatedChoices = [...choices];

    updatedChoices = updatedChoices.map((ch) => {
      return ch.id === choice.id ? updatedChoice : ch;
    });
    setChoices(updatedChoices);

    let otherChoiceIndex = updatedChoices.findIndex(
      (ch) => ch.title === "Other"
    );

    if (otherChoiceIndex !== -1) {
      const otherChoice = updatedChoices[otherChoiceIndex];

      setShowOther(otherChoice.checked);
    }
    let selectedChoices = updatedChoices.filter((ch) => ch.checked === true);
    let selectedChoicesIds = Array.prototype.map
      .call(selectedChoices, function (item) {
        return item.id;
      })
      .join(",");
    props.onSelect(selectedChoicesIds);
  };

  const onInputChangedHandler = (text) => {
    props.onOther(text);
  };
  return (
    <div>
      {choices.map((choice) => {
        return (
          <div
            key={choice.id}
            className={classes.container}
            onClick={() => handleChange(choice)}
          >
            <div key={choice.id} className={classes.subcontainer}>
              <Checkbox
                checked={choice.checked ? choice.checked : false}
                onChange={() => handleChange(choice)}
              />
              <div>{choice.title}</div>
            </div>
          </div>
        );
      })}
      {showOther && (
        <div>
          <TextInput
            question={props.question}
            onChange={onInputChangedHandler}
            other
            otherText={props.question.otherText}
          />
          <div style={{ height: "1rem" }} />
        </div>
      )}
    </div>
  );
};

export default MultiChoice;
