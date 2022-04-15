import React, {useEffect, useState} from 'react';
import {TextField} from "@material-ui/core";
import axios from "axios";
import {showError} from "app/utils/helpers";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
       priority:{
           width: '60px'
       }
    }
)

const Priority = (props) => {

    const [priorityNo, setPriorityNo] = useState(props.row.priority_no);
    const [isLoading, setIsLoading] = useState(false);
    const classes = useStyles()

    useEffect(() => {
        setPriorityNo(props.row.priority_no)
    }, [props.row]);

    const updatePriority = () => {
        setIsLoading(true);
        axios.post('/updateDocPriority', {
            "priority_no": priorityNo,
            "request_id": props.row.ptr_request_id,
            "doc_record_id": props.row.doc_record_id
        }).then(res => {
            if (res.status)
                props.fetchData(props.ptrId);
            setIsLoading(false);
        }).catch(error => {
            showError(error?.response?.data?.message);
            setIsLoading(false);
        });
    }

    return (
        <TextField
            label="Priority"
            id="priority_no"
            variant="outlined"
            type="number"
            disabled={isLoading || props.isDisabled}
            value={priorityNo}
            className={classes.priority}
            onChange={e => setPriorityNo(parseInt(e.target.value) >= 0 ? parseInt(e.target.value) : 0)}
            InputLabelProps={{
                shrink: true,
            }}
            onKeyPress={(e) => e.key === 'Enter' && updatePriority()}
        />
    )
};

export default Priority;