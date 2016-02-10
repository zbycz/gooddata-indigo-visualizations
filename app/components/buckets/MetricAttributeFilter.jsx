import React from 'react';
import _ from 'lodash';
import { safeBind } from '../../utils/base';

import { injectIntl } from 'react-intl';

import MetricAttributeList from './MetricAttributeList.jsx';

import Button from 'Button/ReactButton';
import List from 'List/ReactSearchableList';
import ReactOverlay from 'core/ReactOverlay';
import ReactSpinner from 'core/ReactSpinner';

// import CatalogueDetailsLoader from '../../services/catalogue_details_loader';

const cachedLoader = _.memoize(
    () => ({}), // () => CatalogueDetailsLoader.loadDetails(item),
    (item) => item.get('identifier')
);

class MetricAttributeFilter extends React.Component {
    static propTypes = {
        attributesLoader: React.PropTypes.func.isRequired,
        onSubmit: React.PropTypes.func,
        intl: React.PropTypes.shape({
            formatMessage: React.PropTypes.func
        })
    };

    constructor(props) {
        super(props);

        this.state = {
            attributes: [],
            isLoading: true,
            displayDropdown: false
        };
    }

    onDropdownToggle() {
        if (!this.state.displayDropdown) {
            this.setState({
                isLoading: true,
                displayDropdown: true
            });

            this.props.attributesLoader().then(attributes => {
                this.setState({ attributes, isLoading: false });
            });
        } else {
            this.setState({ displayDropdown: false });
        }
    }

    onSubmit(attribute) {
        this.onDropdownToggle();
        this.props.onSubmit(attribute);
    }

    onShowBubble(attribute) {
        cachedLoader(attribute).then(safeBind(this, (details) => {
            attribute.set('details', details);
            this.forceUpdate();
        }));
    }

    renderContent(props, state) {
        let classes = 'overlay gd-dialog gd-dropdown adi-filter-picker adi-attr-filter-picker',
            t = props.intl.formatMessage;
        if (state.isLoading) {
            return (
                <div className={classes}>
                    <div className="spinner-wrapper">
                        <ReactSpinner className="gd-dot-spinner-centered"/>
                    </div>
                </div>
            );
        }

        return (
            <div className={classes}>
                <div className="gd-list">
                    <div className="gd-list-root">
                        <List
                            items={state.attributes}
                            isLoaded
                            itemsCount={state.attributes.length}
                            height={250}
                            itemHeight={28}
                            searchable
                            small
                            listClass={MetricAttributeList}
                            placeholder={t({ id: 'search' })}
                            noResultsText={t({ id: 'no_results_matched' })}
                            onSelect={this.onSubmit.bind(this)}
                            onShowBubble={this.onShowBubble.bind(this)}
                        />
                    </div>
                </div>
            </div>
        );
    }

    renderDropdown(props, state) {
        return (
            <div className="overlay">
                <ReactOverlay
                    closeOnOutsideClick
                    onClose={() => this.onDropdownToggle()}
                    alignTo=".s-add_attribute_filter.button"
                    alignPoints={[{
                        align: 'bl tl',
                        offset: { x: 0, y: 5 }
                    }]}
                >
                    {this.renderContent(props, state)}
                </ReactOverlay>
            </div>
        );
    }

    render() {
        let buttonText = this.props.intl.formatMessage({ id: 'dashboard.bucket.add_attribute_filter' });
        return (
            <span>
                <Button
                    className="button-link icon-plus button-dropdown icon-right icon-navigateup"
                    title={buttonText}
                    value={buttonText}
                    onClick={this.onDropdownToggle.bind(this)}
                />
                {this.state.displayDropdown ? this.renderDropdown(this.props, this.state) : false }
            </span>
        );
    }
}

export default injectIntl(MetricAttributeFilter);
