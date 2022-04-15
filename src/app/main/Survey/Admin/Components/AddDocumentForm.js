import {AddCircle} from "@material-ui/icons";
import {Button} from "@material-ui/core";
 import CustomModalFull from "app/shared-components/CustomModalFull";
import {useEffect, useState} from "react";

const AddDocumentForm = (props) => {

    const [documentDataModal, setDocumentDataModal] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    useEffect(() => {
        if (props?.ptrDetails?.length) {
            setIsCompleted(props.ptrDetails[0].ptr_status === 'Completed')
        }
    }, [props.ptrDetails]);

    return (
        <>
            <Button
                variant="contained"
                color="secondary"
                sx={{marginRight: '15px'}}
                disabled={isCompleted}
                startIcon={<AddCircle/>}
                onClick={() => setDocumentDataModal(true)}
            >
                Add Document  
            </Button>

            <CustomModalFull
                openModal={documentDataModal}
                setOpenModal={setDocumentDataModal}
            >
                
                
            </CustomModalFull>
        </>
    )
}

export default AddDocumentForm;