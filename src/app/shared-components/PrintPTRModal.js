import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {
    Backdrop,
    Box,
    Button,
    Checkbox,
    CircularProgress,
    Fade,
    FormControlLabel,
    Grid,
    Modal
} from '@material-ui/core';
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import SimpleTable from "./SimpleTable";
import Print from "./Print";
import {PrintOutlined} from "@material-ui/icons";
import {customDataBodyRender, dateSortCompare} from "app/utils/helpers";
import axios from "axios";
import {getPtrDetailsById as getPtrDetailsByIdAdmin} from "app/main/Survey/Admin/API";
import moment from "moment/moment";

const columns = [
    {
        name: 'Property',
        label: 'Property',
        options: {
            filter: false,
            sort: false,
            download: false,
            setCellProps: () => ({style: {minWidth: '100px'}}),
            customBodyRender: customDataBodyRender
        }
    },
    {
        name: 'Doc No.',
        label: 'Doc No.',
        options: {
            filter: false,
            sort: false,
            download: false,
            setCellProps: () => ({style: {minWidth: '100px'}}),
            customBodyRender: customDataBodyRender
        }
    },
    {
        name: 'PTR Type',
        label: 'PTR Type',
        options: {
            filter: false,
            sort: false,
            download: false,
            setCellProps: () => ({style: {minWidth: '100px'}}),
            customBodyRender: customDataBodyRender
        }
    },
    {
        name: 'Type',
        label: 'Type',
        options: {
            filter: true,
            sort: true,
            setCellProps: () => ({style: {minWidth: '107px'}}),
            customBodyRender: customDataBodyRender
        },
    },
    {
        name: 'Grantor/Mortgager/ Assignor/Made by Other',
        label: 'Grantor/Mortgager/ Assignor/Made by Other',
        options: {
            filter: true,
            filterType: 'dropdown',
            sort: true,
            setCellProps: () => ({style: {minWidth: "50px"}}),
            customBodyRender: customDataBodyRender
        },
    },
    {
        name: 'Grantee/Mortgagee Assignee/ In Favor of Against/vs. Other',
        label: 'Grantee/Mortgagee Assignee/ In Favor of Against/vs. Other',
        options: {
            filter: true,
            filterType: 'dropdown',
            sort: true,
            setCellProps: () => ({style: {textAlign: 'center', minWidth: '100px'}}),
            customBodyRender: customDataBodyRender
        },
    },
    {
        name: 'Priority',
        label: 'Priority',
        options: {
            filter: true,
            sort: true,
            setCellProps: () => ({style: {textAlign: 'center'}}),
            customBodyRender: customDataBodyRender
        },
    },
    {
        name: 'Recorded Date',
        label: 'Recorded Date',
        options: {
            filter: true,
            sort: true,
            sortCompare: dateSortCompare,
            setCellProps: () => ({style: {textAlign: 'center'}}),
            customBodyRender: customDataBodyRender
        },
    },
    {
        name: 'Associated CT',
        label: 'Associated CT',
        options: {
            filter: true,
            sort: true,
            setCellProps: () => ({style: {textAlign: 'center'}}),
            customBodyRender: customDataBodyRender
        },
    },
];

