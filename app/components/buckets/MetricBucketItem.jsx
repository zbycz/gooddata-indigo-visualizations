import React from 'react';
import pureRender from 'pure-render-decorator';

import BucketItemHeader from './BucketItemHeader';
import MetricBucketItemConfiguration from './MetricBucketItemConfiguration';

@pureRender
export default class MetricBucketItem extends React.Component {

    static propTypes = {
        bucketItem: React.PropTypes.object.isRequired,
        attributesLoader: React.PropTypes.func,
        filterAttributeElementsDidChange: React.PropTypes.func,
        onSetAttributeAggregation: React.PropTypes.func,
        onChangeShowInPercent: React.PropTypes.func,
        onChangeShowPoP: React.PropTypes.func,
        onAddAttributeFilter: React.PropTypes.func,
        onRemoveAttributeFilter: React.PropTypes.func,
        onSaveAttributeElements: React.PropTypes.func,
        onResetFilterAutoOpen: React.PropTypes.func,
        onShowBubble: React.PropTypes.func,
        onToggleCollapse: React.PropTypes.func
    };

    render() {
        let props = this.props,
            bucketItem = this.props.bucketItem;
        return (
            <div>
                <BucketItemHeader
                    title={bucketItem.get('metricTitle')}
                    filters={bucketItem.get('filters')}
                    isCollapsed={bucketItem.get('collapsed')}
                    onToggleCollapse={(collapsed) => props.onToggleCollapse(bucketItem.get('original'), collapsed)}
                />
            {!this.props.bucketItem.get('collapsed') ? <MetricBucketItemConfiguration {...props} /> : false}
            </div>
        );
    }
}
