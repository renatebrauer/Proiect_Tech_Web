import React, { useState } from 'react';
import AddNote from '../components/AddNote/AddNote';

const NbItem = (props) => {
    const {note, setContent} = props
    const [init,setInit] = useState(Math.random());
    
    console.log(note)
    return (
        <div className="nbContainer" onClick={() => {setContent(<AddNote init={init} edit={true} note={note} noteId={"/" + note.id}/>);setInit(Math.random())}}> 
            <div className="nbItemTitle">{note.title}</div>
            <div className="nbContent">{note.content.substring(0,35) + "..."}</div>
        </div>
    )
}

export default NbItem;