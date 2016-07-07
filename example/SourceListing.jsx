import React from 'react';
import Codemirror from 'react-codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';

const cmOptions = {
    lineNumbers: true
};

export default function SourceListing(props) {
    return (
        <Codemirror value={props.children} options={cmOptions} />
    );
}
