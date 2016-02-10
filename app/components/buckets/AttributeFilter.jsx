import React from 'react';
import { get, pick } from 'lodash';
import Promise from 'bluebird';

import classNames from 'classnames';

import Button from 'Button/ReactButton';
import ReactOverlay from 'core/ReactOverlay';

import AttributeFilterLabel from './AttributeFilterLabel';
import ReactAttributeFilter from './ReactAttributeFilter';

import Kefir from 'kefir';
import EventEmitter from 'wolfy87-eventemitter';

import { mergeItems, PageTracker } from '../../utils/paging';
import { getCssClass } from '../../utils/base';

export const MAX_SELECTION_SIZE = 500;
const ITEMS_PER_PAGE = 20;
const INITIAL_CHUNK_SIZE = 520; // 20 on top of MAX_SELECTION_SIZE so that there are always enough items for string sample
const DEFAULT_DEBOUNCE_TIME = 100;

export default class AttributeFilter extends React.Component {
    static propTypes = {
        autoOpen: React.PropTypes.bool,
        attributeFilter: React.PropTypes.object,
        container: React.PropTypes.object,
        didAutoOpen: React.PropTypes.func,
        onApply: React.PropTypes.func,
        contextClass: React.PropTypes.string,
        intl: React.PropTypes.shape({ formatMessage: React.PropTypes.func })
    };

    static defaultProps = {
        autoOpen: false,
        attributeFilter: null,
        container: null
    };

    constructor(props) {
        super(props);

        this.state = {
            displayDropdown: false,
            items: [],
            itemsCount: 0,
            selection: null,
            isInverted: true,
            isLoading: true,
            filteredItemsCount: 0,
            initialItems: null,
            searchString: '',
            pageTracker: new PageTracker(ITEMS_PER_PAGE),
            emitter: new EventEmitter()
        };
    }

    componentDidMount() {
        this._setupStreams();

        if (this.props.autoOpen) {
            this.toggleDropdown();
            this.props.didAutoOpen();
        }
    }

    componentWillUnmount() {
        // remove listeners to prevent memory leak
        this.state.emitter.removeEvent();
    }

    getButtonClasses() {
        let displayDropdown = this.state.displayDropdown;
        return classNames(
            ['icon-right', 'dropdown-button', 'toggle-menu', 'adi-filter-button',
                's-filter-button', 'adi-attr-filter-button', 'button', 'button-dropdown', 'icon-right'],
            {
                'icon-navigateup': displayDropdown,
                'icon-navigatedown': !displayDropdown,
                'is-active': displayDropdown
            }
        );
    }

    getAttributeClass() {
        return getCssClass(this.props.attributeFilter.get('attribute.execIdentifier'), 's-id-');
    }

    getFilterClasses() {
        return classNames('s-attr-filter', this.getAttributeClass());
    }

    disabledApply() {
        return this.emptySelection() || this.selectionUnchanged();
    }

    emptySelection() {
        return this.noItemsSelected() || this.allItemsUnselected();
    }

    noItemsSelected() {
        return this.isEmptySelection() && this.isPositiveSelection();
    }

    allItemsUnselected() {
        let state = this.state;
        return state.isInverted && (state.itemsCount === get(state.selection, 'length'));
    }

    isEmptySelection() {
        return !this.state.selection || !this.state.selection.length;
    }

    isPositiveSelection() {
        return !this.state.isInverted;
    }

    selectionUnchanged() {
        let attributeFilter = this.props.attributeFilter;
        return attributeFilter ?
            attributeFilter.constraintEquals(this.state.selection, this.state.isInverted) : true;
    }

    /**
     * The setup here is as follows:
     *
     * There are 3 types of events and their respective streams:
     *     searches, initial loads and paginations
     *
     * In case of search and initial load, we just send a request for the
     * first about 500 items. Each search and initial load is then
     * mapped to a stream of pagination events.
     *
     * flatMapLatest ensures that view is always updated with the
     * correct data.
     */
    _setupStreams() {
        let emitter = this.state.emitter,
            loadData = req => {
                return Kefir.fromPromise(this.loadData(req));
            };

        Kefir.fromEvents(emitter, 'initialLoad');

        let listStartStream = Kefir.merge([
            Kefir.fromEvents(emitter, 'search').debounce(DEFAULT_DEBOUNCE_TIME),
            Kefir.fromEvents(emitter, 'initialLoad')
        ]);

        listStartStream.onValue(() => {
            this.state.pageTracker.reset();
            this.setState({ 'isLoading': true });
        });

        let listStartDataStream = listStartStream.flatMapLatest(loadData);
        let paginationDataStream = listStartStream.flatMapLatest(() => {
            let scrollStream = Kefir.fromEvents(emitter, 'scroll').debounce(DEFAULT_DEBOUNCE_TIME);
            return scrollStream.flatMap(loadData);
        });

        let dataStream = Kefir.merge([listStartDataStream, paginationDataStream]);
        dataStream.onValue(props => this._setListProps(props));

        this.setState({ listStartStream, listStartDataStream, paginationDataStream, dataStream });
    }

    _setListProps(props) {
        this.setState(Object.assign({ 'isLoading': false }, props));
    }

    loadData(event) {
        let { start, end, searchString } = event;

        if (event.type === 'scroll') {
            let currentItems = this.state.items,
                wrapItems = items => ({ items }),
                updatedItemsPromise = this._loadItemsPageByPage(currentItems, start, end, searchString);

            return updatedItemsPromise.then(wrapItems);
        }

        let rangePromise = this._loadRange(0, INITIAL_CHUNK_SIZE, searchString);
        return rangePromise.then(data => this._processInitialChunk(event, data));
    }

