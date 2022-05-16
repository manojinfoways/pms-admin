import { useReactToPrint } from "react-to-print";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { Grid } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "./PrintStyle.css";

const useStyles = makeStyles({
  headerWrapper: {
    // background: '#f78e57',
    // background: "#50592F",
    background: "#2775ff",
    alignItems: "center",
    padding: "10px 15px 0",
    minHeight: "50px",
    position: "relative",
  },
  logoWrapper: {
    width: "auto",
    height: "90px",
    "& > img": {
      width: "auto",
      height: "auto",
      maxWidth: "100%",
      maxHeight: "100%",
      objectFit: "contain",
    },
  },
  printTitle: {
    fontSize: "30px",
    color: "white",
    fontWeight: "bold",
    textAlign: "right",
  },
  printSubData: {
    fontSize: "20px",
    color: "Black",
    textAlign: "right",
    display: "inline",
    marginLeft: 0,
    paddingRight: "10px",
    wordBreak: "break-word",
  },
  printSubTitle: {
    background: "#000000",
    padding: "4px 15px",
    position: "relative",
    left: 0,
    top: 0,
    display: "table-header-group",
    zIndex: "9",
    width: "100%",

    "& > h2": {
      fontSize: "20px",
      color: "#FFFFFF",
      fontWeight: "bold",
      marginBottom: "0",
    },
  },
});

const Print = forwardRef((props, ref) => {
  const componentRef = useRef();
  const classes = useStyles();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  useImperativeHandle(ref, () => ({
    printData() {
      handlePrint();
    },
  }));

  return (
    <div className="hidden">
      <div ref={componentRef}>
        <Grid container spacing={2} className={classes.headerWrapper}>
          <Grid item xs={3} className="p-36">
            <div className={classes.logoWrapper}>
              <img
                src={`${process.env.REACT_APP_PUBLIC}/assets/images/logos/homevue.svg`}
                alt="PMS"
              />
            </div>
          </Grid>
          <Grid item xs={9} className="p-36">
            <div className="d-flex justify-end items-center my-auto">
              <h4 className={classes.printTitle}>{props.title}</h4>
            </div>
            <div className="d-flex justify-end items-right">
              {props.subData
                ? props?.subData.map((i) =>
                    i.map((data) => (
                      <h5 className={classes.printSubData}>{data.name},</h5>
                    ))
                  )
                : ""}
            </div>
          </Grid>
          <div className={classes.printSubTitle}>
            <h2>{props.subTitle}</h2>
          </div>
        </Grid>
        <div>{props.children}</div>
      </div>
    </div>
  );
});

export default Print;
