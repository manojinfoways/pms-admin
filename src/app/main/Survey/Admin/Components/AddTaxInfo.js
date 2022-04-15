import {AddCircle} from "@material-ui/icons";
import {Button, TextField} from "@material-ui/core";
import CustomModalFull from "app/shared-components/CustomModalFull";
import {useEffect, useMemo, useState} from "react";
import {Box, CircularProgress, Typography} from "@material-ui/core";
import MUIDataTable from "mui-datatables";
import clsx from "clsx";
import {makeStyles} from "@material-ui/core/styles";
import axios from "axios";
import {showError, showSuccess} from "app/utils/helpers";

const useStyles = makeStyles((theme) => ({
    customLabel: {
        "& label": {
            fontSize: "12px"
        },
    },
    field: {
        width: '50%'
    }
}));

const columns = [
    {
        name: 'Id',
        label: 'Id',
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: 'Owner Name',
        label: 'Owner Name',
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: 'Location Type',
        label: 'Location Type',
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: 'Parcel Search',
        label: 'Parcel Search',
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: 'Land Assessed Value',
        label: 'Land Assessed Value',
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: 'Bldg Assessed Value',
        label: 'Bldg Assessed Value',
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: 'Total Assessed Value',
        label: 'Total Assessed Value',
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: 'First Install Payment',
        label: 'First Install Payment',
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: 'Second Install Payment',
        label: 'Second Install Payment',
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: 'Total Tax',
        label: 'Total Tax',
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: 'Exempt',
        label: 'Exempt',
        options: {
            filter: true,
            sort: true,
        },
    },
    {
        name: 'Bldg Area',
        label: 'Bldg Area',
        options: {
            filter: true,
            sort: true,
        },
    }
]

const AddTextInfo = (props) => {

    const [documentDataModal, setDocumentDataModal] = useState(false);
    const [searchText, setSearchText] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [data, setData] = useState([]);
    const [row, setRow] = useState([]);
    const [isCompleted, setIsCompleted] = useState(false);

    const classes = useStyles();

    useEffect(() => {
        if (props?.ptrDetails?.length) {
            setIsCompleted(props.ptrDetails[0].ptr_status === 'Completed')
        }
    }, [props.ptrDetails]);

    const options = useMemo(() => ({
        filter: true,
        filterType: "multiselect",
        tableBodyMaxHeight: 'calc(100vh - 280px)',
        rowsPerPage: 100,
        fixedHeader: true,
        download: false,
        print: false,
        draggableColumns: {
            enabled: true,
            transitionTime: 300,
        },
        selectableRows: 'multiple',
        // selectableRowsHeader: false, //row header checkbox
        selectableRowsOnClick: true,
        onTableChange: (action, dataObj) => {
            const actualData = []
            if (dataObj.selectedRows.data.length > 0) {
                const selectedRowIndices = Object.keys(dataObj.selectedRows.lookup);
                selectedRowIndices.map(value => {
                    actualData.push(dataObj.data[value].data);
                });
            }
            setRow(actualData)
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
        if (searchText && searchText.length > 2) {
            setIsLoading(true)
            axios.post(`/searchTaxInfo`, {
                searchtext: searchText
            }).then((res) => {
                if (res.data.status) {
                    setData(
                        res.data.data.map(row => [
                            row.ID,
                            row.OwnerName,
                            row.LocationType,
                            row.ParcelSearch,
                            row.LandAssessedValue,
                            row.BldgAssessedValue,
                            row.TotalAssessedValue,
                            row.FirstInstallPayment,
                            row.SecondInstallPayment,
                            row.TotalTax,
                            row.Exempt,
                            row.BldgArea
                        ])
                    )
                    setIsLoading(false)
                }
            }).catch(error => {
                showError(error.response?.data?.message);
                setIsLoading(false);
                setData([])
            })
        }
    }, [searchText]);

    const handleTaxInfo = () => {
        axios.post('/associate_taxinfo_to_ptr', {
            "ptr_id": props.ptrId,
            "tax_id": row.map(i => i[0])
        }).then(res => {
            if (res.status) {
                props.refreshData();
                showSuccess(res?.data?.message);
                setDocumentDataModal(false)
            }
        }).catch(error => {
            showError(error.response?.data?.message);
        })
    }

    return (
        <>
            <Button
                variant="contained"
                sx={{marginRight: '15px'}}
                startIcon={<AddCircle/>}
                color="secondary"
                disabled={isCompleted}
                onClick={() => setDocumentDataModal(true)}
            >
                Add Tax Document
            </Button>

            <CustomModalFull
                openModal={documentDataModal}
                setOpenModal={setDocumentDataModal}
            >
                <Box sx={{margin: "30px"}}>
                    <div className={"flex items-center justify-between mb-12"}>
                        <TextField
                            id="Land Parcel"
                            label="Land Parcel"
                            type="text"
                            className="w-1/4"
                            name="Land Parcel"
                            value={searchText}
                            onChange={e => setSearchText(e.target.value.toUpperCase())}
                            variant="outlined"
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            className="whitespace-nowrap mx-16 px-24"
                            startIcon={<AddCircle/>}
                            onClick={() => handleTaxInfo()}
                            disabled={_.isEmpty(row)}
                        >
                            Add Tax Info
                        </Button>
                    </div>
                </Box>

                <div className="mx-20 my-20">
                    <MUIDataTable
                        title={
                            <Typography variant="h6">
                                Tax Info
                                {isLoading &&
                                    <CircularProgress size={24}
                                                      style={{marginLeft: 15, position: 'relative', top: 4}}/>}
                            </Typography>
                        }
                        data={data}
                        columns={columns}
                        options={options}
                    />
                </div>
            </CustomModalFull>
        </>
    )
}

export default AddTextInfo;