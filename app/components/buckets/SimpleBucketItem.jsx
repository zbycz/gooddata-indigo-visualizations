import React from 'react';
import { FormattedMessage } from 'react-intl';
import pureRender from 'pure-render-decorator';

import CatalogueListItem from '../catalogue/CatalogueListItem';
import Select from '../shared/Select';

@pureRender
export default class SimpleBucketItem extends React.Component {
    static propTypes = {
        bucketItem: React.PropTypes.object.isRequired,
        dimensions: React.PropTypes.object,
        onSelectDimension: React.PropTypes.func,
        onSelectGranularity: React.PropTypes.func
    };

    renderGranularitySelect(props) {
        let bucketItem = props.bucketItem;
        if (bucketItem.getIn(['attribute', 'type']) === 'date') {
            return (
                <div className="adi-bucket-configuration date-granularity">
                    <label className="select">
                        <FormattedMessage id="dashboard.bucket_item.as" />
                        <Select
                            className="s-date-dimension-switch adi-date-dimension-switch"
                            content={props.dimensions.toJS()}
                            value={bucketItem.getIn(['dimension', 'id'])}
                            optionValuePath="id"
                            optionLabelPath="attributeTitle"
                            optionDisabledPath="isDisabled"
                            optionGroupPath="availabilityTitle"
                            onSelect={(dimension) =>
                                props.onSelectDimension(bucketItem.get('original'), dimension)}
                        />
                    </label>
                    <label className="select">
                        <FormattedMessage id="dashboard.bucket_item.granularity" />
                        <Select
                            className="s-date-granularity-switch"
                            content={bucketItem.getIn(['dimension', 'attributes']).toJS()}
                            value={bucketItem.getIn(['granularity', 'dateType'])}
                            optionValuePath="dateType"
                            optionLabelPath="label"
                            onSelect={(granularity) =>
                                props.onSelectGranularity(bucketItem.get('original'), granularity)}
                        />
                    </label>
                </div>
            );
        }
    }

    render() {
        let props = this.props;
        return (
            <div>
                <div className="adi-bucket-invitation-inner">
                    <span><FormattedMessage id="dashboard.bucket_item.replace" /></span>
                </div>
                <div className="adi-bucket-item-header">
                    <CatalogueListItem
                        item={props.bucketItem.get('attribute')}
                        draggable={false}
                        bubbleHelp={false}
                        available
                    />
                </div>
                {this.renderGranularitySelect(props)}
            </div>
        );
    }
}
