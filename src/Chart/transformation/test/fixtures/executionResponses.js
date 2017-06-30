export const noMeasure = {
    headers: [
        {
            type: 'attrLabel',
            id: 'label.clientmessage.function',
            uri: '/gdc/md/budtwmhq7k94ve7rqj49j3620rzsm3u1/obj/2591',
            title: 'Function'
        }
    ],
    rawData: [
        [{
            id: '1',
            name: ''
        }], [{
            id: '251251',
            name: 'AVG'
        }], [{
            id: '268828',
            name: 'MAX'
        }], [{
            id: '268825',
            name: 'MEDIAN'
        }], [{
            id: '268827',
            name: 'MIN'
        }], [{
            id: '268826',
            name: 'RUNSUM'
        }], [{
            id: '255875',
            name: 'SUM'
        }]
    ]
};

export const singleMeasure = {
    headers: [
        {
            type: 'metric',
            id: 'a8908b3c92b6743b1fc71c8b113533bc',
            title: '# of Accounts',
            format: '#,##0'
        }
    ],

    rawData: [
        ['118']
    ]
};

export const singleMeasureAndAttribute = {
    headers: [
        {
            type: 'attrLabel',
            id: 'label.projectgroup.stage',
            uri: '/gdc/md/budtwmhq7k94ve7rqj49j3620rzsm3u1/obj/2135',
            title: 'Stage'
        },
        {
            type: 'metric',
            id: 'a8908b3c92b6743b1fc71c8b113533bc',
            title: '# of Accounts',
            format: '#,##0'
        }
    ],

    rawData: [
        [
            {
                id: '1',
                name: ''
            },
            '1'
        ],
        [
            {
                id: '321199',
                name: 'Churned'
            },
            '25'
        ],
        [
            {
                id: '2288',
                name: 'N/A'
            },
            '1'
        ],
        [
            {
                id: '321198',
                name: 'OK'
            },
            '153'
        ],
        [
            {
                id: '321216',
                name: 'Potentially Churned / Salesforce Issues'
            },
            '27'
        ]
    ]
};
