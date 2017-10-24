const mongoose = require('mongoose')
const Schema = mongoose.Schema

const patternSchema = new Schema ({
  title : String,
  created : { type: Date, default: Date.now },
  creator : {
    type : Schema.Types.ObjectId,
    ref : 'User'
  },
  category : String, // considering  array
  //difficulty : String,
  //estimatedTimeCreator : String,
  // estimatedTimeChallengers : {
  //   beginner : String,
  //   intermediate : String,
  //   advance : String
  // },
  variation : [],
  material : String,
  steps : String
})

// patternSchema.pre('save', function(next) {
//   var pattern = this
//   pattern.slug = pattern.name.toLowerCase().split(' ').join('-')
// })

const Pattern = mongoose.model('pattern', patternSchema)

module.exports = Pattern
