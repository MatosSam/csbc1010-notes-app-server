const express = require('express');
const router = express.Router();
const { validateNoteArray } = require('../utils/validators');
const { ObjectId } = require('mongodb');

/* ------------------------ TODO-3 - Fetch All Notes ------------------------ */

router.get('/', async (req, res) => {
  console.log(`[GET] http://localhost:${global.port}/notes - Fetching all notes`);

  try {
    const db = req.app.locals.db;
    const notesCollection = db.collection('notes');

    // Search all notes from the database
    const notes = await notesCollection.find().toArray();

    // Check if the grades array is valid
    if (!validateNoteArray(notes)) {
      return res.status(500).send('Invalid data type');
    }

    // Return the grades array
    return res.send({ notes });
  } catch (error) {
    console.error('Error fetching all notes:', error);
    return res.status(500).send('Fail to query');
  }
});

/* ------------------------- TODO-7 - Search Notes -------------------------- */
router.get('/search/:searchKey', async (req, res) => {
  console.log(`[GET] http://localhost:${global.port}/notes/search - Searching notes`);

  try {
    const db = req.app.locals.db;
    const searchKey = req.params.searchKey;
    const notesCollection = db.collection('notes');

    // Use regular expression to make the search case-insensitive
    const query = { text: new RegExp(searchKey, 'i') };
    const notes = await notesCollection.find(query).toArray();

    if (!validateNoteArray(notes)) {
      res.status(500).send('Invalid data type');
    } else {
      res.send({ notes });
    }
  } catch (error) {
    console.error('Error searching notes:', error);
    res.status(500).send('Fail to query');
  }
});


/* ----------------------- TODO-8 - Delete All Notes ------------------------ */
router.delete('/', async (req, res) => {
  console.log(`[DELETE] http://localhost:${global.port}/notes - Deleting all notes`);

  try {
    const db = req.app.locals.db;
    const notesCollection = db.collection('notes');
    const result = await notesCollection.deleteMany({});
    if (result.deletedCount > 0) {
      res.status(200).send('All notes deleted successfully.');
    } else {
      throw new Error('Fail to delete');
    }
  } catch (error) {
    console.error('Error deleting all notes:', error);
    res.status(500).send('Fail to delete');
  }
});


module.exports = router;
