import * as React from "react";
import {useEffect, useMemo, useState} from "react";
import {useDispatch} from "react-redux";
import {CircularProgress, Tooltip, Typography} from '@material-ui/core';
import {setToolbarHeader} from "app/store/fuse/toolbarHeaderSlice";
import MUIDataTable from "mui-datatables";
import {LocalPrintshop} from "@material-ui/icons";
import DropDown from "app/shared-components/DropDown";
import axios from "axios";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import PrintModal from "app/shared-components/PrintModal";
import {showError} from "app/utils/helpers";
 
const columns = [
    {
        name: "Actions",
        label: "Actions",
        options: {
            filter: false,
            sort: false,
            download: false,
            print: false,
        },
    },
    {
        name: "PTR",
        label: "PTR",
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: "Property",
        label: "Property",
        options: {
            filter: true,
            sort: true,
            setCellProps: () => ({style: {minWidth: "150px"}}),
        },
    },
    {
        name: "Customer",
        label: "Customer",
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: "Type",
        label: "Type",
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: "Description",
        label: "Description",
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: "Status",
        label: "Status",
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: "Req Date",
        label: "Req Date",
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: "Assigned To",
        label: "Assigned To",
        options: {
            filter: true,
            sort: true,
        },
    },
];

const useStyles = makeStyles({
    dark1Background: {
        backgroundColor: "rgba(200,200,200,0.5)",
    },
    dark2Background: {
        "&:hover": {
            backgroundColor: "rgba(200,200,200,1)",
        },
    },
    printTitle: {
        background: '#f00',
        padding: '4px 15px',
        position: 'sticky',
        top: '0',
        left: '0',
        width: '100%',

        '& > h2': {
            fontSize: '20px',
            color: '#FFFFFF',
            fontWeight: 'bold',
            marginBottom: '0',
        },
    },
});

const PTRAdminDashboard = () => {

    const [adminPtrListing, setAdminPtrListing] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [printDataModal, setPrintDataModal] = useState(false);
    const [isChatPopUpOpen, setIsChatPopUpOpen] = useState(false);
    const [chatRequestData, setChatRequestData] = useState({});

    const dispatch = useDispatch();
    const classes = useStyles();

    const options = useMemo(() => ({
        filter: true,
        filterType: "multiselect",
        tableBodyMaxHeight: 'calc(100vh - 230px)',
        rowsPerPage: 100,
        tableBodyHeight: 'calc(100vh - 230px)',
        fixedHeader: true,
        print: false,
        customToolbar: () => (
            <Tooltip title="Print">
                <LocalPrintshop className="text-gray-600 cursor-pointer hover:text-black"
                                onClick={() => setPrintDataModal(true)}/>
            </Tooltip>
        ),
        draggableColumns: {
            enabled: true,
            transitionTime: 300,
        },
        selectableRows: "none",
        downloadOptions: {
            filename: "CNMI-Listing.csv",
            separator: ",",
        },
        setRowProps: (row, dataIndex, rowIndex) => {
            const properties = {class: classes.dark2Background};
            if (rowIndex % 2 === 0) {
                properties["class"] = clsx(
                    properties["class"],
                    classes.dark1Background
                );
            }
            return properties;
        },
    }), [classes]);

    useEffect(() => {
        dispatch(setToolbarHeader("PTR Dashboard"));
        fetchData();
    }, []);

    const fetchData = () => {
        setIsLoading(true);
        axios.get('/getResearchers')
            .then(res => {
                if (res.data.status) {
                    let researchers = res.data.data;
                    axios.post("/properties/details")
                        .then((response) => {
                            setAdminPtrListing(
                                response.data.result.map((row) => [
                                    <div className={"text-center"}>
                                        <DropDown
                                            data={row}
                                            researchers={researchers}
                                            setChatRequestData={setChatRequestData}
                                            setIsChatPopUpOpen={setIsChatPopUpOpen}
                                            refreshData={fetchData}
                                        />
                                    </div>,
                                    row.id,
                                    row.property_descriptor,
                                    row.customer_name,
                                    row.request_type,
                                    row.notes,
                                    row.ptr_status,
                                    new Date(row.request_date).toLocaleDateString(),
                                    row.staff_username,
                                ])
                            );
                            setIsLoading(false);
                        })
                        .catch((error) => {
                            setIsLoading(false);
                            showError(error.response?.data?.message);
                        });
                }
            })
            .catch(error => {
                showError(error.response?.data?.message);
                setIsLoading(false);
            })
    }

    return (
        <div className="mx-20 my-20">
            <MUIDataTable
                title={
                    <Typography variant="h6">
                        PTR Listing
                        {isLoading && (
                            <CircularProgress
                                size={24}
                                style={{marginLeft: 15, position: "relative", top: 4}}
                            />
                        )}
                    </Typography>
                }
                data={adminPtrListing}
                columns={columns}
                options={options}
            />

           

            {adminPtrListing && <PrintModal
                openModal={printDataModal}
                setOpenModal={setPrintDataModal}
                title="PTR Admin Report"
                subTitle="PinPointGuam: PTR List"
                columns={columns.slice(1)}
                rows={adminPtrListing.map(i => i.slice(1))}
                isLoading={isLoading}
            />}
        </div>
    );
};

export default PTRAdminDashboard;