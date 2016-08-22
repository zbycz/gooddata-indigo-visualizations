import ReactHighcharts from 'react-highcharts';
import React, { Component, PropTypes } from 'react';

export default class LineFamilyChart extends Component {
    static propTypes = {
        hcOptions: PropTypes.object.isRequired,
        chartOptions: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);

        this.afterRender = this.afterRender.bind(this);
    }

    afterRender(chart) {
        if (!this.props.chartOptions.zoomable) {
            // do not trap mouse events, for details @see
            // https://stackoverflow.com/questions/11618075/highcharts-stop-chart-from-trapping-mouse-events-or-capture-mouse-click-on-the
            chart.container.onclick = null; //eslint-disable-line
            chart.container.onmousedown = null; //eslint-disable-line
        }
    }

    render() {
        return (
            <ReactHighcharts
                config={this.props.hcOptions}
                callback={this.afterRender}
            />
        );
    }
}
