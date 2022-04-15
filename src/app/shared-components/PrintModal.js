import {Backdrop, Box, Fade, Modal, Checkbox, label, Button, FormControlLabel} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {useEffect, useRef, useState} from "react";
import SimpleTable from "./SimpleTable";
import Print from "./Print";
import {PrintOutlined} from "@material-ui/icons";

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
    choices: {
      maxHeight: "60vh",
      overflowY: "scroll"
    },
    checkBox: {
        marginBottom: "10px",
        width: '30%',
        justifyContent: 'flex-start',
        alignItems:'flex-start',
        '& span': {
            display: 'flex',
            alignItems: 'center',
            paddingTop: '0',
            '&:last-child':{
                top:'-10px',
                width: '100%',
                alignItems: 'flex-start',
                height: '40px',
                overflow: 'hidden',
                display: '-webkit-box',
                '-webkit-line-clamp': '2',
                '-webkit-box-orient': 'vertical'
            },
        },
    }
}))

const PrintModal = ({ openModal, setOpenModal, children, ...props }) => {

    const classes = useStyles(props)
    const printRef = useRef();
    const [checked,setChecked] = useState([]);
    const [checkedIndex, setCheckedIndex] = useState([]);

    useEffect(() => {
        setChecked(props.columns.map((col, i) => ({name: col.name, id: i})))
        setCheckedIndex(props.columns.map((col, i) => i))
    }, [props.columns])

    const handleClose = () => setOpenModal(false);

    const handleInputChange = (e, index) => {
        if(e.target.checked){
            setChecked(prev => [...prev, {name: e.target.value, id: index}])
            setCheckedIndex(prev => [...prev, index])
        }
        else{
            setChecked(prev => prev.filter(col => col.name!==e.target.value))
            setCheckedIndex(prev => prev.filter(rowIndex => rowIndex!==index))
        }
    }

    return (
        <Modal
            open={openModal}
            onClose={handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 200,
                onDragOver: e => e.preventDefault(),
                onDrop: e => e.preventDefault()
            }}
        >
            <Fade in={openModal}>
                <Box className={clsx(props.className, classes.container, "rounded-12")}>
                    <h2>Show Columns</h2><br/>
                    <div className={classes.choices}>
                    {props.columns.map((i, index) => [
                            <FormControlLabel
                                className={classes.checkBox}
                                label={i.name}
                                control={
                                    <Checkbox
                                        checked={checked.filter(col => col.name === i.name).length}
                                        value={i.name}
                                        onChange={(e) => handleInputChange(e, index)}
                                    />
                                }
                            />]
                    )}
                    </div>
                    <br/>
                    <div className="my-50 w-full flex justify-center">
                        <Button variant="contained" color="secondary" startIcon={<PrintOutlined/>} size="large" onClick={() => printRef.current.printData()}>
                            Print
                        </Button>
                    </div>
                     <Print
                        ref={printRef}
                        title={props.title}
                        subTitle={props.subTitle}
                    >
                         {checked && <SimpleTable
                            columns={checked.sort((a,b) => a.id - b.id) }
                            rows={props.rows.map(row => row.filter((r,i) => checkedIndex.includes(i)))}
                            isLoading={props.isLoading}
                        />}
                    </Print>
                </Box>
            </Fade>
        </Modal>
    )
}

export default PrintModal;