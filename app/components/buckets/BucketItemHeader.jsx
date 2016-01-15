import React from 'react';

import { FormattedMessage } from 'react-intl';
import classNames from 'classnames';
import pureRender from 'pure-render-decorator';

import AttributeFilterLabel from './AttributeFilterLabel';

@pureRender
export default class BucketItemHeader extends React.Component {
    static propTypes = {
        title: React.PropTypes.string,
        filters: React.PropTypes.array,
        isCollapsed: React.PropTypes.bool,
        onToggleCollapse: React.PropTypes.func
    };

    static defaultProps = {
        filters: []
    };

    getClassNames() {
        let isCollapsed = this.props.isCollapsed;
        return classNames(
            'adi-bucket-item-header',
            's-bucket-item-header',
            {
                expanded: !isCollapsed,
                collapsed: isCollapsed
            }
        );
    }

    renderFilters(props) {
        return props.filters.map((filter, idx) => {
            if (filter.selectedElements.length) {
                return (
                    <div key={idx} className="adi-attribute-filters">
                        <AttributeFilterLabel
                            text={filter.get('title')}
                            totalCount={filter.get('selectionSize')}
                            showTotalCount={filter.get('hasSelection')}
                        />
                    </div>
                );
            }
        });
    }

    render() {
        let props = this.props;
        return (
            <div className={this.getClassNames()} onClick={() => props.onToggleCollapse(!props.isCollapsed)}>
                <h4 className="s-title">{props.title}</h4>
                {this.renderFilters(props)}
                <div className="adi-bucket-invitation-inner"><span><FormattedMessage id="dashboard.bucket_item.replace" /></span></div>
            </div>
        );
    }
}
