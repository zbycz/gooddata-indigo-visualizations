import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';
import { Table } from 'fixed-data-table-2';

import { TableVisualization } from '../Table';
import { ASC, DESC } from '../Sort';
import { withIntl } from '../../test/utils';

const {
    renderIntoDocument,
    findRenderedComponentWithType,
    scryRenderedDOMComponentsWithClass,
    Simulate
} = ReactTestUtils;

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
        ['Wile E. Coyote', '30', '1324']
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
        expect(table.props.width).to.equal(600);
        expect(table.props.height).to.equal(400);
    });

    it('should render column headers', () => {
        expect(table.props.children).to.have.length(3);
    });

    it('should align metric columns to the right', () => {
        let columns = table.props.children;
        expect(columns[0].props.align).to.equal('left');
        expect(columns[1].props.align).to.equal('right');
        expect(columns[2].props.align).to.equal('right');
    });

    it('should distribute width evenly between columns', () => {
        let columns = table.props.children;
        expect(columns[0].props.width).to.equal(200);
    });

    describe('renderers', () => {
        function renderCell(columnKey) {
            let columns = table.props.children;
            let cell = columns[columnKey].props.cell({ rowIndex: 0, columnKey });
            let span = cell.props.children;
            return span;
        }

        it('should format metrics', () => {
            let span = renderCell(2);
            let spanContent = span.props.children;
            expect(spanContent).to.equal('1,324');
            expect(span.props.style.color).to.equal('#FF0000');
        });

        it('should render attributes as strings', () => {
            let span = renderCell(0);
            let spanContent = span.props.children;
            expect(spanContent).to.equal('Wile E. Coyote');
            expect(span.props.style).to.eql({});
        });

        it('should render title into header', () => {
            const titles = scryRenderedDOMComponentsWithClass(table, 'gd-table-header-title');
            expect(titles[0].textContent).to.equal('Name');
        });
    });

    describe('sort', () => {
        context('default header renderer', () => {
            it('should render up arrow', () => {
                table = renderTable({ sortBy: 0, sortDir: ASC });
                let columns = table.props.children;
                let header = columns[0].props.header({ columnKey: 0 });
                let sort = header.props.children[1];

                expect(sort.props.className).to.equal('gd-table-arrow-up');
            });

            it('should render down arrow', () => {
                table = renderTable({ sortBy: 0, sortDir: DESC });
                let columns = table.props.children;
                let header = columns[0].props.header({ columnKey: 0 });
                let sort = header.props.children[1];

                expect(sort.props.className).to.equal('gd-table-arrow-down');
            });

            it('should render arrow on second column', () => {
                table = renderTable({ sortBy: 1, sortDir: ASC });
                let columns = table.props.children;
                let header = columns[1].props.header({ columnKey: 0 });
                let sort = header.props.children[1];

                expect(sort.props.className).to.equal('gd-table-arrow-up');
            });

            it('should not render arrow if sort info is missing', () => {
                table = renderTable({ sortBy: 0, sortDir: null });
                let columns = table.props.children;
                let header = columns[0].props.header({ columnKey: 0 });
                let sort = header.props.children[1];

                expect(sort.props.className).to.equal('');
            });
        });

        context('tooltip header renderer', () => {
            it('should render title into header', () => {
                table = renderTable({ sortInTooltip: true });
                const titles = scryRenderedDOMComponentsWithClass(table, 'gd-table-header-title');
                Simulate.click(titles[0]);

                const bubble = document.querySelector('.gd-table-header-bubble');
                expect(bubble).to.be.ok();

                // work-around to handle overlays
                document.body.innerHTML = '';
            });
        });
    });
});
