import Chip from "@material-ui/core/Chip";
import {makeStyles} from "@material-ui/core/styles";

const DocumentStatusMapper = {
    "draft": "grey",
    "submitted": "green",
    "cancelled": "red",
    "correction_required": "red"
}

const useStyles = makeStyles({
    red: {
        backgroundColor: "#FF0000",
        color: "white"
    },
    green: {
        backgroundColor: "#50C878",
        color: "white"
    },
    grey: {
        backgroundColor: "rgba(200,200,200,0.5)",
        color: "black"
    }
})

const DocumentStatusChip = (props) => {

    const classes = useStyles();

    return (
        <Chip className={classes[DocumentStatusMapper[props.label.toLowerCase()]]} label={_.startCase(props.label)} />
    )
}

export default DocumentStatusChip