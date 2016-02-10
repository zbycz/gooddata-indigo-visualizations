import React from 'react';

import classNames from 'classnames';
import { getCssClass } from '../../utils/css_class';

import CatalogueDetailsBubble from '../catalogue/CatalogueDetailsBubble';

export default class MetricAttributeListItem extends React.Component {
    static propTypes = {
        item: React.PropTypes.object,
        onSelect: React.PropTypes.func,
        onShowBubble: React.PropTypes.func,
        onHideBubble: React.PropTypes.func
    };

    getClasses(item) {
        return classNames(
            's-filter-item',
            'gd-list-item',
            'adi-filter-item',
            getCssClass(item.get('identifier'), 's-bubble-id-'),
            getCssClass(item.get('title'), 's-'),
        );
    }

    render() {
        let item = this.props.item;
        return (
            <div className={this.getClasses(item)} onClick={() => this.props.onSelect(item)}>
                <span className="attr-field-icon"></span>
                {item.get('title')}
                <CatalogueDetailsBubble
                    item={item}
                    offsetX={8}
                    offsetY={0}
                    onShowBubble={this.props.onShowBubble}
                    onHideBubble={this.props.onHideBubble}
                />
            </div>
        );
    }
}
