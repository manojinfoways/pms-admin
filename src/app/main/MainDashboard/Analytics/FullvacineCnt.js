import Card from '@material-ui/core/Card';
import Icon from '@material-ui/core/Icon';
import { useTheme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import _ from '@lodash';
import ReactApexChart from 'react-apexcharts';

function Widget2(props) {
	const theme = useTheme();
	return (
		<Card className="w-full rounded-20 shadow">
			<div className="p-20 pb-0">
				<Typography className="h3 font-medium">Fully Vaccinated</Typography>
				<div className="flex flex-row flex-wrap items-center mt-12">
					<Typography className="text-48 font-semibold mb-20 leading-none tracking-tighter">
                    {props.cnt}
					</Typography>

					<div className="flex flex-col mx-8 m-20">
							<div className="flex items-center">
							<Typography className="font-semibold" color="textSecondary">
								
							</Typography>
							 
						</div>
					</div>
				</div>
			</div>
		</Card>
	);
}

export default Widget2;
