import React, { PropTypes } from 'react';

function DefaultSizeVisualization(props) {
    return (
        <div>
            {props.children}
        </div>
    );
}

DefaultSizeVisualization.propTypes = {
    children: PropTypes.element.isRequired
};

export default DefaultSizeVisualization;
