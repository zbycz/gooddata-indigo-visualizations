import React, { PropTypes } from 'react';
import classNames from 'classnames';
import pureRender from 'pure-render-decorator';

@pureRender
export default class VisualizationPicker extends React.Component {
    static propTypes = {
        selected: PropTypes.string.isRequired,
        types: PropTypes.array.isRequired,
        onClick: PropTypes.func.isRequired
    };

    handleClick(type) {
        if (this.props.selected !== type) {
            this.props.onClick(type);
        }
    }

    renderButton(type) {
        let classes = classNames(
            'vis',
            's-visualization',
            'bubbleTitle',
            'mouseoverTrigger',
            `vis-type-${type.type}`,
            {
                'is-selected': this.props.selected === type.type
            }
        );

        return (
            <button
                key={type.type}
                data-bubbletitlealignpoints="bc tc"
                className={classes}
                onClick={() => this.handleClick(type.type)}
                title={type.title}
            />
        );
    }

    render() {
        return (
            <div className="adi-visualization-picker s-visualization-picker">
                {this.props.types.map(type => this.renderButton(type))}
            </div>
        );
    }
}
