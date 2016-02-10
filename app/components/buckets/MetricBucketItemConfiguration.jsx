import React from 'react';
import { List } from 'immutable';
import pureRender from 'pure-render-decorator';

import { injectIntl } from 'react-intl';

import Button from 'Button/ReactButton';
import AggregationSelect from '../shared/AggregationSelect';
import AttributeFilter from './AttributeFilter';
import CatalogueItem from '../catalogue/CatalogueItem';
import MetricAttributeFilter from './MetricAttributeFilter';
import ConfigurationCheckbox from '../shared/ConfigurationCheckbox';

import { AGGREGATION_FUNCTIONS } from '../../models/aggregation_function';

@pureRender
class MetricBucketItemConfiguration extends React.Component {

    static propTypes = {
        bucketItem: React.PropTypes.object.isRequired,
        attributesLoader: React.PropTypes.func,
        onSetAttributeAggregation: React.PropTypes.func,
        onChangeShowInPercent: React.PropTypes.func,
        onChangeShowPoP: React.PropTypes.func,
        onAddAttributeFilter: React.PropTypes.func,
        onRemoveAttributeFilter: React.PropTypes.func,
        onSaveAttributeElements: React.PropTypes.func,
        onResetFilterAutoOpen: React.PropTypes.func,
        onShowBubble: React.PropTypes.func
    };

    onChangeCheckbox(callback, checked) {
        this.props[callback](this.props.bucketItem.get('original'), checked);
    }

    aggregationFunctions() {
        return AGGREGATION_FUNCTIONS.filter(func =>
            func.applicableTo === this.props.bucketItem.getIn(['attribute', 'type'])
        );
    }

    renderAggregation(props) {
        let bucketItem = props.bucketItem,
            attribute = bucketItem.get('attribute'),
            t = props.intl.formatMessage;
        return (
            <div className="adi-aggregation-wrapper">
                {attribute && attribute.get('type') === 'fact' ?
                    <div className="adi-bucket-select">
                        <AggregationSelect
                            className="s-fact-aggregation-switch"
                            aggregationFunctions={this.aggregationFunctions()}
                            aggregation={bucketItem.get('aggregation')}
                            onSelect={(aggregation) => props.onSetAttributeAggregation(bucketItem.get('original'), aggregation)}
                        />
                    <span>{t({ id: 'of' })}</span>
                    </div> :
                    false
                }
                {attribute && attribute.get('type') === 'attribute' ?
                    <span>{t({ id: 'aggregations.title.COUNT' })} {t({ id: 'of' })}</span> : false
                }
                <CatalogueItem
                    item={attribute}
                    draggable={false}
                    available
                    onShowBubble={props.onShowBubble}
                />
            </div>
        );
    }

    renderFilters(props) {
        let filters = props.bucketItem.get('filters') || List(),
            t = props.intl.formatMessage;
        if (filters.size) {
            return (
                <section className="attribute-filters-wrapper">
                    <h2>{t({ id: 'filters' })}</h2>
                    {filters.map((filter, idx) => {
                        return (
                            <div key={idx} className="metric-attribute-filter-wrapper">
                                <AttributeFilter
                                    autoOpen={filter.autoOpen}
                                    attributeFilter={filter}
                                    container={props.container}
                                    onApply={props.onSaveAttributeElements.bind(this, filter)}
                                    didAutoOpen={props.onResetFilterAutoOpen.bind(this, filter)}
                                    contextClass="adi-metric-bucket-item-configuration"
                                />
                                <Button
                                    className="button-link button-icon-only icon-cross remove-attribute-filter s-remove-attribute-filter"
                                    onClick={props.onRemoveAttributeFilter.bind(this, filter)}
                                />
                            </div>
                        );
                    })}
                </section>
            );
        }

        return (
            <section className="attribute-filters-wrapper">
                <MetricAttributeFilter
                    attributesLoader={props.attributesLoader}
                    onSubmit={props.onAddAttributeFilter}
                />
            </section>
        );
    }

    render() {
        let props = this.props,
            bucketItem = props.bucketItem,
            t = props.intl.formatMessage;
        return (
            <div className="adi-bucket-configuration adi-metric-bucket-item-configuration">
                {this.renderAggregation(props)}
                {this.renderFilters(props)}
                <ConfigurationCheckbox
                    checked={bucketItem.get('showInPercent')}
                    disabled={bucketItem.get('isContributionDisabled')}
                    onChange={this.onChangeCheckbox.bind(this, 'onChangeShowInPercent')}
                    label={t({ id: 'dashboard.bucket_item.show_contribution' })}
                    name="show-in-percent"
                />
                <ConfigurationCheckbox
                    checked={bucketItem.get('showPoP')}
                    disabled={bucketItem.get('isPoPDisabled')}
                    onChange={this.onChangeCheckbox.bind(this, 'onChangeShowPoP')}
                    label={t({ id: 'dashboard.bucket_item.show_pop' })}
                    name="show-pop"
                />
            </div>
        );
    }
}

export default injectIntl(MetricBucketItemConfiguration);
