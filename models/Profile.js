const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProfileSchema = new Schema({
  user: {
    // associates user by the ID
    type: Schema.Types.ObjectId,
    ref: ''
  }
});
