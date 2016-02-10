import React from 'react';
import classNames from 'classnames';

export default class AttributeFilterLabel extends React.Component {
    static propTypes = {
        text: React.PropTypes.string,
        showTotalCount: React.PropTypes.bool,
        totalCount: React.PropTypes.number
    };

    constructor(props) {
        super(props);

        this.state = { hasEllipsis: false };
    }

    componentDidMount() {
        this.checkEllipsis();
    }

    componentDidUpdate() {
        this.checkEllipsis();
    }

    getClassNames() {
        return classNames(
            'adi-attribute-filter-label',
            's-attribute-filter-label',
            { 'has-ellipsis': this.state.hasEllipsis }
        );
    }

    checkEllipsis() {
        let hasEllipsis = this.labelEl.offsetWidth < this.labelEl.scrollWidth;
        if (hasEllipsis !== this.state.hasEllipsis) {
            this.setState({ hasEllipsis });
        }
    }

    render() {
        return (
            <div className={this.getClassNames()}>
                <label ref={(element) => this.labelEl = element}>{this.props.text}</label>
                {this.props.showTotalCount ? <span className="count s-total-count">({this.props.totalCount})</span> : false}
            </div>
        );
    }
}
