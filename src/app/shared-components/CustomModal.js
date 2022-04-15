import Backdrop from '@material-ui/core/Backdrop';
import Box from "@material-ui/core/Box";
import Fade from '@material-ui/core/Fade';
import Modal from "@material-ui/core/Modal";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";

const useStyles = makeStyles((theme) => ({
    container: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "auto",
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #555',
        padding: "3rem",
    },
}))

const CustomModal = ({ openModal, setOpenModal, children, ...props }) => {

    const classes = useStyles(props)

    const handleClose = () => setOpenModal(false);

    return (
        <Modal
            open={openModal}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500,
                onDragOver: e => e.preventDefault(),
                onDrop: e => e.preventDefault()
            }}
        >
            <Fade in={openModal}>
                <Box className={clsx(props.className, classes.container, "rounded-12")}>
                    {children}
                </Box>
            </Fade>
        </Modal>
    )
}

export default CustomModal;