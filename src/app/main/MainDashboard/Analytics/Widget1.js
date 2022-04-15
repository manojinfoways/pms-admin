import _ from '@lodash';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import moment from 'moment';
import Divider from '@material-ui/core/Divider';
import {alpha} from '@material-ui/core/styles/colorManipulator';
import {makeStyles, ThemeProvider, useTheme} from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import {motion} from 'framer-motion';
import {memo, useState} from 'react';
import ReactApexChart from 'react-apexcharts';
import {selectContrastMainTheme} from 'app/store/fuse/settingsSlice';
import {
  fetchStatisticData,
  fetchQuestionList,
  fetchSurveyList,
} from '../../Survey/Admin/store/surveySlice';

const useStyles = makeStyles((theme) => ({
  root: {
    background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.primary.contrastText,
  },
}));

const chartDatas = {
  id: 'widget1',
  series: {
    2022: [
      {
        name: 'Location',
        data: [],
        fill: 'start',
      },
    ],
  },
  options: {
    chart: {
      type: 'area',
      height: '100%',
      background: 'transparent',
      toolbar: {
        show: false,
      },
      zoom: {
        enabled: false,
      },
    },
    theme: {
      mode: 'dark',
    },
    dataLabels: {
      enabled: false,
    },
    xaxis: {
      categories: [],
      tooltip: {
        enabled: false,
      },
      axisBorder: {
        show: false,
      },
    },
    yaxis: {
      axisBorder: {
        show: false,
      },
    },
    markers: {
      size: 3,
      strokeWidth: 1.5,
      strokeOpacity: 1,
      strokeDashArray: 0,
      fillOpacity: 1,
      shape: 'circle',
      radius: 2,
      hover: {
        size: 5,
      },
    },
    fill: {
      type: 'solid',
      opacity: 0.7,
      gradient: {
        shadeIntensity: 0.4,
        opacityFrom: 1,
        opacityTo: 0.5,
        stops: [30, 100, 100],
      },
    },
    grid: {
      show: true,
      strokeDashArray: 3,
      position: 'back',
      xaxis: {
        lines: {
          show: true,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0,
      },
    },
    stroke: {
      show: true,
      curve: 'smooth',
      lineCap: 'butt',
      width: 1.5,
      dashArray: 0,
    },
  },
};
function Widget1(props) {
  const dispatch = useDispatch();

  const statictData = useSelector(({survey}) => survey.statictData);
  const classes = useStyles(props);
  const theme = useTheme();
  const [chartData, setChartData] = useState(chartDatas);

  useEffect(() => {
    dispatch(fetchStatisticData()).then((data) => {});
  }, []);

  useEffect(() => {
    let date = statictData.map(function (el) {
      return moment(el.date).format('MM-DD-YY');
    });
    let total = statictData.map(function (el) {
      return parseFloat(el.total);
    });

    const chartDatas = {
      id: 'widget1',
      series: {
        2022: [
          {
            name: 'Visits',
            data: total,
            fill: 'start',
          },
        ],
      },
      options: {
        chart: {
          type: 'area',
          height: '100%',
          background: 'transparent',
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },

        theme: {
          mode: 'dark',
        },
        dataLabels: {
          enabled: false,
        },
        tooltip: {
          x: {
            format: 'dd/MM/yy',
          },
        },
        xaxis: {
          categories: date,
          tooltip: {
            enabled: false,
          },
          axisBorder: {
            show: false,
          },
        },
        yaxis: {
          axisBorder: {
            show: false,
          },
        },
        markers: {
          size: 3,
          strokeWidth: 1.5,
          strokeOpacity: 1,
          strokeDashArray: 0,
          fillOpacity: 1,
          shape: 'circle',
          radius: 2,
          hover: {
            size: 5,
          },
        },
        fill: {
          type: 'solid',
          opacity: 0.7,
          gradient: {
            shadeIntensity: 0.4,
            opacityFrom: 1,
            opacityTo: 0.5,
            stops: [30, 100, 100],
          },
          colors: ['#e97031'],
        },
        grid: {
          show: true,
          strokeDashArray: 3,
          position: 'back',
          xaxis: {
            lines: {
              show: true,
            },
          },
          yaxis: {
            lines: {
              show: true,
            },
          },
          padding: {
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          },
        },
        stroke: {
          show: true,
          curve: 'smooth',
          colors: ['#000'],
          lineCap: 'butt',
          width: 1.5,
          dashArray: 0,
        },
      },
    };
    setChartData(chartDatas);
  }, [statictData]);

  const contrastTheme = useSelector(
    selectContrastMainTheme(theme.palette.primary.main),
  );
  const data = _.merge({}, chartData);
  const [tabValue, setTabValue] = useState(2);

    return (
        <ThemeProvider theme={ contrastTheme }>
            <div className={clsx(classes.root)}>
                <div className="container relative p-16 sm:p-24 flex flex-col sm:flex-row justify-between items-center">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex flex-col items-center sm:items-start mb-16 sm:mb-0">
                            <Typography className="h2 font-medium" color="textPrimary">
                                Intake location attended
                            </Typography>
                            <Typography className="h5" color="textSecondary">
                            Intake performed  
                            </Typography>
                        </div>
                    </motion.div>
                   
                    {/* <div className="flex flex-row items-center">
                        <Tabs
                            value={tabValue}
                            onChange={(event, value) => setTabValue(value)}
                            indicatorColor="secondary"
                            textColor="inherit"
                            variant="scrollable"
                            scrollButtons="off"
                            className="w-full -mx-4 min-h-40"
                            classes={{ indicator: 'flex justify-center bg-transparent w-full h-full' }}
                            TabIndicatorProps={{
                                children: <Divider className="w-full h-full rounded-full opacity-50" />,
                            }}
                        >
                            {Object.keys(data.series).map((key) => (
                                <Tab
                                    key={key}
                                    className="text-14 font-semibold min-h-40 min-w-64 mx-4 capitalize"
                                    disableRipple
                                    label={key}
                                />
                            ))}
                        </Tabs>
                    </div> */}
        </div>
        <div className="container relative h-200 sm:h-256 pb-16">
          <ReactApexChart
            options={chartData.options}
            series={chartData.series['2022']}
            type={data.options.chart.type}
            height={data.options.chart.height}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default memo(Widget1);
