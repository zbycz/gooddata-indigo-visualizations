import React, { PropTypes } from 'react';
import Codemirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

const cmOptions = {
    lineNumbers: true
};

function SourceListing(props) {
    return (
        <Codemirror value={props.children} options={cmOptions} />
    );
}

SourceListing.propTypes = {
    children: PropTypes.string.isRequired
};

export default SourceListing;
