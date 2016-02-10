import React, { Component, PropTypes } from 'react';
import { FormattedMessage } from 'react-intl';

export default class CatalogueEmpty extends Component {
    static propTypes = {
        search: PropTypes.string.isRequired,
        unavailableItemsCount: PropTypes.number.isRequired
    };

    render() {
        const { unavailableItemsCount } = this.props;

        const message = (
            <FormattedMessage
                id="catalogue.unavailable_items_matched"
                values={{ count: unavailableItemsCount }}
            />
        );

        return (
            <div className="adi-no-items">
                <p className="s-not-matching-message">
                    <FormattedMessage id="catalogue.no_data_matching" /><br/>
                    "{this.props.search}"
                </p>

                {unavailableItemsCount ? <p className="s-unavailable-items-matched">{message}</p> : ''}
            </div>
        );
    }
}
