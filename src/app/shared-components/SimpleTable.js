import Typography from "@material-ui/core/Typography";
import {CircularProgress} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import {customDataBodyRender} from "app/utils/helpers";

const useStyles = makeStyles(theme => ({
    dark1Background: {
        backgroundColor: "rgba(200,200,200,0.5)"
    },
    dark2Background: {
        '&:hover': {
            backgroundColor: "rgba(200,200,200,1)"
        }
    },
    tData: {
        width: '80px',
        wordBreak: 'break-word',
    },
}))

const SimpleTable = (props) => {

    const classes = useStyles(props);

    return (
        <div className={props.classes}>
            <div className="table-responsive">
                <table className="simple">
                    <thead {...props?.options?.headProps}>
                    <tr>
                        {props.columns.map((column, i) => (
                            <th key={i} id={column.id} >
                                <Typography className="font-semibold">
                                    {column.name}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody {...props?.options?.bodyProps}>
                    {!props.isLoading ? props.rows.length ?
                        props.rows.map((row, index) => (
                            <tr
                                key={index}
                                className={props.striped && index % 2 === 0 ? clsx(classes.dark1Background, classes.dark2Background) : ""}
                            >
                                {row.map((cell, i) => (
                                    <td className={classes.tData} key={i}>
                                        <Typography className="truncate break-normal">
                                            {customDataBodyRender(cell)}
                                        </Typography>
                                    </td>
                                ))}
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={6} className={"text-center"}>
                                    No Data
                                </td>
                            </tr>
                        ) : (
                        <tr>
                            <td colSpan={6} className={"text-center"}>
                                <CircularProgress size={24}/>
                            </td>
                        </tr>
                    )}
                    </tbody>
                </table>
            </div>
        </div>
    )

}

export default SimpleTable