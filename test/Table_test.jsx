import { TableVisualization } from '../src/Table';
import { Table } from 'fixed-data-table';
import React from 'react';
import ReactTestUtils from 'react-addons-test-utils';

let {
    renderIntoDocument,
    findRenderedComponentWithType
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

    beforeEach(() => {
        let instance = renderIntoDocument(
            <TableVisualization
                containerWidth={600}
                containerHeight={400}
                rows={FIXTURE.rawData}
                headers={FIXTURE.headers}
            />
        );
        table = findRenderedComponentWithType(instance, Table);
    });

    it('should fit container dimensions', () => {
        expect(table.props.width).to.be(600);
        expect(table.props.height).to.be(400);
    });

    it('should render column headers', () => {
        expect(table.props.children).to.have.length(3);
    });

    it('should align metric columns to the right', () => {
        let columns = table.props.children;
        expect(columns[0].props.align).to.be('left');
        expect(columns[1].props.align).to.be('right');
        expect(columns[2].props.align).to.be('right');
    });

    it('should distribute width evenly between columns', () => {
        let columns = table.props.children;
        expect(columns[0].props.width).to.be(200);
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
            expect(spanContent).to.be('1,324');
            expect(span.props.style.color).to.be('#FF0000');
        });

        it('should render attributes as strings', () => {
            let span = renderCell(0);
            let spanContent = span.props.children;
            expect(spanContent).to.be('Wile E. Coyote');
            expect(span.props.style).to.eql({});
        });

        it('should render title into header', () => {
            let columns = table.props.children;
            let header = columns[0].props.header({ columnKey: 0 });
            expect(header.props.children).to.be('Name');
        });
    });
});
