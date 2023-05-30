const express = require('express');

const { checkAuth } = require('../util/auth');
const {
  isValidText,
  isValidDate,
  isValidImageUrl,
} = require('../util/validation');

const db = require('../db/db');

const router = express.Router();

router.get('/', async (req, res, next) => {
  console.log(req.token);
  try {
    
    const ref = db.ref('events');

    ref.once('value')
      .then((snapshot) => {
        const events = snapshot.val();
        const eventsArr = [];

        for (const key in events) {
          const event = {
            id: key,
            ...events[key]
          };
          eventsArr.push(event);
        }

        res.json({ events: eventsArr });

      })
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {

    const ref = db.ref('events');

    const recordId = req.params.id;

    ref.child(recordId).once('value')
      .then((snapshot) => {
        const event = snapshot.val();
      
        const modifiedEvent = { ...event , id: recordId}
        res.json({ event: modifiedEvent });
      })


  } catch (error) {
    next(error);
  }
});

router.use(checkAuth);

router.post('/', async (req, res, next) => {
  console.log(req.token);
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = 'Invalid title.';
  }

  if (!isValidText(data.description)) {
    errors.description = 'Invalid description.';
  }

  if (!isValidText(data.address)) {
    errors.address = 'Invalid address.';
  }

  if (!isValidDate(data.date)) {
    errors.date = 'Invalid date.';
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = 'Invalid image.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'Adding the event failed due to validation errors.',
      errors,
    });
  }

  try {
   
    const ref = db.ref('events');

    ref.push(data).then(() => {
      console.log('Record inserted successfully.');
    });



    res.status(201).json({ message: 'Event saved.', event: data });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  const data = req.body;

  let errors = {};

  if (!isValidText(data.title)) {
    errors.title = 'Invalid title.';
  }

  if (!isValidText(data.description)) {
    errors.description = 'Invalid description.';
  }

  if (!isValidDate(data.date)) {
    errors.date = 'Invalid date.';
  }

  if (!isValidImageUrl(data.image)) {
    errors.image = 'Invalid image.';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(422).json({
      message: 'Updating the event failed due to validation errors.',
      errors,
    });
  }

  try {
   
    const ref = db.ref('events'); 

    const recordId = req.params.id; 
    
    ref.child(recordId).update(data)
      .then(() => {
        console.log('Record updated successfully.');
      })

    res.json({ message: 'Event updated.', event: data });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
  
    const ref = db.ref('events');

    const recordId = req.params.id;
    console.log("recod id");
    console.log(recordId);

    ref.child(recordId).remove()
      .then(() => {
        console.log('Record deleted successfully.');
      })

    res.json({ message: 'Event deleted.' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
