import axios from "axios";
import {setPtrAlphaRecords, setPtrDetails} from "app/store/ptr/ptrDetails";
import store from "app/store";
import {updateNavigationItem} from "app/store/fuse/navigationSlice";
import {showError, showSuccess} from "app/utils/helpers";

const clearPTRStatus = () => {
    store.dispatch(setPtrDetails([]));
    store.dispatch(setPtrAlphaRecords([]));
    store.dispatch(updateNavigationItem('PTR Associated Properties', {
        id: 'PTR Associated Properties',
        title: 'PTR Associated Properties',
        translate: 'PTR Associated Properties',
        type: 'item',
        url: `/ptr/admin/properties/`,
    }));
}

export const getPtrDetailsById = async (id) => {
    try {
        const response = await axios.post('/properties/getDetailById/', {request_id: id});
        if (response.data.result.length) {
            store.dispatch(setPtrDetails(response.data.result));
            store.dispatch(setPtrAlphaRecords(response.data.alphaResult))
            store.dispatch(updateNavigationItem('PTR Associated Properties', {
                id: 'PTR Associated Properties',
                title: 'PTR Associated Properties',
                translate: 'PTR Associated Properties',
                type: 'collapse',
                url: `/ptr/admin/properties/${id}`,
                children: [
                    {
                        id: 'Documents Info',
                        title: 'Documents Info',
                        translate: 'Documents Info',
                        type: 'item',
                        url: `/ptr/admin/documents-info/${id}`,
                    },
                    {
                        id: 'Chain Of Custody',
                        title: 'Chain Of Custody',
                        translate: 'Chain Of Custody',
                        type: 'item',
                        url: `/ptr/admin/chain-of-title/${id}`,
                    },
                    {
                        id: 'Name Check',
                        title: 'Name Check',
                        translate: 'Name Check',
                        type: 'item',
                        url: `/ptr/admin/name-check/${id}`,
                    },
                    {
                        id: 'Legacy Association',
                        title: 'Legacy Association',
                        translate: 'Legacy Association',
                        type: 'item',
                        url: `/ptr/admin/legacy/${id}`,
                    },
                    {
                        id: 'Exception Report',
                        title: 'Exception Report',
                        translate: 'Exception Report',
                        type: 'item',
                        url: `/ptr/admin/exception-report/${id}`,
                    },
                    {
                        id: 'Tax Info',
                        title: 'Tax Info',
                        translate: 'Tax Info',
                        type: 'item',
                        url: `/ptr/admin/tax-info/${id}`,
                    },
                    {
                        id: 'Research Summary',
                        title: 'Research Summary',
                        translate: 'Research Summary',
                        type: 'item',
                        url: `/ptr/admin/research-summary/${id}`,
                    }
                ]
            }));
        } else {
            clearPTRStatus();
            showError('PTR Not Found');
        }
    } catch (error) {
        clearPTRStatus();
        showError(error.response?.data?.message);
    }
}

export const updatePropertyInclusionStatus = async (ptrId, propertyId, inclusionStatus) => {
    try {
        const response = await axios.post('/requests/removeProperty', {
            "ptr_request_id": ptrId,
            "property_id": propertyId,
            "status": inclusionStatus
        });
        if (response.data.success) {
            showSuccess(response?.data?.message);
        } else {
            showError(response?.data?.message ?? "Something went Wrong");
        }
    } catch (error) {
        showError(error.response?.data?.message);
    }
}