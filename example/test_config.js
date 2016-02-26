/* eslint-disable max-len*/

import { merge } from 'lodash';

export const barChart2Series = {
    buckets: {
        metrics: [{
            type: 'metric',
            identifier: 'aaYh6Voua2yj',
            title: '# of Open Opps.',
            summary: '',
            uri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/13465',
            showInPercent: false,
            showPoP: false,
            format: '#,##0',
            colorIndex: 0,
            expression: 'select [/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/2825] where [/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1093]=[/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1093/elements?id=7]',
            filters: [],
            bucket: 'metrics'
        }, {
            type: 'metric',
            identifier: 'afdV48ABh8CN',
            title: '# of Opportunities',
            summary: '',
            uri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/2825',
            showInPercent: false,
            showPoP: false,
            format: '#,##0',
            colorIndex: 1,
            expression: 'SELECT count([/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/990],[/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1143]) where [/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1147]=[/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1275]',
            filters: [],
            bucket: 'metrics'
        }],
        categories: [{
            type: 'date',
            identifier: 'closed.year',
            title: 'Date',
            summary: 'Represents all your dates in project. Can group by Day, Week, Month, Quarter & Year.',
            uri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/323',
            granularity: 'GDC.time.year',
            dfIdentifier: 'closed.aag81lMifn6q',
            bucket: 'categories'
        }],
        stacks: [],
        filters: [{
            type: 'date',
            identifier: 'closed.year',
            title: 'Date',
            summary: 'Represents all your dates in project. Can group by Day, Week, Month, Quarter & Year.',
            uri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/323',
            granularity: 'GDC.time.year',
            dfUri: 'closed.aag81lMifn6q',
            bucket: 'filters',
            generatedFor: {
                bucketKey: 'categories',
                identifier: 'closed.year'
            }
        }]
    },
    visualizationType: 'line',
    sorting: {},
    dateDimensionId: 'closed.dim_date'
};

export const stackedBar = {
    buckets: {
        metrics: [{
            type: 'metric',
            identifier: 'aaYh6Voua2yj',
            title: '# of Open Opps.',
            summary: '',
            uri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/13465',
            showInPercent: false,
            showPoP: false,
            format: '#,##0',
            colorIndex: 0,
            expression: 'select [/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/2825] where [/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1093]=[/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1093/elements?id=7]',
            filters: [],
            bucket: 'metrics'
        }],
        categories: [{
            type: 'attribute',
            identifier: 'attr.owner.id',
            title: 'Sales Rep',
            summary: '',
            uri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1025',
            elementsUri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1028/elements',
            dfUri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1028',
            dfIdentifier: 'label.owner.id.name',
            bucket: 'categories'
        }],
        stacks: [{
            type: 'attribute',
            identifier: 'attr.stage.name',
            title: 'Stage Name',
            summary: '',
            uri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1095',
            elementsUri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1805/elements',
            dfUri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1805',
            dfIdentifier: 'label.stage.name.stagename',
            bucket: 'stacks'
        }],
        filters: [{
            isInverted: true,
            title: 'Sales Rep: All',
            allSelected: true,
            selectionSize: 0,
            generatedFor: {
                bucketKey: 'categories',
                identifier: 'attr.owner.id'
            },
            modified: false,
            type: 'attribute',
            selectedElements: [],
            attribute: {
                type: 'attribute',
                identifier: 'attr.owner.id',
                title: 'Sales Rep',
                summary: '',
                uri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1025',
                elementsUri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1028/elements',
                dfUri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1028',
                dfIdentifier: 'label.owner.id.name'
            },
            bucket: 'filters'
        }, {
            isInverted: true,
            title: 'Stage Name: All',
            allSelected: true,
            selectionSize: 0,
            generatedFor: {
                bucketKey: 'stacks',
                identifier: 'attr.stage.name'
            },
            modified: false,
            type: 'attribute',
            selectedElements: [],
            attribute: {
                type: 'attribute',
                identifier: 'attr.stage.name',
                title: 'Stage Name',
                summary: '',
                uri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1095',
                elementsUri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1805/elements',
                dfUri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1805',
                dfIdentifier: 'label.stage.name.stagename'
            },
            bucket: 'filters'
        }]
    },
    visualizationType: 'column',
    sorting: {}
};

export const table = merge({}, stackedBar, { visualizationType: 'table' });
