import React from 'react';
import DesktopDatePicker from '@mui/lab/DesktopDatePicker';
import MobileDatePicker from '@mui/lab/MobileDatePicker';
import TextField from '@mui/material/TextField';
import DateAdapter from '@mui/lab/AdapterMoment';
import moment from 'moment';
import classes from './DateControl.module.css';
import {InputAdornment, Icon} from '@mui/material';
import {Event} from '@mui/icons-material';

import LocalizationProvider from '@mui/lab/LocalizationProvider';
const DateControl = props => {
  const [value, setValue] = React.useState(new Date());

  const handleChange = newValue => {
    setValue(newValue);

    props.onChange(moment(newValue.toDate()).format('YYYY-MM-DD'));
  };

  return (
    <LocalizationProvider dateAdapter={DateAdapter}>
      <MobileDatePicker
        value={value}
        onChange={handleChange}
        className={classes.date_input}
        maxDate={moment()}
        renderInput={params => (
          <TextField
            {...params}
            label=""
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Event />
                  {/* <Icon>DateRangeRounded</Icon> */}
                </InputAdornment>
              ),
            }}
            InputLabelProps={{shrink: false}}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default DateControl;
