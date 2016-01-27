import {
    propertiesToHeaders
} from '../src/chartCreators';

import {
    _transformMetrics
} from '../src/transformation'

describe('chartCreators', () => {
    describe('propertiesToHeaders', () => {
        it.only('converts vis ctrl properties to header format', () => {
            const config = {
                "type": "column",
                "x": "healthdata_finish.aci81lMifn6q",
                "y": "metricValues",
                "color": "metricNames",
                "colorPalette": [
                    "rgb(00,131,255)"
                ],
                "selection": null,
                "visible": true,
                "orderBy": [],
                "where": {}
            }, headers = [
                {
                    "type": "attrLabel",
                    "id": "healthdata_finish.aci81lMifn6q",
                    "uri": "/gdc/md/zro9kxjp2hejksfug8qemqwx6d92c940/obj/2577",
                    "title": "Quarter/Year (Health Data_finish)"
                },
                {
                    "type": "metric",
                    "id": "c54rxxM5coY6",
                    "uri": "/gdc/md/zro9kxjp2hejksfug8qemqwx6d92c940/obj/2647",
                    "title": "Average kilometers",
                    "format": "#,##0.00"
                }
            ];

            let transformedHeader = _transformMetrics({ headers, rawData: []});
            const res = propertiesToHeaders(config, transformedHeader);
            expect(res.x).to.eql({
                "type": "attrLabel",
                "id": "healthdata_finish.aci81lMifn6q",
                "uri": "/gdc/md/zro9kxjp2hejksfug8qemqwx6d92c940/obj/2577",
                "title": "Quarter/Year (Health Data_finish)"
            });
            expect(res.y).to.eql({
                "id": "metricValues",
                "type": "metric",
                "uri": "/metricValues",
                "format": "#,##0.00",
                "title": "Average kilometers"
            });
        })
    })
})
