const express = require('express');
const router = express.Router();
const { validateNote } = require('../utils/validators');
const { ObjectId } = require('mongodb');

//Function to generate a unique ID
function generateUniqueId() {
  return new ObjectId().toString();
}

/* ------------------------ TODO-4 - Create New Note ------------------------ */
router.post('/', async (req, res) => {
  console.log(`[POST] http://localhost:${global.port}/note - Storing a new note`);

  try {
    const db = req.app.locals.db;

    const { text } = req.body;

    const newNote = {
      id: generateUniqueId(),
      text,
      dateCreated: new Date().toISOString(),
      lastModified: new Date().toISOString()
    };

    const notesCollection = db.collection('notes');
    await notesCollection.insertOne(newNote);

    res.status(201).json(newNote);
  } catch (error) {
    console.error('Error creating new note:', error);
    res.status(500).send('Fail to insert');
  }
});

/* ------------------------- TODO-5 - Update A Note ------------------------- */
router.put('/', async (req, res) => {
  console.log(`[PUT] http://localhost:${global.port}/note - Updating note`);

  const noteId = req.body.id;
  const newText = req.body.text;

  try {
    const db = req.app.locals.db;
    const notesCollection = db.collection('notes');

    // Update the note in the database
    const result = await notesCollection.updateOne({ id: noteId }, { $set: { text: newText, lastModified: new Date().toISOString() } });

    // If the note was updated successfully, return the updated note
    if (result.modifiedCount === 1) {
      const updatedNote = await notesCollection.findOne({ id: noteId });

      // Check if the updated note is valid
      if (!validateNote(updatedNote)) {
        return res.status(500).send('Invalid data type');
      }

      // Return the updated note
      return res.send({ updatedNote });
    }

    // If the note has not been updated, return an error message
    throw new Error('Fail to update');
  } catch (error) {
    console.error('Error updating note:', error);
    return res.status(500).send('Fail to update');
  }
});


/* ------------------------- TODO-6 - Delete A Note ------------------------- */
router.delete('/', async (req, res) => {
  console.log(`[DELETE] http://localhost:${global.port}/note - Deleting note`);

  try {
    const db = req.app.locals.db;
    const noteId = req.body.id;
    const notesCollection = db.collection('notes');

    // Use the deleteOne method to delete the note with the given ID
    const result = await notesCollection.deleteOne({ id: noteId });

    if (result.deletedCount === 1) {
      res.send();
    } else {
      throw new Error('Fail to delete');
    }
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).send('Fail to delete');
  }
});



module.exports = router;
