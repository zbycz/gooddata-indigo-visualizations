import React, { Component, PropTypes } from 'react';
import includes from 'lodash/includes';
import invariant from 'invariant';

import './styles/chart.scss';

import LineFamilyChartTransformation from './LineFamilyChartTransformation';
import TableTransformation from './TableTransformation';
import * as VisualizationTypes from './VisualizationTypes';

function isLineFamily(visType) {
    return includes([
        VisualizationTypes.COLUMN_CHART,
        VisualizationTypes.LINE_CHART,
        VisualizationTypes.BAR_CHART
    ], visType);
}

export default class Visualization extends Component {
    static propTypes = {
        config: PropTypes.shape({
            type: PropTypes.string.isRequired
        }).isRequired,
        height: PropTypes.number
    };

    render() {
        const visType = this.props.config.type;

        if (isLineFamily(visType)) {
            return (
                <LineFamilyChartTransformation {...this.props} />
            );
        }

        if (visType === VisualizationTypes.TABLE) {
            return (
                <TableTransformation {...this.props} />
            );
        }

        invariant(`Unknown visualization type: ${visType}`);
    }
}
