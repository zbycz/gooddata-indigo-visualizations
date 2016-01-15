import t from '../translations/en';

/* eslint dot-notation: 0 */
export const GRANULARITY_OPTIONS = [
    { dateType: 'GDC.time.date', label: t['day'] },
    { dateType: 'GDC.time.week', label: t['week'] },
    { dateType: 'GDC.time.month', label: t['month'], recommendationLabel: t['this_month'] },
    { dateType: 'GDC.time.quarter', label: t['quarter'], recommendationLabel: t['this_quarter'] },
    { dateType: 'GDC.time.year', label: t['year'] }
];
