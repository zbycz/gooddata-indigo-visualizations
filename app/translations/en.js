import { flattenMessages } from '../utils/messages';

export default flattenMessages({
    'of': 'of',
    'apply': 'Apply',
    'clear': 'Clear',
    'cancel': 'Cancel',
    'loading': 'Loading...',
    'search': 'Search...',
    'search_data': 'Search data...',
    'metrics': 'Metrics',
    'categories': 'Category',
    'filters': 'Filters',
    'table': 'Table',
    'line': 'Line chart',
    'column': 'Column chart',
    'bar': 'Bar chart',
    'application_title': 'Analyze',
    'open_as_report': 'Open as Report',
    'export_unsupported': 'Visualization is not compatible with Report Editor. ' +
        '"{title}" is in configuration twice. Remove one {type} to Open as Report.',
    'reset': 'Reset',
    'undo': 'Undo',
    'redo': 'Redo',
    'based_on': 'Based on',
    'this_month': 'This month',
    'this_quarter': 'This quarter',
    'day': 'Day',
    'week': 'Week (Sun-Sat)',
    'quarter': 'Quarter',
    'month': 'Month',
    'year': 'Year',
    'previous_year': 'previous year',
    'select_all': 'Select all',
    'more': 'more',
    'all': 'All',
    'empty_value': 'empty value',
    'no_results_matched': 'No results matched',
    'bucket_item_types': {
        'attribute': 'attribute',
        'date': 'date',
        'fact': 'measure',
        'metric': 'calculated measure'
    },
    'aggregations': {
        'title': {
            'SUM': 'Sum',
            'MIN': 'Minimum',
            'MAX': 'Maximum',
            'AVG': 'Average',
            'RUNSUM': 'Running sum',
            'MEDIAN': 'Median',
            'COUNT': 'Count'
        },

        'metric_title': {
            'COUNT': 'Count of {title}',
            'SUM': 'Sum of {title}',
            'MAX': 'Max {title}',
            'MIN': 'Min {title}',
            'AVG': 'Avg {title}',
            'RUNSUM': 'Runsum of {title}',
            'MEDIAN': 'Median {title}'
        }
    },
    'recommendation': {
        'comparison': {
            'compare': 'Compare',
            'percents': 'See percents',
            'contribution_compare': 'Compare',
            'with_same_period': 'to the same period in previous year',
            'between_each': 'between each',
            'contribution_to_the_whole': 'contribution to the whole'
        },
        'trending': {
            'see': 'See trend',
            'of_last_four_quarters': 'of last 4 quarters',
            'in_time_by': 'in time by'
        }
    },
    'date': {
        'timezoneHint': 'in {timezoneName} (UTC&nbsp;{offset})',
        'filter.dropdownTitle': '{dimension}: {granularity}',

        'title.allTime': 'All time',

        'dimension': {
            'unavailable': 'Unrelated',
            'available': 'Related'
        },

        'floating': {
            title: {
                'single.this': 'This {unitTitle}',
                'single.last': 'Last {unitTitle}',
                'range.last': 'Last {unitCount} {unitTitle}',
                'range.trailing': 'Last {unitCount} {unitTitle}'
            },
            'example': {
                'single': '{periodStart}',
                'range': '{periodStart} &ndash; {periodEnd}'
            }
        },

        'interval.title.single': '{periodStart}',
        'interval.title.range': '{periodStart} &ndash; {periodEnd}',

        // date dimension granularity by attr.identifier
        'date': {
            'one': 'day',
            'other': 'days'
        },
        'month': {
            'one': 'month',
            'other': 'months'
        },
        'quarter': {
            'one': 'quarter',
            'other': 'quarters'
        },
        'year': {
            'one': 'year',
            'other': 'years'
        }
    },
    'filter': {
        'attribute.itemsLimitExceeded': 'All values or up to 500 specific values can be selected.',
        'date': {
            'presets': 'presets',
            'range': 'date range',
            'interval': {
                'between': 'Between',
                'and': 'and'
            },
            'dimension': {
                'is': 'is'
            }
        }
    },
    'catalogue': {
        'loading_availability': 'Fetching related data',
        'no_data_matching': 'No data matching',
        'unavailable_items_matched':
            '{count} unrelated data {count, plural, one {item} other {items}} hidden',
        'filter': {
            'all': 'all data',
            'metrics': 'measures',
            'attributes': 'attributes'
        }
    },
    'dashboard': {
        'computing': 'Computing...',
        'project_data': 'Project data',
        'bucket': {
            'metrics_add_placeholder': 'Drag <span class="metric-field-icon"></span> or <span class="attr-field-icon"></span> here',
            'metrics_dropzone_hint': 'Drag a measure or attribute from the Data Catalogue to add it here.',
            'categories_add_placeholder': 'Drag <span class="attr-field-icon"></span> or <span class="date-field-icon"></span> here',
            'categories_dropzone_hint': 'Drag an attribute or date from the Data Catalogue to add it here.',
            'drop': 'drop to add',
            'filter_placeholder': 'Drag <span class="attr-field-icon"></span> or <span class="date-field-icon"></span> here',
            'filter_dropzone_hint': 'Drag an attribute or date from the Data Catalogue to add it as a filter.',
            'stacks_add_placeholder': 'Drag <span class="attr-field-icon"></span> here',
            'stacks_dropzone_hint': 'Drag an attribute from the Data Catalogue to add it here.',
            'metrics_title': {
                'table': 'Measures',
                'column': 'Measures',
                'bar': 'Measures',
                'line': 'Measures'
            },
            'categories_title': {
                'table': 'Attributes',
                'column': 'View by',
                'bar': 'View by',
                'line': 'Trend by'
            },
            'stacks_title': {
                'column': 'Stack by',
                'bar': 'Stack by',
                'line': 'Segment by'
            },
            'metric_segment_by_warning': 'To add additional measure, remove <span class="attr-field-icon"></span> from <span class="stack-by">segment by</span>',
            'metric_stack_by_warning': 'To add additional measure, remove <span class="attr-field-icon"></span> from <span class="stack-by">stack by</span>',
            'category_stack_by_warning': 'To stack by, a visualization can have only one measure',
            'category_segment_by_warning': 'To segment by, a visualization can have only one measure',
            'add_attribute_filter': 'Add attribute filter'
        },
        'bucket_item': {
            'as': 'as',
            'granularity': 'group by',
            'show_contribution': 'show in %',
            'show_pop': 'compare to the same period in previous year',
            'replace': 'Drop to replace'
        },
        'attribute_filter': {
            'only': 'only'
        },
        'catalogue_item': {
            'type': 'type',
            'defined_as': 'defined as',
            'values': 'values',
            'dataset': 'dataset',
            'empty_value': '(empty value)',
            'shortening_decoration': '...and {count} more',
            'common_date_description': 'Represents all your dates in project. Can group by Day, Week, Month, Quarter & Year.'
        },
        'blank': '' +
'           <h2>Get started</h2>' +
'           <p>' +
'               Drag data here<br>' +
'               to begin' +
'           </p>',
        'message': {
            'invalid_configuration': '' +
'           <h2>Visualization cannot be displayed</h2>' +
'           <p>This could be because:</p>' +
'           <ul>' +
'               <li>a measure is categorized by an unrelated attribute</li>' +
'               <li>a measure is filtered by an unrelated attribute</li>' +
'               <li>one or more measures are not properly defined</li>' +
'           </ul>' +
'           <p>' +
'              The relationships between data in each project' +
'               are defined by the project\'s data model.' +
'           </p>',
            'missing_metric': '' +
'               <h2>Now select a measure to display</h2>' +
'               <p>' +
'                   Add a measure to see it by the attribute you\'ve selected.' +
'               </p>',
            'empty_result': '' +
'               <h2>No data match your filtering criteria</h2>' +
'               <p>' +
'                   Try adjusting or removing some of the filters.' +
'               </p>',
            'too_many_data_points': {
                'header': 'Too many data points to display',
                'avoid_crashing': 'Avoid crashing the browser by adding some<br>filters',
                'or': 'or',
                'switch_to_table': 'switching to table view'
            }
        },
        'recommendation.recommended_next_steps': 'RECOMMENDED NEXT STEPS',
        'recommendation.recommended_steps': 'RECOMMENDED STEPS',
        'trash.hint': 'Drop to remove'
    },
    'shortcut': {
        'metric_over_time': 'See "{decoratedTitle}" <strong>trending</strong> over time',
        'single_attribute': '<strong>List</strong> of "{decoratedTitle}" values',
        'single_metric': 'See "{decoratedTitle}"<br>' +
            'as a <strong>column chart</strong>'
    },
    'header': {
        'kpis': 'KPIs',
        'dashboards': 'Dashboards',
        'analyze': 'Analyze',
        'reports': 'Reports',
        'manage': 'Manage',
        'load': 'Load',
        'account': 'Account',
        'dic': 'Data integration console',
        'logout': 'Logout'
    },
    'error': {
        'no_error': 'No error.',
        'project': {
            // TODO: How to i18n various generic error messages
            'error': 'Project `{projectId}` error: `{error.statusText}`',
            'not_found': 'Project `{projectId}` not found.'
        }
    },
    'csv_uploader': {
        'add_data_link': 'Add data',
        'add_data_title': 'Upload a CSV file to add new<br/>data for analyzing.'
    },
    'datasets': {
        'production_data': 'Production data',
        'user': 'My data',
        'shared': 'Other users\' data',
        'csv_hint': 'You can also analyze CSV data.',
        'upload_file': 'Load your file here'
    }
});
