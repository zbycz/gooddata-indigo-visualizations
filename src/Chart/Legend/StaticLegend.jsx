import React, { Component, PropTypes } from 'react';
import shallowCompare from 'react-addons-shallow-compare';
import { FormattedMessage } from 'react-intl';
import cx from 'classnames';

import LegendItem from './LegendItem';
import { calculateStaticLegend, ITEM_HEIGHT } from './helpers';

export default class StaticLegend extends Component {

    static propTypes = {
        chartType: PropTypes.string.isRequired,
        series: PropTypes.array.isRequired,
        onItemClick: PropTypes.func.isRequired,
        containerHeight: PropTypes.number,
        position: PropTypes.string.isRequired
    };

    static defaultProps = {
        containerHeight: null
    };

    constructor(props) {
        super(props);
        this.state = {
            page: 1
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return shallowCompare(this, nextProps, nextState);
    }

    renderPagingButton(type, handler, disabled) {
        const classes = cx(
            'button-link',
            'button-icon-only',
            `icon-chevron-${type}`,
            'paging-button'
        );
        return <button className={classes} onClick={handler} disabled={disabled} />;
    }

    renderPaging(visibleItemsCount) {
        const { page } = this.state;
        const pagesCount = Math.ceil(this.props.series.length / visibleItemsCount);

        const showNextPage = () => this.setState({ page: this.state.page + 1 });
        const showPrevPage = () => this.setState({ page: this.state.page - 1 });

        return (
            <div className="paging">
                {this.renderPagingButton('up', showPrevPage, page === 1)}
                <FormattedMessage
                    id="visualizations.of"
                    values={{
                        page: <strong>{page}</strong>,
                        pagesCount
                    }}
                />
                {this.renderPagingButton('down', showNextPage, page === pagesCount)}
            </div>
        );
    }

    render() {
        const { series, chartType, onItemClick, position, containerHeight } = this.props;
        const { page } = this.state;

        const classNames = cx('viz-legend', 'static', `position-${position}`);

        if (position === 'top') {
            return (
                <div className={classNames}>
                    <div className="series">
                        {series.map((item) => {
                            return (
                                <LegendItem
                                    chartType={chartType}
                                    key={item.name}
                                    item={item}
                                    onItemClick={onItemClick}
                                />
                            );
                        })}
                    </div>
                </div>
            );
        }

        const {
            hasPaging,
            visibleItemsCount
        } = calculateStaticLegend(series.length, containerHeight);

        const start = (page - 1) * visibleItemsCount;
        const end = Math.min(visibleItemsCount * page, series.length);

        const pagedSeries = series.slice(start, end);

        return (
            <div className={classNames}>
                <div className="series" style={{ height: visibleItemsCount * ITEM_HEIGHT }}>
                    {pagedSeries.map((item) => {
                        return (
                            <LegendItem
                                chartType={chartType}
                                key={item.name}
                                item={item}
                                onItemClick={onItemClick}
                            />
                        );
                    })}
                </div>
                {hasPaging && this.renderPaging(visibleItemsCount)}
            </div>
        );
    }
}
