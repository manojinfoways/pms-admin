import Backdrop from "@material-ui/core/Backdrop";
import Box from "@material-ui/core/Box";
import Fade from "@material-ui/core/Fade";
import Modal from "@material-ui/core/Modal";
import { makeStyles } from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
  container: {
    margin: "30px auto ",

    width: "90%",
    height: "95%",
    maxWidth: "90%",
    textAlign: "center",
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #555",
    padding: "3rem",
    overflow: "auto",
  },
}));

const CustomModalFull = ({ openModal, setOpenModal, children, ...props }) => {
  const classes = useStyles(props);

  const handleClose = () => setOpenModal(false);

  return (
    <Modal
      open={openModal}
      onClose={handleClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
        onDragOver: (e) => e.preventDefault(),
        onDrop: (e) => e.preventDefault(),
      }}
    >
      <Fade in={openModal}>
        <Box className={clsx(props.className, classes.container, "rounded-12")}>
          {children}
        </Box>
      </Fade>
    </Modal>
  );
};

export default CustomModalFull;
