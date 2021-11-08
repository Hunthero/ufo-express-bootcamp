import methodOverride from 'method-override';
import express from 'express';
import {
  read, add, write, edit,
} from './jsonFileStorage.js';

const app = express();
app.set('view engine', 'ejs');
// Configure Express to parse request body data into request.body
app.use(express.urlencoded({ extended: false }));

// Override POST requests with query param ?_method=PUT to be PUT requests
app.use(methodOverride('_method'));

// Save new recipe data sent via POST request from our form
app.post('/sighting', (request, response) => {
  // Add new sightings data in request.body to sightings array in data.json.
  add('data.json', 'sightings', request.body, (err) => {
    if (err) {
      response.status(500).send('DB write error.');
      return;
    }
    // Acknowledge recipe saved.
    response.send('Saved sighting!');
  });
});

// Render the form to input new sightings
app.get('/sighting', (request, response) => {
  response.render('sighting');
});

app.get('/', (req, res) => {
  read('data.json', (err, jsonData) => {
    if (err) {
      console.error(err);
      return;
    }
    res.render('allSighting', { jsonData });
  });
});

app.get('/sighting/:index', (req, res) => {
  read('data.json', (err, jsonData) => {
    if (err) {
      console.error(err);
      res.status(500).send(err);
      return;
    }
    const { index } = req.params;
    const sighting = jsonData.sightings[index];
    res.render('sightingIndex', { sighting });
  });
});

app.get('/sighting/:index/edit', (req, res) => {
  read('data.json', (err, jsonData) => {
    const { index } = req.params;
    const sighting = jsonData.sightings[index];
    // Pass the recipe index to the edit form for the PUT request URL.
    sighting.index = index;
    const ejsData = { sighting };
    res.render('edit', ejsData);
  });
});

app.put('/sighting/:index', (req, res) => {
  const { index } = req.params;
  read('data.json', (err, data) => {
    // Replace the data in the object at the given index
    data.sightings[index] = req.body;
    write('data.json', data, (err) => {
      res.redirect('/');
    });
  });
});

app.delete('/sighting/:index', (request, response) => {
  // Remove element from DB at given index
  const { index } = request.params;
  // console.log(index);
  read('data.json', (err, data) => {
    data.sightings.splice(index, 1);
    write('data.json', data, (err) => {
      response.redirect('/');
    });
  });
});

// // Render the form to input new sightings
// app.get('/sighting/edit/:index', (request, response) => {
//  read('data.json', (err, jsonData) => {
//     const { index } = request.params;
//     const sighting = jsonData.sightings[index];
//     // Pass the recipe index to the edit form for the PUT request URL.
//     sighting.index = index;
//     const ejsData = { sighting };
//     response.render('edit', ejsData);
//   });
// });

// app.put('/sighting/:index', function (request, response) {
//    const { index } = request.params;
//    read('data.json', (err, data) => {
//      // Replace the data in the object at the given index
//      data['sightings'][index] = request.body;
//      write('data.json', data, (err) => {
//        response.send('Done!');
//      });
//    });
// });

// app.get('/', (request, response) => {
//    read('data.json', (err, jsonData) => {
//     if (err) {
//       console.log(err);
//       return;
//     }
//     response.render('index',jsonData);
//   });
// });

// app.delete('/sighting/:index/delete', (request, response) => {
//   // Remove element from DB at given index
//   const { age } = request.params;
//   read('data.json', (err, data) => {
//     data['recipes'].splice(age, 1);
//     write('data.json', data, (err) => {
//       response.send('Done!');
//     });
//   });
// });

app.listen(3004);
