import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Typography} from "@material-ui/core";
import {showError, showSuccess} from "app/utils/helpers";
import RichTextField from "app/shared-components/RichTextField";

const AdminNotes = (props) => {

    const [notes, setNotes] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (props?.ptrDetails?.length) {
            setNotes(props.ptrDetails[0].admin_notes)
            setIsCompleted(props.ptrDetails[0].ptr_status === 'Completed')
        }
    }, [props.ptrDetails]);

    const handleNotes = () => {
        if (notes.trim()) {
            axios.post(`/requests/updateNotesPTR`, {
                "request_id": props.ptrId,
                "notes": notes.trim()
            }).then(res => {
                showSuccess(res.data.message || 'Successfully Created');
                props.refreshData()
            }).catch(error => {
                showError(error.response.data.message);
            })
        }
    }

    return (
        <div className="mb-20 flex flex-col">
            <div className="items-center mb-6 mt-20">
                <Typography variant="h6" className="ml-10 mb-10">PTR Note</Typography>
                <RichTextField
                    value={(props?.ptrDetails?.length && props.ptrDetails[0].admin_notes) || ""}
                    setValue={setNotes}
                    disabled={isCompleted || _.isEmpty(props.ptrDetails)}
                />
            </div>
            <div className="self-end">
                <Button
                    variant="contained"
                    color='secondary'
                    className='mt-10 items-end'
                    onClick={handleNotes}
                    disabled={isCompleted || _.isEmpty(props.ptrDetails)}
                >
                    Submit
                </Button>
            </div>
        </div>
    )
}

export default AdminNotes;