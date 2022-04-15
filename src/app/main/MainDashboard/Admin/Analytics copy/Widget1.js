import _ from '@lodash';
import Divider from '@material-ui/core/Divider';
import { alpha } from '@material-ui/core/styles/colorManipulator';
import { makeStyles, ThemeProvider, useTheme } from '@material-ui/core/styles';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import Typography from '@material-ui/core/Typography';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { memo, useState } from 'react';
import ReactApexChart from 'react-apexcharts';
import { useSelector } from 'react-redux';
import { selectContrastMainTheme } from 'app/store/fuse/settingsSlice';

const useStyles = makeStyles((theme) => ({
    root: {
        background: `linear-gradient(to right, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
        color: theme.palette.primary.contrastText,
    },
}));

const chartData = {
    id: 'widget1',
    series: {
        2019: [
            {
                name: 'Sales',
                data: [1.9, 3, 3.4, 2.2, 2.9, 3.9, 2.5, 3.8, 4.1, 3.8, 3.2, 2.9],
                fill: 'start'
            }
        ],
        2020: [
            {
                name: 'Sales',
                data: [2.2, 2.9, 3.9, 2.5, 3.8, 3.2, 2.9, 1.9, 3, 3.4, 4.1, 3.8],
                fill: 'start'
            }
        ],
        2021: [
            {
                name: 'Sales',
                data: [3.9, 2.5, 3.8, 4.1, 1.9, 3, 3.8, 3.2, 2.9, 3.4, 2.2, 2.9],
                fill: 'start'
            }
        ]
    },
    options: {
        chart: {
            type: 'area',
            height: '100%',
            background: 'transparent',
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            }
        },
        theme: {
            mode: 'dark'
        },
        dataLabels: {
            enabled: false
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            tooltip: {
                enabled: false
            },
            axisBorder: {
                show: false
            }
        },
        yaxis: {
            axisBorder: {
                show: false
            }
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
                size: 5
            }
        },
        fill: {
            type: 'solid',
            opacity: 0.7,
            gradient: {
                shadeIntensity: 0.4,
                opacityFrom: 1,
                opacityTo: 0.5,
                stops: [30, 100, 100]
            }
        },
        grid: {
            show: true,
            strokeDashArray: 3,
            position: 'back',
            xaxis: {
                lines: {
                    show: true
                }
            },
            yaxis: {
                lines: {
                    show: true
                }
            },
            padding: {
                top: 0,
                right: 0,
                bottom: 0,
                left: 0
            }
        },
        stroke: {
            show: true,
            curve: 'smooth',
            lineCap: 'butt',
            width: 1.5,
            dashArray: 0
        }
    }
}

function Widget1(props) {
    const classes = useStyles(props);
    const theme = useTheme();
    const contrastTheme = useSelector(selectContrastMainTheme(theme.palette.primary.main));
    const data = _.merge({}, chartData);
    const [tabValue, setTabValue] = useState(2);
    const series = data.series[Object.keys(data.series)[tabValue]];

    _.setWith(data, 'options.fill.colors', [theme.palette.secondary.main]);
    _.setWith(data, 'options.markers.colors', [theme.palette.secondary.main]);
    _.setWith(data, 'options.stroke.colors', [theme.palette.primary.contrastText]);
    _.setWith(data, 'options.markers.strokeColors', [theme.palette.primary.contrastText]);
    _.setWith(data, 'options.grid.borderColor', alpha(theme.palette.primary.contrastText, 0.3));

    return (
        <ThemeProvider theme={contrastTheme}>
            <div className={clsx(classes.root)}>
                <div className="container relative p-16 sm:p-24 flex flex-col sm:flex-row justify-between items-center">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                        <div className="flex flex-col items-center sm:items-start mb-16 sm:mb-0">
                            <Typography className="h2 font-medium" color="textPrimary">
                                Billing Summary
                            </Typography>
                            <Typography className="h5" color="textSecondary">
                                User Billing by month
                            </Typography>
                        </div>
                    </motion.div>

                    <div className="flex flex-row items-center">
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
                    </div>
                </div>
                <div className="container relative h-200 sm:h-256 pb-16">
                    <ReactApexChart
                        options={data.options}
                        series={series}
                        type={data.options.chart.type}
                        height={data.options.chart.height}
                    />
                </div>
            </div>
        </ThemeProvider>
    );
}

export default memo(Widget1);
