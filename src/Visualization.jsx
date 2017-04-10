import React, { Component, PropTypes } from 'react';
import invariant from 'invariant';
import { isEqual, isFunction, omitBy, includes } from 'lodash';

import './styles/chart.scss';

import LineFamilyChartTransformation from './Chart/LineFamilyChartTransformation';
import PieChartTransformation from './Chart/PieChartTransformation';
import TableTransformation from './Table/TableTransformation';
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
        afterRender: PropTypes.func
    };

    static defaultProps = {
        afterRender: () => {}
    };

    shouldComponentUpdate(nextProps) {
        return !isEqual(omitBy(this.props, isFunction), omitBy(nextProps, isFunction));
    }

    render() {
        const visType = this.props.config.type;


        if (isLineFamily(visType)) {
            return (
                <LineFamilyChartTransformation {...this.props} />
            );
        }

        if (visType === VisualizationTypes.PIE_CHART) {
            return (
                <PieChartTransformation {...this.props} />
            );
        }

        if (visType === VisualizationTypes.TABLE) {
            return (
                <TableTransformation {...this.props} />
            );
        }

        return invariant(`Unknown visualization type: ${visType}`);
    }
}
