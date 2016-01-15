import React, { PropTypes, Component } from 'react';
import { injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import catalogueSelector from '../selectors/catalogue_selector';
import CatalogueFilter from '../components/catalogue/CatalogueFilter';
import CatalogueList from '../components/catalogue/CatalogueList';
import DatasetPicker from '../components/DatasetPicker';
import SearchField from 'Form/ReactSearchField';

import * as DataActions from '../actions/data_actions';

import { getCsvUploaderUrl } from '../utils/api';

class Catalogue extends Component {
    static propTypes = {
        // @TODO: Immutable types
        items: PropTypes.object.isRequired,
        datasets: PropTypes.object.isRequired,
        catalogue: PropTypes.object.isRequired,
        enableCsvUploader: PropTypes.bool,
        projectId: PropTypes.string,
        dispatch: PropTypes.func.isRequired, // injected
        intl: PropTypes.object.isRequired // injected
    };

    static defaultProps = {
        showDatasetPicker: false,
        enableCsvUploader: false
    };

    onQueryChange(query) {
        this.props.dispatch(DataActions.setCatalogueQuery(query));
    }

    onActiveFilterChange(activeFilterIndex) {
        this.props.dispatch(DataActions.setCatalogueFilter(activeFilterIndex));
    }

    onDatasetChange(selectedDatasetId) {
        this.props.dispatch(DataActions.setCatalogueActiveDataset(selectedDatasetId));
    }

    onRangeChange() {
        // @TODO Paging will be done in next sprint
    }

    getFilterAtIndex(index) {
        let catalogue = this.props.catalogue;
        let filters = catalogue.get('filters');
        return filters.get(index).toJS();
    }

    getActiveFilter() {
        return this.getFilterAtIndex(this.props.catalogue.get('activeFilterIndex'));
    }

    render() {
        let showDatasetPicker = this.props.enableCsvUploader;

        let catalogue = this.props.catalogue;

        let catalogueFilters = catalogue.get('filters').toJS();
        let activeFilterIndex = catalogue.get('activeFilterIndex');

        let onShowBubble = item => {
            if (!item.get('details')) {
                this.props.dispatch(DataActions.catalogueItemDetailRequested(item.toJS(), this.props.projectId));
            }
        };

        let csvUploaderLink = getCsvUploaderUrl(this.props.projectId);

        let datasetPicker = showDatasetPicker && (
            <div className="adi-dataset-picker">
                <DatasetPicker
                    datasets={this.props.datasets.toJS()}
                    selectedDatasetId={this.props.catalogue.get('activeDatasetId')}
                    onDatasetChange={dataset => this.onDatasetChange(dataset)}
                    csvUploaderLink={csvUploaderLink}
                />
            </div>
        );

        return (
            <div className="adi-catalogue-panel">
                <div className="adi-catalogue">
                    {datasetPicker}

                    <div className="catalogue-search">
                        <SearchField
                            small
                            onChange={query => this.onQueryChange(query)}
                            value={catalogue.get('query')}
                            placeholder={this.props.intl.formatMessage({ id: 'search_data' })}
                        />
                    </div>

                    <div className="adi-catalogue-filter">
                        <CatalogueFilter
                            filters={catalogueFilters}
                            activeFilterIndex={activeFilterIndex}
                            onSelect={filterIndex => this.onActiveFilterChange(filterIndex)}
                        />
                    </div>

                    <div className="catalogue-list-container">
                        <CatalogueList
                            search={catalogue.get('query')}
                            items={this.props.items.toArray()}
                            itemsCount={this.props.catalogue.getIn(['totals', 'available'])}
                            unavailableItemsCount={this.props.catalogue.getIn(['totals', 'unavailable'])}
                            isLoading={this.props.catalogue.get('isLoading')}
                            isPageLoading={this.props.catalogue.get('isPageLoading')}
                            isLoadingAvailability={false}
                            onDragStart={() => {}}
                            onDragStop={() => {}}
                            onShowBubble={onShowBubble}
                            onRangeChange={this.onRangeChange.bind(this)}
                            start={this.props.catalogue.getIn(['paging', 'start'])}
                            end={this.props.catalogue.getIn(['paging', 'end'])}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default injectIntl(connect(catalogueSelector)(Catalogue));
