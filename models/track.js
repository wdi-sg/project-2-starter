const mongoose = require('mongoose')

const TrackSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  contributor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
})

const Track = mongoose.model('Track', TrackSchema)

module.exports = {
  Schema: TrackSchema,
  model: Track
}