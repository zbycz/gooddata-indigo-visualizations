import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { range } from 'lodash';

import { withIntl } from './utils.js';

import ResponsiveTable from '../src/ResponsiveTable';
import TableVisualization from '../src/Table';
import { TableControls } from '../src/TableControls';

const {
    renderIntoDocument,
    findRenderedComponentWithType,
    findRenderedDOMComponentWithClass,
    Simulate: {
        click
    }
} = ReactTestUtils;

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
    let table, visualization, controls, onMore, onLess;

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

        visualization = findRenderedComponentWithType(table, TableVisualization);
        controls = findRenderedComponentWithType(table, TableControls);
    };

    const getMore = () => {
        return findRenderedDOMComponentWithClass(controls, 's-show_more');
    };

    const getLess = () => {
        return findRenderedDOMComponentWithClass(controls, 's-show_less');
    };

    beforeEach(() => {
        onMore = sinon.stub();
        onLess = sinon.stub();
    });

    it('should set container width', () => {
        renderTable({ headers: [], rawData: [] });

        expect(visualization.props.containerWidth).to.equal(600);
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
            expect(getMore).to.throw();
        });

        it('should not show "Less" button', () => {
            expect(getLess).to.throw();
        });

        it('should set correct number of rows', () => {
            expect(visualization.props.rows.length).to.equal(1);
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
                expect(getMore).not.to.throw();
            });

            it('should not show "Less" button', () => {
                expect(getLess).to.throw();
            });

            it('should set correct number of rows', () => {
                expect(visualization.props.rows.length).to.equal(ROWS_PER_PAGE);
            });

            it('should call onMore callback with number of rows when user clicks "More"', () => {
                click(getMore());

                expect(onMore).to.be.calledWith({ rows: ROWS_PER_PAGE * 2 });
            });
        });

        describe('and table is showing some page', () => {
            beforeEach(() => {
                click(getMore());
            });

            it('should show "Less" button', () => {
                expect(getLess).not.to.throw();
            });

            it('should set correct number of rows', () => {
                expect(visualization.props.rows.length).to.equal(ROWS_PER_PAGE * 2);
            });

            it('should return to first page when user clicks "Less"', () => {
                click(getLess());

                expect(visualization.props.rows.length).to.equal(ROWS_PER_PAGE);
            });

            it('should call onLess callback with number of rows when user clicks "Less"', () => {
                click(getLess());

                expect(onLess).to.be.calledWith({ rows: ROWS_PER_PAGE });
            });
        });

        describe('and table is showing last page', () => {
            let more;

            beforeEach(() => {
                more = getMore();
                click(more);
                click(more);
            });

            it('should hide "More" button', () => {
                expect(getMore).to.throw();
            });

            it('should show "Less" button', () => {
                expect(getLess).not.to.throw();
            });

            it('should set correct number of rows', () => {
                expect(visualization.props.rows.length).to.equal(25);
            });

            it('should return to first page when user clicks "Less"', () => {
                click(getLess());

                expect(visualization.props.rows.length).to.equal(ROWS_PER_PAGE);
            });
        });
    });
});
