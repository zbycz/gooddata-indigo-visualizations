import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

export default class AttributeBubbleContent extends Component {
    static propTypes = {
        totalElementsCount: PropTypes.number,
        elements: PropTypes.object
    };

    remainingElementsCount() {
        return this.props.totalElementsCount - this.props.elements.size;
    }

    renderContent(props) {
        if (props.elements) {
            let content = props.elements.map((element, idx) => (
                <span key={idx} className="s-attribute-element">
                    {element.get('title')}<br />
                </span>)
            ).toJS();

            if (this.remainingElementsCount()) {
                content.push((
                    <span key={props.elements.size} className="adi-attr-elements-more">
                        <FormattedMessage
                            id="dashboard.catalogue_item.shortening_decoration"
                            values={{ count: this.remainingElementsCount() }}
                        />
                    </span>
                ));
            }

            return content;
        }

        return <FormattedMessage id="loading" />;
    }

    render() {
        return (
            <span>
                <h4><FormattedMessage id="dashboard.catalogue_item.values" /></h4>
                <p>{this.renderContent(this.props)}</p>
            </span>
        );
    }
}