const columnsInfo = [
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
            display: false
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

const status = {
    'Legacy': {
        'DOC_INFO': 'O-D',
        'CHAIN_TITLE': 'O-C',
        'LEGACY_PTR': 'O-L',
        'EXCEPTION': 'O-E',
        'NAME_CHECK': 'O-N'
    },
    'Official': {
        'DOC_INFO': 'O-D',
        'CHAIN_TITLE': 'O-C',
        'LEGACY_PTR': 'O-L',
        'EXCEPTION': 'O-E',
        'NAME_CHECK': 'O-N'
    },
    'Alpha': {
        'DOC_INFO': 'A-D',
        'CHAIN_TITLE': 'A-C',
        'LEGACY_PTR': 'A-L',
        'EXCEPTION': 'A-E',
        'NAME_CHECK': 'A-N'
    }
}

const infoPage = [
    {
        'id': 1,
        'name': 'Tax Info'
    }
]

const summaryPage = [
    {
        'id': 1,
        'name': 'Research Summary'
    },
]

const PTRNotes = [
    {
        'id': 1,
        'name': 'PTR Notes'
    }
]

const pages = [
    {
        'id': 1,
        'name': 'Document Info',
        'label': 'DOC_INFO'
    },
    {
        'id': 2,
        'name': 'Chain of Title',
        'label': 'CHAIN_TITLE'
    },
    {
        'id': 3,
        'name': 'Exception',
        'label': 'EXCEPTION'
    },
    {
        'id': 4,
        'name': 'Legacy Association',
        'label': 'LEGACY_PTR'
    },
    {
        'id': 5,
        'name': 'Name Check',
        'label': 'NAME_CHECK'
    }
]

const useStyles = makeStyles((theme) => ({
    container: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: "auto",
        backgroundColor: theme.palette.background.paper,
        border: '1px solid #555',
        padding: "3rem",
    },
    checkBox: {
        marginBottom: "10px",
        width: '30%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        '& span': {
            display: 'flex',
            alignItems: 'center',
            paddingTop: '0',
            '&:last-child': {
                top: '-10px',
                width: '100%',
                alignItems: 'flex-start',
                height: '40px',
                overflow: 'hidden',
                display: '-webkit-box',
                '-webkit-line-clamp': '2',
                '-webkit-box-orient': 'vertical'
            },
        },
    },
    label: {
        fontWeight: '600',
        fontSize: 12,
        '& span': {
            fontWeight: 400,
            fontSize: 15,
            marginLeft: 20,
        },
    },
    tablelayout: {
        display: 'flex',
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 40,
        marginBottom: 10,
        '& table': {
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',
        },
        '& td': {
            border: '1.5px solid #999999 !important',
            height: '25px',
            flex: 1,
            position: 'static'
        },
    },
    tableInfoLayout: {
        display: 'flex',
        width: '80%',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 350,
        marginBottom: 10,
        '& table': {
            width: '100%',
            marginLeft: 'auto',
            marginRight: 'auto',

        },
        '& td': {
            border: '1px solid #999999 !important',
            height: '25px',
            flex: 1,
            position: 'static'
        },
    },
    borderNone: {
        borderRight: 'none',
    },
    tdSpace: {
        height: '20px',
        border: "none"
    },
    tdBorder: {
        border: 'none',
    },
    areaWrapper: {
        '& td': {
            flex: 1,
        },
    },
    unitWrapper: {
        '& td': {
            flex: 1,
        },
    },
    notes: {
        '& ul': {
            listStyle: "revert"
        },
        '& ol': {
            listStyle: "revert"
        },
    },
    headerWrapper: {
        background: '#22d3ee',
        alignItems: 'center',
        padding: '10px 15px 0',
        marginTop: 2,
        minHeight: '50px',
        position: "relative",
    },
    logoWrapper: {
        width: 'auto',
        height: '90px',
        '& > img': {
            width: 'auto',
            height: 'auto',
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain',
        },
    },
    printTitle: {
        fontSize: '30px',
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'right'
    },
    printSubTitle: {
        background: '#000000',
        padding: '4px 15px',
        position: 'relative',
        left: 0,
        top: 0,
        display: 'table-header-group',
        zIndex: '9',
        width: '100%',

        '& > h2': {
            fontSize: '20px',
            color: '#FFFFFF',
            fontWeight: 'bold',
            marginBottom: '0',
        },
    }
}));

