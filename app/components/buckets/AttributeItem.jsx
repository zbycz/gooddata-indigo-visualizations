import React, { Component, PropTypes } from 'react';
import { injectIntl } from 'react-intl';

import classNames from 'classnames';

function getAttributeItemClassName() {
    // @TODO: compute css class
    // if (item) {
    //     return GD.computed.cssClass.get(item.get('id'), 's-id-');
    // }
}

class AttributeItem extends Component {
    static propTypes = {
        onSelect: PropTypes.func.isRequired,
        onOnly: PropTypes.func.isRequired,
        source: PropTypes.object.isRequired,
        selected: PropTypes.bool,
        intl: React.PropTypes.shape({ formatMessage: React.PropTypes.func })
    };

    handleSelect() {
        this.props.onSelect(this.props.source);
    }

    handleOnly(ev) {
        ev.stopPropagation();
        this.props.onOnly(this.props.source);
    }

    renderCheckbox() {
        return (
            <input
                type="checkbox"
                className="input-checkbox"
                readOnly="true"
                checked={this.props.selected}
            />
        );
    }

    renderOnly() {
        let t = this.props.intl.formatMessage;
        return (
            <span
                className="gd-list-item-only"
                onClick={this.handleOnly.bind(this)}
            >
                {t('dashboard.attribute_filter.only')}
            </span>
        );
    }

    render() {
        let item = this.props.source;

        const classes = classNames(
            'gd-list-item',
            'has-only-visible',
            's-filter-item',
            'adi-filter-item',
            getAttributeItemClassName(item),
            {
                'is-selected': this.props.selected
            }
        );

        const title = this.props.source.get('title');

        return (
            <div
                className={classes}
                title={title}
                onClick={this.handleSelect.bind(this)}
            >
                <div className="content">
                    {this.renderCheckbox()}
                    {title}
                    {this.renderOnly()}
                </div>
            </div>
        );
    }
}

export default injectIntl(AttributeItem);
