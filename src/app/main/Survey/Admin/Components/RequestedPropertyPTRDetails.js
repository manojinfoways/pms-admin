import {useEffect, useState} from "react";
import SimpleTable from "app/shared-components/SimpleTable";
import * as React from "react";

const propertyTableColumns = [
    {
        id: "Properties Associated With This PTR",
        name: "Properties Associated With This PTR"
    },
    {
        id: "Request NO",
        name: "Request NO"
    },
    {
        id: "Researcher",
        name: "Researcher"
    },
    {
        id: "Date Completed",
        name: "Date Completed"
    },
    {
        id: "Date Requested",
        name: "Date Requested"
    },
    {
        id: "Status",
        name: "Status"
    },
]

const RequestedPropertyPTRDetails = (props) => {

    const [propertyTableData, setPropertyTableData] = useState([]);

    useEffect(() => {
        if (!_.isEmpty(props.ptrDetails)) {
            const requestedPTR = props.ptrDetails.find(property => property.properties[0].property_ptr_type === "Requested")
            if (requestedPTR) {
                setPropertyTableData([
                    [
                        requestedPTR.property_descriptor,
                        requestedPTR.id,
                        requestedPTR.staff_username,
                        requestedPTR.date_completed ? new Date(requestedPTR.date_completed).toLocaleDateString() : '',
                        requestedPTR.request_date ? new Date(requestedPTR.request_date).toLocaleDateString() : '',
                        requestedPTR.ptr_status,
                    ]
                ]);
            }
            props.setPtrStatus(requestedPTR.ptr_status)
        } else {
            setPropertyTableData([])
        }
    }, [props.ptrDetails]);

    return (
        <div className="mb-8">
            <SimpleTable
                columns={propertyTableColumns}
                rows={propertyTableData}
                isLoading={props.isLoading}
            />
        </div>
    )

}

export default RequestedPropertyPTRDetails;