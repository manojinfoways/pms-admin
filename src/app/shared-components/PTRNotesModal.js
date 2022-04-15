import {DialogContent, DialogTitle} from "@material-ui/core";
import CustomModal from "./CustomModal";
import * as React from "react";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    notes: {
        '& ul': {
            listStyle: "revert"
        },
        '& ol': {
            listStyle: "revert"
        },
    }
});

const PTRNotesModal = (props) => {

    const classes = useStyles(props);

    return (
        <CustomModal
            openModal={props.openModal}
            setOpenModal={props.setOpenModal}
            className="bg-grey-200"
        >
            <div style={{minWidth: '35vw', minHeight: '35vh'}}>
                <DialogTitle>
                    PTR NOTE: {props.data.property_descriptor}
                </DialogTitle>
                <DialogContent style={{maxHeight: "70vh"}}>
                    <div className={classes.notes} dangerouslySetInnerHTML={{__html: props.data.admin_notes}}/>
                </DialogContent>
            </div>
        </CustomModal>
    )

}

export default PTRNotesModal;