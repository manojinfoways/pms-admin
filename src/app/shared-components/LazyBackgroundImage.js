import React from "react";

class LazyBackgroundImage extends React.Component {
    state = {src: null};

    componentDidMount() {
        const {src} = this.props;

        const imageLoader = new Image();
        imageLoader.src = src;

        imageLoader.onload = () => {
            this.setState({src});
        };
    }

    render() {
        return <div {...this.props}
                    style={{backgroundImage: `url(${this.state.src || "assets/images/backgrounds/image-loader.gif"})`}}/>;
    }
}

export default LazyBackgroundImage;