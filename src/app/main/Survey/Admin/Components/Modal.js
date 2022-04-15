import React from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  IconButton,
  useStyles,
} from "@material-ui/core";
import CloseIcon from "@material-ui/icons/Close";

let closeImg = {
  cursor: "pointer",
  float: "right",
  marginTop: "5px",
  width: "20px",
};

const ModalCustom = (props) => {
  const {
    open,
    handleClose,
    fullWidth = false,
    maxWidth = "md",
    closeButton = false,
  } = props;

  return (
    <Dialog
      fullWidth={fullWidth}
      maxWidth={maxWidth}
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      {closeButton && (
        <DialogTitle id="id" style={{ padding: "0 !important" }}>
          <Box display="flex" justifyContent="flex-end">
            <Box>
              <IconButton onClick={handleClose}>
                <CloseIcon />
              </IconButton>
            </Box>
          </Box>
        </DialogTitle>
      )}
      {props.children}
    </Dialog>
  );
};

export default ModalCustom;
