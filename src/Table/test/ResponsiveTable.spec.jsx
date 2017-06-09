import React from 'react';
import {
    renderIntoDocument,
    findRenderedComponentWithType,
    findRenderedDOMComponentWithClass,
    Simulate
} from 'react-addons-test-utils';
import { range } from 'lodash';

import { withIntl } from '../../test/utils';

import ResponsiveTable from '../ResponsiveTable';
import Table from '../Table';
import { TableControls } from '../TableControls';

const HEADERS = [
    {
        type: 'attrLabel',
        title: 'Name'
    }, {
        type: 'metric',
        title: '# of Open Opps.',
        format: '#,##0'
    }, {
        type: 'metric',
        title: '# of Opportunities',
        format: '[red]#,##0'
    }
];

const DATA_ROW = ['Wile E. Coyote', '30', '1324'];

const ROWS_PER_PAGE = 10;

describe('Responsive Table', () => {
    let table, visualization, controls, onMore, onLess; // eslint-disable-line

    const renderTable = (data) => {
        const WrappedTable = withIntl(ResponsiveTable);
        table = renderIntoDocument(
            <WrappedTable
                containerWidth={600}
                rows={data.rawData}
                headers={data.headers}
                rowsPerPage={ROWS_PER_PAGE}
                onMore={onMore}
                onLess={onLess}
            />
        );

        visualization = findRenderedComponentWithType(table, Table);
        controls = findRenderedComponentWithType(table, TableControls);
    };

    const getMore = () => findRenderedDOMComponentWithClass(controls, 's-show_more');

    const getLess = () => findRenderedDOMComponentWithClass(controls, 's-show_less');

    beforeEach(() => {
        onMore = jest.fn();
        onLess = jest.fn();
    });

    it('should set container width', () => {
        renderTable({ headers: [], rawData: [] });

        expect(visualization.props.containerWidth).toEqual(600);
    });

    describe('when data contains less than 1 page of rows', () => {
        beforeEach(() => {
            const fixture = {
                headers: HEADERS,
                rawData: [DATA_ROW]
            };

            renderTable(fixture);
        });

        it('should not show "More" button', () => {
            expect(getMore).toThrow();
        });

        it('should not show "Less" button', () => {
            expect(getLess).toThrow();
        });

        it('should set correct number of rows', () => {
            expect(visualization.props.rows.length).toEqual(1);
        });
    });

    describe('when data contains more than 1 page of rows', () => {
        beforeEach(() => {
            const fixture = {
                headers: HEADERS,
                rawData: range(0, 25).map(() => DATA_ROW)
            };

            renderTable(fixture);
        });

        describe('and table is showing first page', () => {
            it('should show "More" button', () => {
                expect(getMore).not.toThrow();
            });

            it('should not show "Less" button', () => {
                expect(getLess).toThrow();
            });

            it('should set correct number of rows', () => {
                expect(visualization.props.rows.length).toEqual(ROWS_PER_PAGE);
            });

            it('should call onMore callback with number of rows and page when user clicks "More"', () => {
                Simulate.click(getMore());

                expect(onMore).toBeCalledWith({
                    rows: ROWS_PER_PAGE * 2,
                    page: 2
                });
            });
        });

        describe('and table is showing some page', () => {
            beforeEach(() => {
                Simulate.click(getMore());
            });

            it('should show "Less" button', () => {
                expect(getLess).not.toThrow();
            });

            it('should set correct number of rows', () => {
                expect(visualization.props.rows.length).toEqual(ROWS_PER_PAGE * 2);
            });

            it('should return to first page when user clicks "Less"', () => {
                Simulate.click(getLess());

                expect(visualization.props.rows.length).toEqual(ROWS_PER_PAGE);
            });

            it('should call onLess callback with number of rows when user clicks "Less"', () => {
                Simulate.click(getLess());

                expect(onLess).toBeCalledWith({ rows: ROWS_PER_PAGE });
            });
        });

        describe('and table is showing last page', () => {
            let more;

            beforeEach(() => {
                more = getMore();
                Simulate.click(more);
                Simulate.click(more);
            });

            it('should hide "More" button', () => {
                expect(getMore).toThrow();
            });

            it('should show "Less" button', () => {
                expect(getLess).not.toThrow();
            });

            it('should set correct number of rows', () => {
                expect(visualization.props.rows.length).toEqual(25);
            });

            it('should return to first page when user clicks "Less"', () => {
                Simulate.click(getLess());

                expect(visualization.props.rows.length).toEqual(ROWS_PER_PAGE);
            });
        });
    });
});
