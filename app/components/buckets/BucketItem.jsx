import React from 'react';
import classNames from 'classnames';
import pureRender from 'pure-render-decorator';

import SimpleBucketItem from './SimpleBucketItem';
import MetricBucketItem from './MetricBucketItem';

@pureRender
export default class BucketItem extends React.Component {
    static propTypes = {
        bucketItem: React.PropTypes.object.isRequired,
        dimensions: React.PropTypes.object,
        selectedDimensionId: React.PropTypes.string,
        granularityOptions: React.PropTypes.array,
        granularity: React.PropTypes.string,
        attributesLoader: React.PropTypes.func,
        filterAttributeElementsDidChange: React.PropTypes.func,
        setAttributeAggregation: React.PropTypes.func,
        onChangeShowInPercent: React.PropTypes.func,
        onChangeShowPoP: React.PropTypes.func,
        onAddAttributeFilter: React.PropTypes.func,
        onRemoveAttributeFilter: React.PropTypes.func,
        onSaveAttributeElements: React.PropTypes.func,
        onResetFilterAutoOpen: React.PropTypes.func,
        onSelectDimension: React.PropTypes.func,
        onSelectGranularity: React.PropTypes.func,
        onToggleCollapse: React.PropTypes.func,
        onShowBubble: React.PropTypes.func
    };

    getClasses(props) {
        return classNames(
            'adi-bucket-item',
            's-bucket-item',
            { 'adi-replace-invitation': this.allowsReplace() },
            this.idClassName(),
            props.bucketItem.get('type')
        );
    }

    allowsReplace() {
        let bucketItem = this.props.bucketItem;
        return bucketItem.get('acceptsReplace') && bucketItem.get('acceptsDraggedObject');
    }

    idClassName() {
        return 's-id-' + (this.props.bucketItem.get('execIdentifier') || '').replace(/\./g, '_');
    }

    render() {
        let props = this.props,
            BucketItemTag = props.bucketItem.get('isMetric') ? MetricBucketItem : SimpleBucketItem;

        return <li className={this.getClasses(props)}><BucketItemTag {...props} /></li>;
    }
}