const PrintPTRModal = ({openModal, setOpenModal, children, ...props}) => {

    const [checked, setChecked] = useState([]);
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [infoChecked, setInfoChecked] = useState([]);
    const [summaryChecked, setSummaryChecked] = useState([]);
    const [notesChecked, setNotesChecked] = useState([]);
    const [mixDocuments, setMixDocuments] = useState([]);
    const [docInfo, setDocInfo] = useState([])
    const [COT, setCOT] = useState([])
    const [legacy, setLegacy] = useState([])
    const [exception, setException] = useState([])
    const [nameCheck, setNameCheck] = useState([])
    const [currentPTRDetail, setCurrentPTRDetail] = useState({});

    const classes = useStyles(props);
    const printRef = useRef();

    const ptrDetails = useSelector(({ptr}) => ptr.ptrDetails.details);
    const ptrAlphaRecords = useSelector(({ptr}) => ptr.ptrDetails.alpha);
    const user = useSelector(({auth}) => auth.user);

    useEffect(async () => {
        setChecked(pages.map((col, i) => ({name: col.name, label: col.label, id: i})))
        setInfoChecked(infoPage.map((col, i) => ({name: col.name, id: i})))
        setSummaryChecked(summaryPage.map((col, i) => ({name: col.name, id: i})))
        !user.role.includes('user') && setNotesChecked(PTRNotes.map((col, i) => ({name: col.name, id: i})))
    }, []);

    useEffect(() => {
        if (props.ptrId) {
            setIsLoading(true);
            axios.post("/properties/details", {
                "request_id": props.ptrId
            }).then(response => {
                const requestedPTRData = response.data.result.find(i => i.id === props.ptrId);
                if (requestedPTRData)
                    setCurrentPTRDetail(requestedPTRData);

                axios.post('/associate_taxinfo_list', {
                    "ptr_id": props.ptrId
                }).then(res => {
                    if (res.status) {
                        setData(res.data.result.map(row => [
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
                        ]))
                        setIsLoading(false);
                    }
                }).catch(error => {
                    setIsLoading(false);
                })
            }).catch(error => {
                setIsLoading(false);
            })
        }
    }, [props.ptrId])

    useEffect(async () => {
        if ((!_.isEmpty(ptrDetails) || !_.isEmpty(ptrAlphaRecords)) && ptrDetails[0].id === props.ptrId) {
            const documents = [].concat.apply([], ptrDetails.map(i => i.properties[0].docs));
            const data = documents.map(row => [
                row.prop_desc || '-',
                row.docno || '-',
                row.ptr_report_status,
                row.transaction_value || '-',
                row.grantor ? row.grantor : '-',
                row.grantee ? row.grantee : '-',
                row.priority_no,
                row.recorded_date ? moment(row.recorded_date).format('DD/MM/YYYY') : "-",
                row.associated_ct,
                row.sourcetype
            ]);
            const alphaData = ptrAlphaRecords.map((row) => [
                row.prop_desc || '-',
                row.docno || '-',
                row.ptr_report_status,
                row.transaction_value || '-',
                row.grantor || '-',
                row.grantee || '-',
                row.priority_no,
                row.recorded_date ? moment(row.recorded_date).format('DD/MM/YYYY') : "-",
                row.associated_ct,
                row.sourcetype
            ]);
            setMixDocuments(data.concat(alphaData));
        } else {
            await fetchData(props.ptrId)
        }
    }, [ptrDetails, ptrAlphaRecords]);

    const handleClose = () => setOpenModal(false);

    const handleInputChange = (e, index) => {
        if (e.target.checked) {
            setChecked(prev => [...prev, {name: e.target.value, label: e.target.value, id: index}])
        } else {
            setChecked(prev => prev.filter(col => col.label !== e.target.value))
        }
    }

    const handleInfoInputChange = (e, index) => {
        if (e.target.checked) {
            setInfoChecked(prev => [...prev, {name: e.target.value, id: index}])
        } else {
            setInfoChecked(prev => prev.filter(col => col.name !== e.target.value))
        }
    }

    const handleSummaryInputChange = (e, index) => {
        if (e.target.checked) {
            setSummaryChecked(prev => [...prev, {name: e.target.value, id: index}])
        } else {
            setSummaryChecked(prev => prev.filter(col => col.name !== e.target.value))
        }
    }

    const handleNotesChange = (e, index) => {
        if (e.target.checked) {
            setNotesChecked(prev => [...prev, {name: e.target.value, id: index}])
        } else {
            setNotesChecked(prev => prev.filter(col => col.name !== e.target.value))
        }
    }

    const customFilter = () => {
        const docs = mixDocuments.filter(doc => checked.map(i => i.label).includes(doc[2])).map(row => {
            let k = _.cloneDeep(row)
            k[2] = status[k[9]][k[2]]
            return k.slice(0, 9);
        })
        setDocInfo(sortDataByDate(docs.filter(i => i.includes('O-D') || i.includes('O-C') || i.includes('O-N') || i.includes('A-N') || i.includes('A-D') || i.includes('A-C'))))
        setCOT(docs.filter(i => i.includes('O-C') || i.includes('A-C')).sort((a, b) => a[6] - b[6]))
        setLegacy(sortDataByDate(docs.filter(i => i.includes('O-L') || i.includes('A-L'))))
        setException(sortDataByDate(docs.filter(i => i.includes('O-E') || i.includes('A-E'))))
        setNameCheck(sortDataByDate(docs.filter(i => i.includes('O-N') || i.includes('A-N'))))
        setTimeout(() => printRef.current.printData(), 1000);
    }

    const sortDataByDate = (data) => {
        return data.sort((obj1, obj2) => {
            let d1 = obj1[7] !== '-' ? moment(obj1[7], 'DD/MM/YYYY').valueOf() : Infinity*-1;
            let d2 = obj2[7] !== '-' ? moment(obj2[7], 'DD/MM/YYYY').valueOf() : Infinity*-1;
            return d2 - d1
        })
    }

    const fetchData = async (id) => {
        setIsLoading(true);
        if (user.role.includes('admin'))
            await getPtrDetailsByIdAdmin(id)
         
        setIsLoading(false);
    }

    const SummaryData = () => {
        return (
            <>
                <div className={classes.tablelayout}>
                    <table cellPadding={0} cellSpacing={0} border={0} className='w-100 border-none'>
                        <tbody>
                        <tr>
                            <td className={classes.tdBorder}>
                                <table cellPadding={2} cellSpacing={2} border={0}>
                                    <tbody>
                                    <tr>
                                        <td className={classes.label}>Requester: <span>{currentPTRDetail.customer_name || '-'}</span>
                                        </td>
                                        <td className={classes.label}>Request
                                            Type: <span> {currentPTRDetail.request_type || '-'}</span></td>
                                    </tr>
                                    <tr>
                                        <td className={classes.label}>Property
                                            Type: <span>{currentPTRDetail.property_type || '-'} </span></td>
                                        <td className={classes.label}>PTR: <span>{currentPTRDetail.id || '-'}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={classes.label}>Requested
                                            Date: <span> {currentPTRDetail.request_date ? new Date(currentPTRDetail.request_date).toLocaleDateString() : '-'}</span>
                                        </td>
                                        <td className={classes.label}>Dated: <span>{currentPTRDetail?.summary?.dated ? new Date(currentPTRDetail.summary?.dated).toLocaleDateString() : '-'}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <div className={classes.tdSpace}/>
                        <tr>
                            <td className={classes.tdBorder}>
                                <table cellPadding={4} cellSpacing={4} border={0}>
                                    <tbody>
                                    <tr>
                                        <td className={classes.label}>Researcher: <span>{currentPTRDetail.staff_username || '-'}</span>
                                        </td>
                                        <td className={classes.label}>Reviewed
                                            By: <span>{currentPTRDetail.summary?.reviewed_by || '-'}</span></td>
                                    </tr>
                                    <tr>
                                        <td className={classes.label}>Recorded
                                            Date: <span>{currentPTRDetail.summary?.recorded ? new Date(currentPTRDetail.summary?.recorded).toLocaleDateString() : '-'}</span>
                                        </td>
                                        <td className={classes.label}>Updated
                                            Date: <span>{currentPTRDetail.summary?.updated_at ? new Date(currentPTRDetail.summary?.updated_at).toLocaleDateString() : '-'}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={classes.label}>Status: <span>{currentPTRDetail.ptr_status || '-'}</span>
                                        </td>
                                        <td className={classes.label}>Completion
                                            Date: <span>{currentPTRDetail.summary?.date_completed || '-'}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <div className={classes.tdSpace}/>
                        <tr>
                            <td className={classes.tdBorder}>
                                <table cellPadding={4} cellSpacing={4} border={0}>
                                    <tbody>
                                    <tr>
                                        <td className={classes.label}>Description: <span>{currentPTRDetail.notes || '-'}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td className={classes.tdBorder}>
                                <table cellPadding={4} cellSpacing={4} border={0}>
                                    <tbody>
                                    <tr>
                                        <td className={classes.label}>Transaction
                                            ID: <span>{currentPTRDetail.transaction_id || '-'}</span></td>
                                        <td className={classes.label}>Owner(s) on
                                            Record: <span>{currentPTRDetail.summary?.owners || '-'}</span></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <div className={classes.tdSpace}/>
                        <tr>
                            <td className={classes.tdBorder}>
                                <table cellPadding={4} cellSpacing={4} border={0}>
                                    <tbody>
                                    <tr>
                                        <td className={classes.label}>Tract: <span>{currentPTRDetail.tract_std || '-'}</span>
                                        </td>
                                        <td className={classes.label}>Block: <span>{currentPTRDetail.block_std || '-'}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                                <table cellPadding={4} cellSpacing={4} border={0}>
                                    <tbody>
                                    <tr className={classes.areaWrapper}>
                                        <td className={classes.label}>Lot: <span>{currentPTRDetail.lot_std || '-'}</span>
                                        </td>
                                        <td className={classes.label}>Unit: <span>{currentPTRDetail.unit_std || '-'}</span>
                                        </td>
                                        <td className={classes.label}>Phase: <span>{currentPTRDetail.phase || '-'}</span>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        <div className={classes.tdSpace}/>
                        <tr>
                            <td className={classes.tdBorder}>
                                <table cellPadding={4} cellSpacing={4} border={0}>
                                    <tbody>
                                    <tr>
                                        <td className={classes.label}>Drawing
                                            Number: <span>{currentPTRDetail.summary?.drawing_number || '-'}</span>
                                        </td>
                                        <td className={classes.label}>LM
                                            Check: <span>{currentPTRDetail.summary?.lmcheck || '-'}</span></td>
                                        <td className={classes.label}>Area: <span>{currentPTRDetail.summary?.area || '-'}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td className={classes.label}>Territory of
                                            Guam: <span>{currentPTRDetail.summary?.territoryofguam || '-'}</span>
                                        </td>
                                        <td className={classes.label}>Description on
                                            Map: <span>{currentPTRDetail.summary?.desc_on_map || '-'}</span></td>
                                        <td className={classes.label}>Basic
                                            Lot: <span>{currentPTRDetail.summary?.basic_lot || '-'}</span></td>
                                    </tr>
                                    <tr>
                                        <td className={classes.label}>Owners
                                            CT: <span>{currentPTRDetail.summary?.ownersCT || '-'}</span></td>
                                        <td className={classes.label}>Last
                                            CT: <span>{currentPTRDetail.summary?.lastCT || '-'}</span></td>
                                        <td className={classes.label}>Estate
                                            Number: <span>{currentPTRDetail.summary?.estate_no || '-'}</span></td>
                                    </tr>
                                    </tbody>
                                </table>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </>
        )
    }

    const HeaderData = (props) => {
        return (
            <Grid container spacing={2} className={classes.headerWrapper}>
                <Grid item xs={3} className="p-36">
                    <div className={classes.logoWrapper}>
                        <img src={ `${process.env.REACT_APP_PUBLIC}/assets/images/logos/LOGOV2-bg.png` } alt="PINPOINTGUAM"/>
                    </div>
                </Grid>
                <Grid item xs={9} className="p-36">
                    <div className="d-flex justify-end items-center my-auto">
                        <h4 className={classes.printTitle}>PINPOINTGUAM</h4>
                    </div>
                </Grid>
                <div className={classes.printSubTitle}>
                    <h2>{props.title}</h2>
                </div>
            </Grid>
        )
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
                    <h2>Show Pages</h2><br/>
                    {pages.map((i, index) => [
                        <FormControlLabel
                            className={classes.checkBox}
                            label={i.name}
                            control={
                                <Checkbox
                                    checked={checked.filter(col => col.label === i.label).length}
                                    value={i.label}
                                    onChange={(e) => handleInputChange(e, index)}
                                />
                            }
                        />])}
                    {infoPage.map((i, index) => [
                        <FormControlLabel
                            className={classes.checkBox}
                            label={i.name}
                            control={
                                <Checkbox
                                    checked={infoChecked.filter(col => col.name === i.name).length}
                                    value={i.name}
                                    onChange={(e) => handleInfoInputChange(e, index)}
                                />
                            }
                        />
                    ])}
                    {summaryPage.map((i, index) => [
                        <FormControlLabel
                            className={classes.checkBox}
                            label={i.name}
                            control={
                                <Checkbox
                                    checked={summaryChecked.filter(col => col.name === i.name).length}
                                    value={i.name}
                                    onChange={(e) => handleSummaryInputChange(e, index)}
                                />
                            }
                        />
                    ])}
                    {!user.role.includes('user') && PTRNotes.map((i, index) => [
                        <FormControlLabel
                            className={classes.checkBox}
                            label={i.name}
                            control={
                                <Checkbox
                                    checked={notesChecked.filter(col => col.name === i.name).length}
                                    value={i.name}
                                    onChange={(e) => handleNotesChange(e, index)}
                                />
                            }
                        />
                    ])}
                    <br/>
                    <div className="my-50 w-full flex justify-center">
                        {isLoading ?
                            <CircularProgress size={24} style={{marginLeft: 15, position: 'relative', top: 4}}/> :
                            <Button
                                variant="contained"
                                color="secondary"
                                startIcon={<PrintOutlined/>}
                                size="large"
                                onClick={() => customFilter()}
                            >
                                Print
                            </Button>
                        }
                    </div>
                    <Print
                        ref={printRef}
                        title={props.title}
                        subTitle={props.subTitle + "- " + (currentPTRDetail.property_descriptor_std || currentPTRDetail.property_descriptor)}
                        subData={[checked, infoChecked, summaryChecked, notesChecked]}
                    >
                        {summaryChecked.length > 0 && (
                            <>
                                <SummaryData/>
                                <div className="pagebreak"/>
                            </>
                        )}
                        {checked.length > 0 && (
                            <>
                            {checked.filter(i => i.label === 'DOC_INFO').length === 1 && (
                                <>
                                    <HeaderData title='DOC INFO DOCUMENTS'/>
                                    <SimpleTable
                                        columns={columns}
                                        rows={docInfo}
                                        isLoading={props.isLoading}
                                    />
                                    <div className="pagebreak"/>
                                </>
                            )}
                            {checked.filter(i => i.label === 'CHAIN_TITLE').length === 1 && (
                                <>
                                    <HeaderData title='CHAIN OF TITLE DOCUMENTS'/>
                                    <SimpleTable
                                        columns={columns}
                                        rows={COT}
                                        isLoading={props.isLoading}
                                    />
                                    <div className="pagebreak"/>
                                </>
                            )}
                            {checked.filter(i => i.label === 'LEGACY_PTR').length === 1 && (
                                <>
                                    <HeaderData title='LEGACY DOCUMENTS'/>
                                    <SimpleTable
                                        columns={columns}
                                        rows={legacy}
                                        isLoading={props.isLoading}
                                    />
                                    <div className="pagebreak"/>
                                </>
                            )}
                            {checked.filter(i => i.label === 'NAME_CHECK').length === 1 && (
                                <>
                                    <HeaderData title='NAME CHECK DOCUMENTS'/>
                                    <SimpleTable
                                        columns={columns}
                                        rows={nameCheck}
                                        isLoading={props.isLoading}
                                    />
                                    <div className="pagebreak"/>
                                </>
                            )}
                            {checked.filter(i => i.label === 'EXCEPTION').length === 1 && (
                                <>
                                    <HeaderData title='EXCEPTION DOCUMENTS'/>
                                    <SimpleTable
                                        columns={columns}
                                        rows={exception}
                                        isLoading={props.isLoading}
                                    />
                                    <div className="pagebreak"/>
                                </>
                            )}
                            </>
                        )}
                        {infoChecked.length > 0 && (
                            <>
                                <HeaderData title='TAX INFO'/>
                                <SimpleTable
                                    columns={columnsInfo}
                                    rows={data}
                                    isLoading={isLoading}
                                />
                                <div className="pagebreak"/>
                            </>
                        )}
                        {notesChecked.length > 0 && !user.role.includes('user') && (
                            <>
                                <HeaderData title='PTR NOTES'/>
                                <Box className="border-none mx-80 p-30">
                                    <div className={clsx('justify-center text-lg', classes.notes)}
                                         dangerouslySetInnerHTML={{__html: currentPTRDetail.admin_notes}}/>
                                </Box>
                            </>
                        )}
                        </Print>
                    </Box>
                </Fade>
        </Modal>
    )
}

export default PrintPTRModal;