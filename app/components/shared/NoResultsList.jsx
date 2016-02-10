import React from 'react';

import { FormattedMessage } from 'react-intl';

export default class NoResultsMatched extends React.Component {
    render() {
        return <div className="gd-list-noResults"><FormattedMessage id="no_results_matched" /></div>;
    }
}