    _processInitialChunk(event, data) {
        let result = {
            items: data.validElements,
            filteredItemsCount: data.elementsTotal
        };

        if (event.type === 'initialLoad') {
            return Object.assign(result, {
                initialItems: data.validElements,
                itemsCount: data.elementsTotal
            });
        }

        return result;
    }

    _getItems() {
        return this.state.items.slice();
    }

    _loadItemsPageByPage(currentItems, start, end, searchString) {
        let pagesToLoad = this.state.pageTracker.getPagesToLoad(start, end),
            pagePromiseHash = this._loadPages(pagesToLoad, searchString);

        if (!pagesToLoad.length) return Promise.resolve(this._getItems());

        return Promise.props(pagePromiseHash).then(result => {
            let pageNumbers = Object.keys(result),
                newItems = this._getItems();

            this.state.pageTracker.markPagesAsLoaded(pageNumbers);

            // merge pages to one big items array
            return pageNumbers.reduce((updatedItems, pageNo) => {
                let offset = this.state.pageTracker.getPageOffset(pageNo);
                return mergeItems(updatedItems, result[pageNo], offset);
            }, newItems);
        });
    }

    _loadPages(pageNumbers, searchString) {
        return pageNumbers.reduce((hash, pageNo) => {
            hash[pageNo] = this._loadPage(pageNo, searchString);
            return hash;
        }, {});
    }

    _loadPage(pageNo, searchString) {
        let offset = this.state.pageTracker.getPageOffset(pageNo);
        let result = this._loadRange(offset, ITEMS_PER_PAGE, searchString);

        return result.then(data => data.validElements);
    }

    _getLoader() {
        return this.props.container.lookup('service:validElementsLoader');
    }

    _loadRange(offset, count, searchString = '') {
        let loader = this._getLoader();

        return Promise.resolve()
            .then(() => {
                let attribute = this.props.attributeFilter.attribute;
                return loader.getAttributeElements(attribute, offset, count, searchString);
            });
    }

    _resetSelection() {
        let filter = this.props.attributeFilter;

        this.setState({
            selection: filter.get('selectedElements'),
            isInverted: filter.get('isInverted')
        });
    }

    select(items, isInverted) {
        this.setState({
            selection: items,
            isInverted
        });
    }

    search(searchString) {
        this.setState({ searchString });

        this.state.emitter.trigger('search', [{
            type: 'search',
            searchString
        }]);
    }

    changeRange(searchString, start, end) {
        this.state.emitter.trigger('scroll', [{
            type: 'scroll',
            searchString,
            start,
            end
        }]);
    }

    toggleDropdown() {
        this.setState({
            initialItems: null,
            searchString: ''
        });

        if (this.state.displayDropdown) {
            this.cancel();
        } else {
            this._resetSelection();

            this.setState({
                isLoading: true,
                displayDropdown: true
            });

            this.state.emitter.trigger('initialLoad', [{ type: 'initialLoad' }]);
        }
    }

    apply() {
        let state = this.state;

        this.props.onApply({
            allElements: state.initialItems,
            selectedElements: state.selection,
            isInverted: state.isInverted,
            totalElementsCount: state.itemsCount
        });

        this.setState({ displayDropdown: false });
    }

    cancel() {
        this.setState({ displayDropdown: false });
    }

    renderContent() {
        let cancelText = 'cancel', applyText = 'apply', // t('cancel'), applyText = t('apply'),
            listProps = pick(this.state, 'items', 'itemsCount', 'filteredItemsCount',
                'selection', 'isInverted', 'isLoading', 'searchString');

        return (
            <div className="overlay gd-dialog gd-dropdown adi-filter-picker adi-attr-filter-picker s-filter-picker">
                <div className="react-list-root filter-list">
                    <ReactAttributeFilter
                        {...listProps}
                        maxSelectionSize={MAX_SELECTION_SIZE}
                        onSelect={this.select.bind(this)}
                        onSearch={this.search.bind(this)}
                        onRangeChange={this.changeRange.bind(this)}
                        showSearchField={!!this.state.initialItems}
                    />
                </div>
                <div className="filter-picker-buttons">
                    <Button className="button-secondary button-small cancel-button"
                        onClick={this.cancel.bind(this)}
                        value={cancelText}
                        text={cancelText}
                    />
                    <Button className="button-positive button-small s-apply"
                        onClick={this.apply.bind(this)}
                        value={applyText}
                        text={applyText}
                        disabled={this.disabledApply()}
                    />
                </div>
            </div>
        );
    }

    renderDropdown() {
        return (
            <div className="overlay">
                <ReactOverlay
                    alignTo={'.' + this.props.contextClass + ' .' + this.getAttributeClass() + ' .adi-filter-button'}
                    alignPoints={[
                        {
                            align: 'bl tl',
                            offset: { x: 0, y: 5 }
                        }
                    ]}
                >
                    {this.renderContent()}
                </ReactOverlay>
            </div>
        );
    }

    render() {
        let filter = this.props.attributeFilter;

        // using plain button, because ReactButton does not support child elements
        return (
            <span className={this.getFilterClasses()}>
                <button type="button" tabIndex="-1"
                    className={this.getButtonClasses()}
                    onClick={this.toggleDropdown.bind(this)}
                >
                    <span className="button-text">
                        <AttributeFilterLabel
                            text={filter.get('title')}
                            totalCount={filter.get('selectionSize')}
                            showTotalCount={filter.get('hasSelection')}
                        />
                    </span>
                </button>
                {this.state.displayDropdown ? this.renderDropdown() : false }
            </span>
        );
    }
}
