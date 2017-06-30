import React from 'react';
import {
    renderIntoDocument,
    findRenderedComponentWithType,
    scryRenderedDOMComponentsWithClass,
    Simulate
} from 'react-addons-test-utils';
import { Table } from 'fixed-data-table-2';

import TableVisualization from '../TableVisualization';
import { ASC, DESC } from '../Sort';
import { withIntl } from '../../test/utils';

const FIXTURE = {
    headers: [
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
    ],
    rawData: [
        [{ id: '1', name: 'Wile E. Coyote' }, '30', '1324']
    ]
};

describe('Table', () => {
    let table;

    function renderTable(customProps = {}) {
        const props = {
            containerWidth: 600,
            containerHeight: 400,
            rows: FIXTURE.rawData,
            headers: FIXTURE.headers,
            ...customProps
        };

        const WrappedTable = withIntl(TableVisualization);
        const instance = renderIntoDocument(
            <WrappedTable {...props} />
        );
        return findRenderedComponentWithType(instance, Table);
    }

    beforeEach(() => {
        table = renderTable();
    });

    it('should fit container dimensions', () => {
        expect(table.props.width).toEqual(600);
        expect(table.props.height).toEqual(400);
    });

    it('should render column headers', () => {
        expect(table.props.children).toHaveLength(3);
    });

    it('should align metric columns to the right', () => {
        const columns = table.props.children;
        expect(columns[0].props.align).toEqual('left');
        expect(columns[1].props.align).toEqual('right');
        expect(columns[2].props.align).toEqual('right');
    });

    it('should distribute width evenly between columns', () => {
        const columns = table.props.children;
        expect(columns[0].props.width).toEqual(200);
    });

    describe('renderers', () => {
        function renderCell(columnKey) {
            const columns = table.props.children;
            const cell = columns[columnKey].props.cell({ rowIndex: 0, columnKey });
            const span = cell.props.children;
            return span;
        }

        it('should format metrics', () => {
            const span = renderCell(2);
            const spanContent = span.props.children;
            expect(spanContent).toEqual('1,324');
            expect(span.props.style.color).toEqual('#FF0000');
        });

        it('should render attributes as strings', () => {
            const span = renderCell(0);
            const spanContent = span.props.children;
            expect(spanContent).toEqual('Wile E. Coyote');
            expect(span.props.style).toEqual({});
        });

        it('should render title into header', () => {
            const titles = scryRenderedDOMComponentsWithClass(table, 'gd-table-header-title');
            expect(titles[0].textContent).toEqual('Name');
        });
    });

    describe('sort', () => {
        describe('default header renderer', () => {
            it('should render up arrow', () => {
                table = renderTable({ sortBy: 0, sortDir: ASC });
                const columns = table.props.children;
                const header = columns[0].props.header({ columnKey: 0 });
                const sort = header.props.children[1];

                expect(sort.props.className).toEqual('gd-table-arrow-up');
            });

            it('should render down arrow', () => {
                table = renderTable({ sortBy: 0, sortDir: DESC });
                const columns = table.props.children;
                const header = columns[0].props.header({ columnKey: 0 });
                const sort = header.props.children[1];

                expect(sort.props.className).toEqual('gd-table-arrow-down');
            });

            it('should render arrow on second column', () => {
                table = renderTable({ sortBy: 1, sortDir: ASC });
                const columns = table.props.children;
                const header = columns[1].props.header({ columnKey: 0 });
                const sort = header.props.children[1];

                expect(sort.props.className).toEqual('gd-table-arrow-up');
            });

            it('should not render arrow if sort info is missing', () => {
                table = renderTable({ sortBy: 0, sortDir: null });
                const columns = table.props.children;
                const header = columns[0].props.header({ columnKey: 0 });
                const sort = header.props.children[1];

                expect(sort.props.className).toEqual('');
            });
        });

        describe('tooltip header renderer', () => {
            it('should render title into header', () => {
                table = renderTable({ sortInTooltip: true });
                const titles = scryRenderedDOMComponentsWithClass(table, 'gd-table-header-title');
                Simulate.click(titles[0]);

                const bubble = document.querySelector('.gd-table-header-bubble');
                expect(bubble).toBeDefined();

                // work-around to handle overlays
                document.body.innerHTML = '';
            });
        });
    });
});
