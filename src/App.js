import React, { useState, useEffect } from 'react';
import { API, graphqlOperation, Auth } from 'aws-amplify'
import { withAuthenticator } from 'aws-amplify-react'
import '@aws-amplify/ui/dist/style.css';
import { createNote, deleteNote, updateNote } from './graphql/mutations'
import { listNotes } from './graphql/queries'
import { onCreateNote, onDeleteNote, onUpdateNote } from './graphql/subscriptions'

const App = () => {
  const [notes, setNotes] = useState([]);
  const [note, setNote] = useState("");
  const [noteId, setNoteId] = useState("");
  const [noteIndex, setNoteIndex] = useState("");

  useEffect(() => {
    handleListNotes()
    // const owner = Auth.user.getUsername()
    // const createNoteListener = API.graphql(graphqlOperation(onCreateNote, { owner })).subscribe({
    //   next: noteData => {
    //     const newNote = noteData.value.data.onCreateNote
    //     const prevNotes = notes.filter(note => note.id !== newNote.id)
    //     const updatedNotes = [ ...prevNotes, newNote ]
    //     setNotes(updatedNotes)
    //   }
    // })
    // const deleteNoteListener = API.graphql(graphqlOperation(onDeleteNote, { owner })).subscribe({
    //   next: noteData => {
    //     const deletedNote = noteData.value.data.onDeleteNote
    //     const updatedNotes = notes.filter(note => note.id !== deletedNote.id)
    //     setNotes(updatedNotes)
    //   }
    // })
    // const updateNoteListener = API.graphql(graphqlOperation(onUpdateNote, { owner })).subscribe({
    //   next: noteData => {
    //     const updatedNote = noteData.value.data.onUpdateNote
    //     const index = notes.findIndex(note => note.id === updatedNote.id)
    //     const updatedNotes = [
    //       ...notes.slice(0, index),
    //       updatedNote,
    //       ...notes.slice(index + 1)
    //     ]
    //     setNotes(updatedNotes)
    //   }
    // })

    // setNote("")
    // setNoteId("")

    return () => {
      // createNoteListener.unsubscribe()
      // deleteNoteListener.unsubscribe()
      // updateNoteListener.unsubscribe()
    }
  }, [])

  const handleListNotes = async () => {
    const { data } = await API.graphql(graphqlOperation(listNotes))
    setNotes(data.listNotes.items)
  }

  const handleChangeNote = event => {
    setNote(event.target.value)
  }

  const hasExistingNote = () => {
    if(noteId){
      const isNote = notes.findIndex(note => note.id === noteId) > -1
      return isNote
    }
    return false
  }

  const handleAddNote = async event => {
    event.preventDefault()
    // check if we have an existing note, if so update it
    if(hasExistingNote()){
      handleUpdateNote()
    } else {
      const input = { note }
      const { data } = await API.graphql(graphqlOperation(createNote, { input }))
      const newNote = data.createNote
      const updatedNotes = [ newNote, ...notes ]
      setNotes(updatedNotes)
      setNote("")
    }
  }

  const handleUpdateNote = async () => {
    const input = {id: noteId, note}
    const { data } = await API.graphql(graphqlOperation(updateNote, { input }))
    const updatedNote = data.updateNote
    const updatedNotes = [
      ...notes.slice(0, noteIndex),
      updatedNote,
      ...notes.slice(noteIndex + 1)
    ]
    setNotes(updatedNotes)
    setNote("")
    setNoteId("")
  }

  const handleDeleteNote = async id => {
    const input = { id }
    const { data } = await API.graphql(graphqlOperation(deleteNote, { input }))
    const deleteNoteId = data.deleteNote.id
    const updatedNotes = notes.filter(note => note.id !== deleteNoteId)
    setNotes(updatedNotes)
  }

  const handleSetNote = async ({ note, id }, index) => {
    setNote(note)
    setNoteId(id)
    setNoteIndex(index)
  }
  
  return (
    <div className="flex flex-column items-center justify-center pa3 bg-washed-red">
      <h1 className="code f2-1">Amplify Notetaker</h1>
      <form onSubmit={handleAddNote} className="mb3">
        <input className="pa2 f4" type="text" placeholder="Write your note" onChange={handleChangeNote} value={note} />
        <button className="pa2 f4" type="submit">
          { noteId ? "Update" : "Add" }
        </button>
      </form>

      <div>
        {notes.map((item, i) => (
          <div key={item.id} className="flex items-center">
            <li onClick={ () => handleSetNote(item, i) } className="list pa1 f3">
              {item.note}
            </li>
            <button className="bg-transparent bn f4" onClick={ () => handleDeleteNote(item.id )}>
              <span>&times;</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuthenticator(App, { includeGreetings: true });
