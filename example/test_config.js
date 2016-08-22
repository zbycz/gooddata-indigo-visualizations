import { assign } from 'lodash';

/* eslint-disable max-len*/

export const barChart2Series = {
    type: 'line',
    buckets: {
        measures: [
            {
                measure: {
                    type: 'metric',
                    objectUri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/13465',
                    metricAttributeFilters: [],
                    showInPercent: false,
                    showPoP: false,
                    format: '#,##0',
                    sorts: []
                }
            },
            {
                measure: {
                    type: 'metric',
                    objectUri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/2825',
                    metricAttributeFilters: [],
                    showInPercent: false,
                    showPoP: false,
                    format: '#,##0',
                    sorts: []
                }
            }
        ],
        categories: [
            {
                category: {
                    type: 'date',
                    collection: 'attribute',
                    displayForm: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/324',
                    dateFilterSettings: {
                        granularity: 'GDC.time.year'
                    }
                }
            }
        ],
        filters: [
            {
                dateFilterSettings: {
                    granularity: 'GDC.time.year',
                    dataSet: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/324'
                }
            }
        ]
    }
};

export const stackedBar = {
    type: 'column',
    buckets: {
        measures: [
            {
                measure: {
                    type: 'metric',
                    objectUri: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/13465',
                    metricAttributeFilters: [],
                    showInPercent: false,
                    showPoP: false,
                    format: '#,##0',
                    sorts: []
                }
            }
        ],
        categories: [
            {
                category: {
                    type: 'attribute',
                    collection: 'attribute',
                    displayForm: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1028'
                }
            },
            {
                category: {
                    type: 'attribute',
                    collection: 'stack',
                    displayForm: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1805'
                }
            }
        ],
        filters: [
            {
                listAttributeFilter: {
                    attribute: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1025',
                    displayForm: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1028',
                    default: {
                        negativeSelection: true,
                        attributeElements: []
                    }
                }
            },
            {
                listAttributeFilter: {
                    attribute: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1095',
                    displayForm: '/gdc/md/tgqkx9leq2tntui4j6fp08tk6epftziu/obj/1805',
                    default: {
                        negativeSelection: true,
                        attributeElements: []
                    }
                }
            }
        ]
    }
};


export const table = assign({}, stackedBar, { type: 'table', rowsPerPage: 10 });
export const bar = assign({}, barChart2Series, { type: 'bar' });
