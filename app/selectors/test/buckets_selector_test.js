import { fromJS } from 'immutable';
import { bucketsSelector } from '../buckets_selector';

describe('Buckets selector test', () => {
    let state;

    beforeEach(() => {
        state = fromJS({
            appState: {
                bootstrapData: {
                    project: {
                        id: 'my project'
                    }
                }
            },
            data: {
                catalogue: {
                    items: [{
                        id: 'fact.spend_analysis.cart_additions',
                        identifier: 'fact.spend_analysis.cart_additions',
                        isAvailable: true,
                        summary: '',
                        title: 'Cart Additions',
                        type: 'fact',
                        uri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15418'
                    }, {
                        expression: 'SELECT SUM([/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15417])',
                        format: '[>=1000000000]$#,,,.0 B;[<=-1000000000]-$#,,,.0 B;[>=1000000]$#,,.0 M;[<=-1000000]-$#,,.0 M;[>=1000]$#,.0 K;[<=-1000]-$#,.0 K;$#,##0',
                        id: 'aaeFKXFYiCc0',
                        identifier: 'aaeFKXFYiCc0',
                        isAvailable: true,
                        summary: '',
                        title: 'Awareness',
                        type: 'metric',
                        uri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/16212'
                    }]
                },
                dimensions: {
                    dimensions: [{
                        attributes: [],
                        id: 'date.dim_date',
                        identifier: 'date.dim_date',
                        isAvailable: true,
                        summary: 'Date dimension (Date)',
                        title: 'Date dimension (Date)',
                        type: 'dimension',
                        uri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15174'
                    }],
                    unavailable: [{
                        attributes: [],
                        id: 'date.dim_date2',
                        identifier: 'date.dim_date2',
                        summary: 'Date dimension (Date)',
                        title: 'Date dimension (Date)',
                        type: 'dimension',
                        uri: '/gdc/md/oxtus0lm2dzmng6ht821to3k9nmxteth/obj/15174'
                    }]
                },
                visualizationType: 'bar',
                buckets: [{
                    keyName: 'metrics',
                    items: [{
                        collapsed: true,
                        attribute: 'fact.spend_analysis.cart_additions'
                    }, {
                        collapsed: true,
                        attribute: 'aaeFKXFYiCc0'
                    }]
                }, {
                    keyName: 'categories',
                    items: [{
                        collapsed: true,
                        attribute: 'fact.spend_analysis.cart_additions'
                    }]
                }, {
                    keyName: 'filters',
                    items: []
                }]
            }
        });
    });

    it('returns project id', () => {
        let { projectId } = bucketsSelector(state);
        expect(projectId).to.be('my project');
    });

    it('returns visualization type', () => {
        let { visualizationType } = bucketsSelector(state);
        expect(visualizationType).to.be('bar');
    });

    it('returns filtered and decorated buckets', () => {
        let { buckets } = bucketsSelector(state);

        expect(buckets.size).to.be(2);
        buckets.forEach(bucket => {
            bucket.get('items').forEach(item => {
                expect(item.get('isMetric')).to.be(bucket.get('keyName') === 'metrics');
            });
        });
    });

    it('returns decorated dimensions', () => {
        let { dimensions } = bucketsSelector(state);
        expect(dimensions.size).to.be(2);
        expect(dimensions.getIn([0, 'isAvailable'])).to.be(true);
        expect(dimensions.getIn([1, 'isAvailable'])).to.be(false);
    });
});
