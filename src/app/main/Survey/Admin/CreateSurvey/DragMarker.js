import React, { Component } from "react";
import GoogleMapReact from "google-map-react";

let marker;

class DragMarker extends Component {
	state = {
		center: {
			lat: parseFloat(this.props.center.lat),
			lng: parseFloat(this.props.center.lng)
		},
		render: false
	};

	componentDidMount() {
		if (this.props.center) {
			if (this.props.center && this.props.center.lat != this.state.center.lat) {
				this.setState({ center: this.props.center, render: false });
				setTimeout(() => {
					this.setState({ render: true });
				}, 100);
			}
		}
	}

	loadMap = (map, maps) => {
		const cityCircle = new maps.Circle({
			map,
			center: this.state.center,
			draggable: true
		});

		marker = new maps.Marker({
			position: this.state.center,
			map,
			draggable: true
		});

		marker.addListener('dragend', () => {
			let latlng = JSON.stringify(marker.getPosition());
			this.setState({ center: { lat: marker.getPosition().lat(), lng: marker.getPosition().lng() } });
			this.props.handleUpdatCenter({ lat: marker.getPosition().lat(), lng: marker.getPosition().lng() });
		});
	};

	render() {
		let { render } = this.state;
		return (
			<div style={{ height: '300px', width: '100%',marginBottom:"30px" }} >
				<GoogleMapReact
					bootstrapURLKeys={{ key: `${process.env.REACT_APP_GOOGLE_MAP_KEY}` }}
					defaultCenter={this.state.center}
					defaultZoom={12}
					center={this.state.center}
					yesIWantToUseGoogleMapApiInternals
					onGoogleApiLoaded={({ map, maps }) => this.loadMap(map, maps)}
					// onRegionChangeComplete={region => {
					//   setZoom(Math.round(Math.log(360 / region.latitudeDelta) / Math.LN2))
					// }}
				/>

        { this.state.center ? (JSON.stringify(this.state.center)) : null }
			</div>
		);
	}
}

export default DragMarker;
