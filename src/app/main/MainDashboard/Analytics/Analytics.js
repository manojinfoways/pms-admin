import { useEffect,useState } from "react";
 
import { useDispatch,useSelector } from "react-redux";
import { motion } from 'framer-motion';
 
import Typography from "@material-ui/core/Typography";
import {setToolbarHeader} from "app/store/fuse/toolbarHeaderSlice";
import Widget1 from "./Widget1";
import Verticle1 from "./Verticle1";
import Verticle2 from "./Verticle2";
import FullvacineCnt from "./FullvacineCnt";
import PartialvacineCnt from "./PartialvacineCnt";

import Chart from "./Chart";
import { fetchChartData73 } from "../../Survey/Admin/store/chartSlice";
let fullcnt = 0;
let parcnt = 0;
const Analytics = () => {
    const dispatch = useDispatch()
  const chartData73 = useSelector(({ chart }) => chart.chartData73);
  const [fullcnt, setFullcnt] = useState(0);
  const [parcnt, setParcnt] = useState(0);
    
    useEffect(() => {
        dispatch(setToolbarHeader('Analytics'));
        dispatch(fetchChartData73());
    }, [])
    
    useEffect(() => {
        let full = chartData73.find(i => { return i.choice_id == 161 });
         setFullcnt(full ? full.response_count : 0);
        let partial = chartData73.find(i => { return i.choice_id == 162 });
        setParcnt(partial ? partial.response_count : 0);
    },[chartData73])
    

    const container = {
		show: {
			transition: {
				staggerChildren: 0.1
			}
		}
	};

	const item = {
		hidden: { opacity: 0, y: 20 },
		show: { opacity: 1, y: 0 }
	};

    return (
        <motion.div className="flex flex-wrap" variants={container} initial="hidden" animate="show">
			<motion.div variants={ item } className="widget w-full p-12">
                <Widget1  />
            </motion.div>
            <div className="flex  w-full flex-col min-w-0 pt-16">
					{/* <Typography
						component={motion.div}
						variants={item}
						className="px-16 pb-8 text-18 font-normal"
						color="textSecondary"
					>
						How are your active users trending over time?
					</Typography> */}

					<div className="flex flex-col sm:flex sm:flex-row pb-32">
						<motion.div variants={item} className="widget flex w-full sm:w-1/3 p-16">
							<FullvacineCnt  cnt={fullcnt}  />
						</motion.div>

						<motion.div variants={item} className="widget flex w-full sm:w-1/3 p-16">
							<PartialvacineCnt cnt={parcnt}  />
						</motion.div>

						<motion.div variants={item} className="  w-full sm:w-1/3 p-16">
						</motion.div>
                </div>
              </div>  
            
            <motion.div variants={ item } className="widget flex w-full p-12">
                <Verticle1  />
            </motion.div>
            <motion.div variants={ item } className="widget flex w-full p-12">
                <Verticle2  />
            </motion.div>
            <motion.div variants={ item } className="widget flex w-full p-12">
                <Chart  />
            </motion.div>
    </motion.div>
    )
}

export default Analytics