const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const auth = require('./routes/api/auth');
const profiles = require('./routes/api/profiles');
const posts = require('./routes/api/posts');

const app = express();


// middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// database
const db = require('./config/keys').mongoURI;

mongoose.connect(db).then(() => console.log('DB connected!'))
.catch(err => console.log(err));

app.get('/', (req, res) => res.send('Haaayy'));

// routes middleware
app.use('/api/auth', auth);
app.use('/api/profiles', profiles);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server is listening on ${port}`));