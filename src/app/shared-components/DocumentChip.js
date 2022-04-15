import {useDispatch, useSelector} from "react-redux";
import {makeStyles} from "@material-ui/core/styles";
import {Chip} from "@material-ui/core";
import {closeDialog} from "app/store/fuse/dialogSlice";
import {useState} from "react";
import CustomModal from "app/shared-components/CustomModal";
import AdminRecordDataForm from "app/main/Survey/Admin/PTRAssociatedProperty/Components/RecordDataForm";
import clsx from "clsx";
import Icon from "@material-ui/core/Icon";

const TransactionClassMapper = {
    Mortgage: "M",
    Ownership: "OT",
    Other: "O",
};

const PTRReportStatusMapper = {
    CHAIN_TITLE: "purple",
    EXCEPTION: "red",
    DOC_INFO: "blue",
    LEGACY_PTR: "orange",
    NAME_CHECK: "pink",
    DEFAULT: "default",
};

const useStyles = makeStyles((theme) => ({
    docContainer: {
        minWidth: "150px"
    },
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
    badge: {
        borderRadius: "50%",
        backgroundColor: "white",
        color: "black",
        height: "23px",
        width: "23px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    red: {
        backgroundColor: "#DA4B52",
        cursor: "pointer",
        marginBottom: "4px",
        width: "120px",
        display: "flex",
        transition: "all 0.2s",
        justifyContent: "flex-start",
        "& span": {
            display: "flex",
            alignItems: "center",
        },
    },
    orange: {
        backgroundColor: "#ED7D31FF",
        cursor: "pointer",
        marginBottom: "4px",
        width: "120px",
        display: "flex",
        transition: "all 0.2s",
        justifyContent: "flex-start",
        "& span": {
            display: "flex",
            alignItems: "center",
        },
    },
    blue: {
        backgroundColor: "#A7E0F5",
        cursor: "pointer",
        marginBottom: "4px",
        minWidth: "25px",
        width: "120px",
        display: "flex",
        transition: "all 0.2s",
        justifyContent: "flex-start",
        "& span": {
            display: "flex",
            alignItems: "center",
        },
    },
    purple: {
        backgroundColor: "#6275b3",
        color: "#ffffff",
        cursor: "pointer",
        marginBottom: "4px",
        width: "120px",
        display: "flex",
        transition: "all 0.2s",
        justifyContent: "flex-start",
        "& span": {
            display: "flex",
            alignItems: "center",
        },
    },
    pink: {
        backgroundColor: "#FF9B8E",
        cursor: "pointer",
        marginBottom: "4px",
        width: "120px",
        display: "flex",
        transition: "all 0.2s",
        justifyContent: "flex-start",
        "& span": {
            display: "flex",
            alignItems: "center",
        },
    },
    selectedChip: {
        border: "2px solid #598f63",
        backgroundColor: "#59B16A",
        color: "#000",
        cursor: "pointer",
        marginBottom: "4px",
        width: "120px",
        display: "flex",
        justifyContent: "flex-start",
        transition: "all 0.2s",
        transform: "scale(1.05)",
        boxShadow: "0 3px 10px rgb(0 0 0 / 0.5)",
        "& span": {
            display: "flex",
            alignItems: "center",
        },
    },
    width: {
        width: "48px",
    },
}));

const DocumentChip = ({openModal, isClickable = true, setOpenModal, children, ...props}) => {

    const classes = useStyles(props);
    const dispatch = useDispatch();
    const userRole = useSelector((state) => state.auth.user.role);

    const [recordDataModal, setRecordDataModal] = useState(false);
    const [recordData, setRecordData] = useState(null);

    const handleDocumentClick = (documentData) => {
        setRecordData(documentData);
        setRecordDataModal(true);
    };

    const refreshData = () => {
        props.fetchData(props.ptrId);
    };

    const onModalClose = (value) => {
        setRecordDataModal(value);
        if (!value) {
            dispatch(closeDialog())
        }
    };

    return (
        <>
            <div className={clsx("flex items-center", classes.docContainer)}>
                <Chip
                    className={clsx(classes[PTRReportStatusMapper[props.row.ptr_report_status]], props.isSelected ? classes.selectedChip : "")}
                    label={
                        <div className="flex items-center justify-center">
                            <span className={classes.width}>{props.row.docno}</span>
                            <span className={classes.badge}>
                            {TransactionClassMapper[props.row.transaction_class] || '-'}
                        </span>
                            {props.row.verified && <Icon className="ml-3">verified</Icon>}
                        </div>
                    }
                    clickable={false}
                    onClick={() => isClickable && handleDocumentClick(props.row)}
                />
            </div>
            <CustomModal
                openModal={recordDataModal}
                setOpenModal={onModalClose}
            >
                {userRole.includes('admin') && (
                    <AdminRecordDataForm
                        setOpenModal={onModalClose}
                        recordData={recordData}
                        refreshData={refreshData}
                    />
                )}
                
              
                
            </CustomModal>
        </>
    )
}

export default DocumentChip;