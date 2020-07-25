import React, { useState, useEffect } from 'react';
import { withAuthenticator } from 'aws-amplify-react'

const App = () => {
  const [notes, setNotes] = useState([
    {id: 1, note: 'Hello world'}
  ]);
  const [note, setNote] = useState("");
  const [noteId, setNoteId] = useState("");
  const [noteIndex, setNoteIndex] = useState("");
  const [deletingId, setDeletingId] = useState("");
  
  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-1">Amplify Notetaker</h1>
      <form className="mb3">
        <input className="pa2 f4" type="text" placeholder="Write your note" />
        <button className="pa2 f4" type="submit">Add Note</button>
      </form>

      <div>
        {notes.map(item => (
          <div key={item.id} className="flex items-center">
            <li className="list pa1 f3">
              {item.note}
            </li>
            <button className="bg-transparent bn f4">
              <span>&times;</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
