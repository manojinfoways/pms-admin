import {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setToolbarHeader} from "app/store/fuse/toolbarHeaderSlice";
import Widget1 from "./Widget1";

const Analytics = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(setToolbarHeader('Analytics'));
    })

    return (
        <Widget1 />
    )
}

export default Analytics