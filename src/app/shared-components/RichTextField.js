import {useEffect, useState} from "react";
import {makeStyles} from "@material-ui/core/styles";
import {ContentState, convertToRaw, EditorState} from "draft-js";
import {Editor} from 'react-draft-wysiwyg';
import htmlToDraft from 'html-to-draftjs';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import draftToHtml from "draftjs-to-html";

const useStyles = makeStyles({
    wrapper: {
        border: "1px solid black",
        borderRadius: "10px",
        padding: "10px"
    },
    editor: {
        borderTop: "1px solid #000",
        padding: "10px",
    }
})

const RichTextField = (props) => {

    const [editorState, setEditorState] = useState(EditorState.createEmpty());
    const classes = useStyles(props);

    useEffect(() => {
        const contentBlock = htmlToDraft(props.value || "");
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            setEditorState(editorState);
        }
    }, [props.value]);

    return (
        <>
            <Editor
                toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'fontFamily', 'list', 'textAlign', 'history'],
                }}
                wrapperClassName={classes.wrapper}
                editorClassName={classes.editor}
                editorState={editorState}
                onEditorStateChange={newState => {
                    setEditorState(newState)
                    props.setValue(draftToHtml(convertToRaw(newState.getCurrentContent())))
                }}
                 readOnly={props.disabled}
            />
        </>
    )
}

export default RichTextField;