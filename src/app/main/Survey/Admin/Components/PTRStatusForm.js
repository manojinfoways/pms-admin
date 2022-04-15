import {MenuItem} from "@mui/material";
import {TextField} from "@material-ui/core";
import * as React from "react";
import {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {Update} from "@material-ui/icons";
import Button from "@material-ui/core/Button";
import axios from "axios";
import {showError, showSuccess} from "app/utils/helpers";
import clsx from "clsx";

const useStyles = makeStyles({
    customLabel: {
        "& label": {
            fontSize: "12px"
        },
    },
    customOption: {
        fontSize: "12px !important"
    },
    customButton: {
        width: "255px"
    }
});

const PTRStatus = [
    {label: "Draft", name: "Draft"},
    {label: "Submitted", name: "Submitted"},
    {label: "Assigned", name: "Assigned"},
    {label: "Cancelled/Deleted", name: "Deleted"},
    {label: "Final Admin Review", name: "Final Admin Review"},
    {label: "Completed", name: "Completed"}
]

const PTRStatusForm = (props) => {

    const [status, setStatus] = useState('');

    const classes = useStyles(props);

    useEffect(() => {
        setStatus(props.ptrStatus);
    }, [props]);

    const handleUpdate = () => {
        if (props.ptrStatus !== status) {
            axios.post('/requests/changePTRStatus', {
                request_id: props.ptrId,
                status: status
            }).then(res => {
                showSuccess(res.data.message);
                props.fetchData(props.ptrId);
            }).catch(error => {
                showError(error?.response?.data?.message);
            })
        }
    }

    return (
        <>
            <TextField
                classes={{root: classes.customLabel}}
                label="PTR Status"
                variant="outlined"
                className="mr-12 w-full"
                required
                select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                InputLabelProps={{
                    shrink: true
                }}
            >
                {PTRStatus.map(status => (
                    <MenuItem key={status.name} classes={{root: classes.customOption}} value={status.name}>{status.label}</MenuItem>
                ))}
            </TextField>
            <Button
                className={clsx("whitespace-nowrap mx-4", classes.customButton)}
                variant="contained"
                color="secondary"
                size="large"
                disabled={props.ptrStatus === status}
                startIcon={<Update />}
                onClick={handleUpdate}
            >
                Update Status
            </Button>
        </>
    )
}

export default PTRStatusForm