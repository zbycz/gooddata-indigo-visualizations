import React, { PropTypes, Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import cx from 'classnames';

import { ASC, DESC } from './Sort';

const MAX_TITLE_LINES = 5;
const LINE_HEIGHT = 24;
const MAX_HEADER_HEIGHT = MAX_TITLE_LINES * LINE_HEIGHT;

export class TableSortBubbleContent extends Component {

    static propTypes = {
        title: PropTypes.string.isRequired,
        activeSortDir: PropTypes.oneOf([
            ASC, DESC
        ]),
        onSortChange: PropTypes.func,
        onClose: PropTypes.func
    };

    static defaultProps = {
        activeSortDir: null,
        onSortChange: () => {},
        onClose: () => {}
    };

    constructor(props) {
        super(props);

        this.state = {};
        this.setInitialStep(props);

        this.sortAsc = this.handleSort.bind(this, ASC);
        this.sortDesc = this.handleSort.bind(this, DESC);
        this.setTitleRef = this.setTitleRef.bind(this);
    }

    componentDidMount() {
        // initially check and potentially adjust the title length
        this.setTitleLength();
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.title !== this.props.title) {
            // trigger a readjust for the new title
            this.setInitialStep(nextProps);
        }
    }

    componentDidUpdate() {
        // after each update, we need to re-check and potentially
        // adjust the title length
        this.setTitleLength();
    }

    setTitleRef(title) {
        this.title = title;
    }

    // adjust title length using divide and conquer algorithm
    setTitleLength() {
        const headerHeight = this.title.getBoundingClientRect().height;

        // if the title is so long that the header div is higher
        // than MAX_HEADER_HEIGHT, we need to crop it
        if (headerHeight > MAX_HEADER_HEIGHT) {
            this.setNextStep(true);
            return;
        }

        const { title } = this.props;
        const { titleLength, step } = this.state;

        // if the title has been cropped and we haven't reached the last step
        // we should try extending the title
        if (titleLength < title.length && step > 1) {
            this.setNextStep(false);
        }
    }

    setInitialStep(props) {
        this.state = {
            titleLength: props.title.length,
            step: props.title.length / 2
        };
    }

    setNextStep(down) {
        const { titleLength, step } = this.state;

        this.setState({
            titleLength: Math.floor(titleLength + (down ? -step : step)),
            step: step / 2
        });
    }

    handleSort(dir, e) {
        this.props.onSortChange(dir, e);
        this.props.onClose();
    }

    renderButton(dir) {
        const { activeSortDir } = this.props;
        const isDisabled = dir === activeSortDir;
        const buttonClasses = cx(
            'button',
            'button-primary',
            'button-small',
            'icon-dropdown',
            'icon-right', {
                'button-sort-asc': dir === ASC,
                'button-sort-desc': dir === DESC,
                enabled: isDisabled
            });

        const msg = dir === ASC ? 'visualizations.asc' : 'visualizations.desc';
        const onClick = dir === ASC ? this.sortAsc : this.sortDesc;

        return (
            <button
                onClick={onClick}
                disabled={isDisabled}
                className={buttonClasses}
            >
                <FormattedMessage id={msg} />
            </button>
        );
    }

    render() {
        const { title, onClose } = this.props;
        const { titleLength } = this.state;

        // display a cropped title if it's too long
        const displayTitle = titleLength < title.length ?
            `${title.substring(0, titleLength)}…` : title;

        return (
            <div>
                <button
                    className="close-button button-link button-icon-only icon-cross"
                    onClick={onClose}
                />
                <div className="gd-dialog-header gd-heading-3" ref={this.setTitleRef}>
                    {displayTitle}
                </div>
                <FormattedMessage id="visualizations.sorting" />
                <div className="buttons">
                    {this.renderButton(ASC)}
                    {this.renderButton(DESC)}
                </div>
            </div>
        );
    }
}

export default injectIntl(TableSortBubbleContent);
