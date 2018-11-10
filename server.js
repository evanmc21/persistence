const express = require('express');
const mongoose = require('mongoose');

const auth = require('./routes/api/auth');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

const app = express();

const db = require('./config/keys').mongoURI;

mongoose.connect(db).then(() => console.log('DB connected!'))
.catch(err => console.log(err));

app.get('/', (req, res) => res.send('Haaayy'));

// routes middleware
app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`server is listening on ${port}`));