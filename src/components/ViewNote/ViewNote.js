import React from 'react';
import "./ViewNote.css"

const ViewNote = (props) => {
    const {title, content} = props;
    return (
        <div className="noteContainer">
            <div className="noteInputs">
                <div className="formTitle">{title}</div>
                <div className="formTitle noteContent" >{content}</div>
            </div>
        </div>
    )
}

export default ViewNote;