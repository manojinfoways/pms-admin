import {useDispatch} from "react-redux";
import {useEffect, useMemo, useState} from "react";
import history from "@history";
import {setToolbarHeader} from "app/store/fuse/toolbarHeaderSlice";
import MUIDataTable from "mui-datatables";
import {ChatOutlined, CloudDownloadOutlined, Print} from "@material-ui/icons";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import {CircularProgress, Tooltip} from "@material-ui/core";
import DocumentStatusChip from "app/shared-components/DocumentStatusChip";
import Typography from "@material-ui/core/Typography";
 import {showError} from "app/utils/helpers";

const columns = [
    {
        name: 'actions',
        label: 'Actions',
        options: {
            filter: false,
            sort: false,
            download: false,
            print: false,
            setCellProps: () => ({style: {minWidth: '100px'}}),
        }
    },
    {
        name: "E-File Id",
        label: "E-File Id",
        options: {
            filter: true,
            sort: true,
            setCellProps: (cellValue) => ({
                style: {
                    minWidth: '100px',
                    cursor: 'pointer'
                },
                onClick: () => history.push(`/dlm/details/${cellValue}`)
            }),
        }
    },
    {
        name: 'E-File Description',
        label: 'E-File Description',
        options: {
            filter: true,
            sort: true,
            setCellProps: () => ({style: {minWidth: "100px"}}),
        }
    },
    {
        name: 'Doc Type',
        label: 'Doc Type',
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: "Contact No",
        label: "Contact No",
        options: {
            filter: true,
            sort: true,
            setCellProps: () => ({style: {minWidth: '130px'}}),
        }
    },
    {
        name: "Qty",
        label: "Qty",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "Status",
        label: "Status",
        options: {
            filter: true,
            sort: true,
        }
    },
    {
        name: "Status date",
        label: "Status Date",
        options: {
            filter: true,
            sort: true,
        }
    },
];

const useStyles = makeStyles({
    dark1Background: {
        backgroundColor: "rgba(200,200,200,0.5)"
    },
    dark2Background: {
        '&:hover': {
            backgroundColor: "rgba(200,200,200,1)"
        }
    },
    red: {
        backgroundColor: "#FF0000",
        color: "white"
    },
    green: {
        backgroundColor: "#50C878",
        color: "white"
    }
})

const MainDLMDashboard = (props) => {

    const [DLMEFile, setDLMEFile] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const [isChatPopUpOpen, setIsChatPopUpOpen] = useState(false);
    const [chatRequestData, setChatRequestData] = useState({});

    const classes = useStyles(props);
    const dispatch = useDispatch();

    const options = useMemo(() => ({
        filter: true,
        filterType: 'multiselect',
        tableBodyMaxHeight: 'calc(100vh - 280px)',
        rowsPerPage: 100,
        fixedHeader: true,
        selectableRows: "none",
        draggableColumns: {
            enabled: true,
            transitionTime: 300,
        },
        downloadOptions: {
            filename: 'E-Filing.csv',
            separator: ','
        },
        setRowProps: (row, dataIndex, rowIndex) => {
            const properties = {class: classes.dark2Background}
            if (rowIndex % 2 === 0) {
                properties["class"] = clsx(properties["class"], classes.dark1Background)
            }
            return properties
        },
    }), [classes]);

    useEffect(() => {
        dispatch(setToolbarHeader("DLM Reviewer Dashboard"));
        setIsLoading(true)
        axios.post('/request/efile_list')
            .then(response => {
                setDLMEFile(response.data.result.map(row => [
                        <div className="flex">
                            <Tooltip title="Download"><CloudDownloadOutlined className="cursor-pointer"/></Tooltip>
                            <Tooltip title="Print"><Print className="cursor-pointer"/></Tooltip>
                            <Tooltip title="Chat"><ChatOutlined className="cursor-pointer"
                                                                onClick={() => openChatPopUp(row)}/></Tooltip>
                        </div>,
                        row.req_id,
                        row.description,
                        _.startCase(_.toLower(row.efile_type)),
                        "",
                        row.documents.length,
                        <DocumentStatusChip label={row.status}/>,
                        new Date(row.updated_at).toLocaleDateString(),
                    ]
                ));
                setIsLoading(false);
            })
            .catch(error => {
                setIsLoading(false);
                showError(error.response?.data?.message)
            })
    }, []);

    const openChatPopUp = (data) => {
        setChatRequestData(data);
        setIsChatPopUpOpen(true);
    }

    return (
        <div className="mx-20 my-20">
            <MUIDataTable
                title={
                    <Typography variant="h6">
                        E-File Listing
                        {isLoading &&
                            <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}}/>}
                    </Typography>
                }
                data={DLMEFile}
                columns={columns}
                options={options}
            />
            
        </div>
    )
}

export default MainDLMDashboard;