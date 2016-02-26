import ReactHighcharts from 'react-highcharts/bundle/highcharts';
import React, { Component, PropTypes } from 'react';

export default class extends Component {
    static propTypes = {
        hcOptions: PropTypes.object.isRequired
    };

    render() {
        return (
            <ReactHighcharts
                config={this.props.hcOptions}
            />
        );
    }
}
