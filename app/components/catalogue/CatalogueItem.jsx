import React from 'react';
import classNames from 'classnames';

import { getCssClass } from '../../utils/css_class';
import CatalogueDetailsBubble from './CatalogueDetailsBubble';

export function getCatalogueItemClassName(item) {
    if (item.get('type') === 'date') {
        return 's-date';
    }

    return getCssClass(item.get('identifier'), 's-id-');
}

export default class CatalogueItem extends React.Component {
    static propTypes = {
        draggable: React.PropTypes.bool,
        bubbleHelp: React.PropTypes.bool,
        available: React.PropTypes.bool,
        onDragStart: React.PropTypes.func,
        onDragStop: React.PropTypes.func,
        onMouseOver: React.PropTypes.func,
        item: React.PropTypes.object
    };

    static defaultProps = {
        bubbleHelp: true,
        draggable: true
    };

    componentDidMount() {
        this._runDraggable();
    }

    componentDidUpdate() {
        this._runDraggable();
    }

    // TODO: Remove next four functions once react-dnd is introduced.
    _runDraggable() {
        /*
        if (!this.props.draggable) return;

        Em.$(ReactDOM.findDOMNode(this)).draggable({
            revert: 'invalid',
            appendTo: 'body',
            distance: 10,
            helper: () => this._createDragHelper(),
            start: this._onDragStart,
            stop: this._onDragStop
        });
        */
    }

    _onDragStart() {
        /*
        Em.run(() => {
            if (this.props.draggable) {
                this.props.onDragStart(this.props.item);
            }
        });
        */
    }

    _onDragStop(/* event */) {
        /*
        Em.run(() => {
            if (this.props.draggable) {
                let positionInfo = {
                    mouseX: event.clientX,
                    mouseY: event.clientY,
                    viewportWidth: window.innerWidth,
                    viewportHeight: window.innerHeight
                };

                this.props.onDragStop(this.props.item, positionInfo);
            }
        });
        */
    }

    _createDragHelper() {
        /*
        var node = ReactDOM.findDOMNode(this);
        var $helper = Em.$(node).clone();

        $helper
            .css({
                transition: 'none',
                transform: 'none',
                zIndex: 5000
            })
            .addClass('adi-dragged-item');

        purgeReactIds($helper);

        return $helper;
        */
    }

    render() {
        var props = this.props,
            item = props.item,
            type = item.get('type'),
            title = item.get('title'),
            isUnavailable = !this.props.available;

        var classes = classNames(
            'adi-catalogue-item',
            `type-${type}`,
            getCatalogueItemClassName(item),
            {
                'not-available': isUnavailable,
                's-item-unavailable': isUnavailable
            }
        );

        var bubbleHelp = (
            <CatalogueDetailsBubble
                item={props.item}
                onShowBubble={props.onShowBubble}
            />
        );

        return (
            <div className={classes}>
                <div>{title}</div>
                {props.bubbleHelp && bubbleHelp}
            </div>
        );
    }
}
