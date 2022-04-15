import {Box, Chip, Fade, FormControlLabel, Switch} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import clsx from "clsx";
import Typography from "@material-ui/core/Typography";
import {useState} from "react";
import Icon from "@material-ui/core/Icon";

const useStyles = makeStyles({
        badge: {
            borderRadius: "50%",
            backgroundColor: "white",
            color: "black",
            height: "23px",
            width: "23px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
        },
        legendData: {
            border: '1px solid #000',
            padding: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            '& p': {
                width: '25%',
                display: 'flex',
                alignItems: 'center',
                '& svg': {
                    marginRight: '12px',
                    width: '18px',
                },
                '& span': {
                    height: '21px',
                    width: '21px',
                    marginRight: '12px',
                    '& span': {
                        display: 'flex',
                        marginRight: '8px',
                        width: '26px',
                    },
                },
            },
        },
        green: {
            backgroundColor: "#59B16A",
            cursor: "pointer",
            marginBottom: "4px"
        },
        red: {
            backgroundColor: "#DA4B52",
            cursor: "pointer",
            marginBottom: "4px"
        },
        orange: {
            backgroundColor: "#ED7D31FF",
            cursor: "pointer",
            marginBottom: "4px"
        },
        blue: {
            backgroundColor: "#A7E0F5",
            cursor: "pointer",
            marginBottom: "4px"
        },
        purple: {
            backgroundColor: "#6275b3",
            cursor: "pointer",
            marginBottom: "4px"
        },
        pink: {
            backgroundColor: "#FF9B8E",
            cursor: "pointer",
            marginBottom: "4px"
        },
    }
)

// const variants = {
//     visible: { opacity: 1  },
//     hidden: { opacity: 0, height: 0 },
// }

const Legend = () => {

    const [showLegend, setShowLegend] = useState(false);
    const classes = useStyles();

    const legendData = [
        {
            id: 0,
            icon: <Chip component={"span"} className={classes.blue} size={"small"}/>,
            name: "Included in Doc Info Sheet"
        },
        {
            id: 1,
            icon: <Chip component={"span"} className={classes.orange} size={"small"}/>,
            name: "Included in Legacy PTR"
        },
        {
            id: 2,
            icon: <Chip component={"span"} className={classes.purple} size={"small"}/>,
            name: "Included in Chain of Title"
        },
        {
            id: 3,
            icon: <Chip component={"span"} className={classes.pink} size={"small"}/>,
            name: "Included in Name Check"
        },
        {
            id: 4,
            icon: <Chip component={"span"} className={classes.red} size={"small"}/>,
            name: "Does not belong in PTR"
        },
        {
            id: 5,
            icon: <Icon>verified</Icon>,
            name: "Researcher acknowledged"
        },
        {
            id: 6,
            icon: <span className={classes.badge}>OT</span>,
            name: "Ownership Transfers"
        },
        {
            id: 7,
            icon: <span className={classes.badge}>M</span>,
            name: "Mortgages"
        },
        {
            id: 8,
            icon: <span className={classes.badge}>O</span>,
            name: "Other"
        },
    ]

    return (
        <Box sx={{margin: '20px 0px'}}>
            <FormControlLabel
                control={
                    <Switch
                        checked={showLegend}
                        onChange={() => setShowLegend(prev => !prev)}
                        inputProps={{'aria-label': 'controlled'}}
                    />
                }
                label="Show Legend"
                labelPlacement={"start"}
            />
            {/*<motion.div*/}
            {/*    initial={showLegend ? "hidden" : "visible"}*/}
            {/*    animate={showLegend ? "visible" : "hidden"}*/}
            {/*    variants={variants}*/}
            {/*>*/}
            {/*    <div className={classes.legendData}>*/}
            {/*        {legendData.map((data, i) => (*/}
            {/*            <Typography key={i}>{data.icon} {data.name}</Typography>*/}
            {/*        ))}*/}
            {/*    </div>*/}
            {/*</motion.div>*/}
            <Fade in={showLegend}>
                <div className={clsx(classes.legendData, showLegend ? "" : "hidden")}>
                    {legendData.map((data, i) => (
                        <Typography key={i}>{data.icon} {data.name}</Typography>
                    ))}
                </div>
            </Fade>
        </Box>
    )
}

export default Legend;