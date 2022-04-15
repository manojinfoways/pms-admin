import React, {useEffect, useState, useMemo} from "react";
import {useDispatch} from "react-redux";
import {setToolbarHeader} from "app/store/fuse/toolbarHeaderSlice";
import {makeStyles} from "@material-ui/core/styles";
import MUIDataTable from "mui-datatables";
import clsx from "clsx";
import {LocalPrintshop} from "@material-ui/icons";
import axios from "axios";
import moment from "moment/moment";
import {customDataBodyRender, dateSortCompare, showError} from "app/utils/helpers";
import {CircularProgress, Tooltip, Typography} from "@material-ui/core";
import PrintModal from "app/shared-components/PrintModal";

const columns = [
    {
        name: "PTR",
        label: "PTR",
        options: {
            filter: true,
            sort: true,
            customBodyRender: customDataBodyRender
        }
    },
    {
        name: 'Property',
        label: 'Property',
        options: {
            filter: true,
            sort: true,
            customBodyRender: customDataBodyRender
        }
    },
    {
        name: "Type",
        label: "Type",
        options: {
            filter: true,
            sort: true,
            customBodyRender: customDataBodyRender
        }
    },
    {
        name: "Request Type",
        label: "Request Type",
        options: {
            filter: true,
            sort: true,
            customBodyRender: customDataBodyRender
        }
    },
    {
        name: 'Property Descriptor',
        label: 'Property Descriptor',
        options: {
            filter: true,
            sort: true,
            setCellProps: () => ({style: {maxWidth: '150px'}}),
            customBodyRender: customDataBodyRender
        },
    },
    {
        name: "Request Date",
        label: "Request Date",
        options: {
            filter: true,
            sort: true,
            sortCompare: dateSortCompare,
            customBodyRender: customDataBodyRender
        }
    },
    {
        name: "Status",
        label: "Status",
        options: {
            filter: true,
            sort: true,
            customBodyRender: customDataBodyRender
        }
    },
    {
        name: 'Transaction Id',
        label: 'Transaction Id',
        options: {
            filter: true,
            sort: true,
            customBodyRender: customDataBodyRender
        },
    },
    {
        name: "Assigned To",
        label: "Assigned To",
        options: {
            filter: true,
            sort: true,
            customBodyRender: customDataBodyRender
        }
    }
];

const useStyles = makeStyles({
    dark1Background: {
        backgroundColor: "rgba(200,200,200,0.5)"
    },
    dark2Background: {
        '&:hover' : {
            backgroundColor: "rgba(200,200,200,1)"
        }
    }
})

const MainAdminDashboard = () => {

    const [data, setData] = useState();
    const [isLoading, setIsLoading] = useState(false)
    const [printDataModal, setPrintDataModal] = useState(false);

    const dispatch = useDispatch();
    const classes = useStyles();

    const options = useMemo(() => ({
        filter: true,
        filterType: 'multiselect',
        tableBodyMaxHeight: 'calc(100vh - 230px)',
        tableBodyHeight: 'calc(100vh - 230px)',
        rowsPerPage: 100,
        fixedHeader: true,
        selectableRows: "none",
        downloadOptions : {
            filename: 'AdminDashboardListing.csv',
            separator: ','
        },
        print: false,
        customToolbar: () => (
            <Tooltip title="Print">
                <LocalPrintshop className="text-gray-600 cursor-pointer hover:text-black"
                                onClick={() => setPrintDataModal(true)}/>
            </Tooltip>
        ),
        draggableColumns: {
            enabled: true,
            transitionTime:300,
        },
        setRowProps: (row, dataIndex, rowIndex) => {
            const properties = { class: classes.dark2Background }
            if (rowIndex%2===0) {
                properties["class"] = clsx(properties["class"], classes.dark1Background)
            }
            return properties
        }
    }),[classes]);

    useEffect(() => {
        dispatch(setToolbarHeader('Main Dashboard'));
        fetchData();
    }, []);

    const fetchData = () => {
        setIsLoading(true);
        axios.post(`/admin/dashboard`).then(res => {
            if(res.data.status){
                setData(res.data.getPtrRequest.map(row => [
                    row.id,
                    row.property_id,
                    row.type,
                    row.request_type,
                    row.property_descriptor,
                    moment(row.request_date).format('DD/MM/YYYY'),
                    row.status,
                    row.transaction_id,
                    row.staffname
                ]))
            }
            setIsLoading(false)
        }).catch(err => {
            setIsLoading(false)
            showError(err.response?.data?.message)
        })
    }

    return (
        <div className="mx-20 my-20">
            <MUIDataTable
                title= {<Typography variant="h6">
                    Data Listing
                    {isLoading && (
                        <CircularProgress
                            size={24}
                            style={{marginLeft: 15, position: "relative", top: 4}}
                        />
                    )}
                    </Typography>}
                data={data}
                columns={columns}
                options={options}
            />

            {data && <PrintModal
                openModal={printDataModal}
                setOpenModal={setPrintDataModal}
                title="PTR Admin Report"
                subTitle="PinPointGuam: Data List"
                columns={columns.slice(1)}
                rows={data.map(i => i.slice(1))}
                isLoading={isLoading}
            />}
        </div>
    )
}

export default MainAdminDashboard