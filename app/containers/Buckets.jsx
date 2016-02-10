import React, { Component } from 'react';
import { connect } from 'react-redux';
import pureRender from 'pure-render-decorator';

import '../styles/buckets';

import * as DataActions from '../actions/data_actions';
import * as Actions from '../actions/buckets_actions';

import VISUALIZATION_TYPE_OBJECTS from '../models/visualization_type';
import '../styles/visualization_picker';

import VisualizationPicker from '../components/buckets/VisualizationPicker';
import BucketsPanel from '../components/buckets/BucketsPanel';

import { bucketsSelector } from '../selectors/buckets_selector';

@pureRender
class Buckets extends Component {
    static propTypes = {
        buckets: React.PropTypes.object,
        visualizationType: React.PropTypes.string,
        projectId: React.PropTypes.string,
        dispatch: React.PropTypes.func,
        log: React.PropTypes.func
    };

    onTypeChanged(type) {
        this.props.dispatch(Actions.selectVisualizationType(type));
    }

    onShowBubble(item) {
        if (!item.get('details')) {
            this.props.dispatch(DataActions.catalogueItemDetailRequested(item.toJS(), this.props.projectId));
        }
    }

    onToggleCollapse(item, collapsed) {
        this.props.dispatch(Actions.setBucketItemCollapsed({ item, collapsed }));
    }

    onBucketItemPropertyChanged(log, name, action, item, value) {
        this.props.log(log, { name, value });
        this.props.dispatch(Actions[action]({ item, value }));
    }

    onSetAttributeAggregation(item, value) {
        this.onBucketItemPropertyChanged('adi-aggregation-function-changed', value, 'setBucketItemAggregation', item, value);
    }

    onChangeShowInPercent(item, value) {
        this.onBucketItemPropertyChanged('adi-checkbox-clicked', 'show-in-percent', 'setBucketItemShowInPercent', item, value);
    }

    onChangeShowPoP(item, value) {
        this.onBucketItemPropertyChanged('adi-checkbox-clicked', 'show-pop', 'setBucketItemShowPop', item, value);
    }

    onSelectDimension(item, value) {
        this.props.dispatch(Actions.setBucketItemDimension({ item, value }));
    }

    onSelectGranularity(item, value) {
        this.props.dispatch(Actions.setBucketItemGranularity({ item, value }));
    }

    onAddAttributeFilter(item, filter) {
        this.props.dispatch(Actions.setBucketItemAddFilter({ item, filter }));
    }

    onRemoveAttributeFilter(item, filter) {
        this.props.dispatch(Actions.setBucketItemRemoveFilter({ item, filter }));
    }

    render() {
        let props = this.props;
        return (
            <div className="adi-buckets-panel">
                <VisualizationPicker
                    selected={props.visualizationType}
                    types={VISUALIZATION_TYPE_OBJECTS}
                    onClick={this.onTypeChanged.bind(this)}
                />
                <BucketsPanel
                    buckets={props.buckets}
                    dimensions={props.dimensions}
                    visualizationType={props.visualizationType}
                    onToggleCollapse={this.onToggleCollapse.bind(this)}
                    onShowBubble={this.onShowBubble.bind(this)}
                    onSetAttributeAggregation={this.onSetAttributeAggregation.bind(this)}
                    onChangeShowInPercent={this.onChangeShowInPercent.bind(this)}
                    onChangeShowPoP={this.onChangeShowPoP.bind(this)}
                    onSelectDimension={this.onSelectDimension.bind(this)}
                    onSelectGranularity={this.onSelectGranularity.bind(this)}
                    onAddAttributeFilter={this.onAddAttributeFilter.bind(this)}
                    onRemoveAttributeFilter={this.onRemoveAttributeFilter.bind(this)}
                />
            </div>
        );
    }
}

export default connect(bucketsSelector)(Buckets);
