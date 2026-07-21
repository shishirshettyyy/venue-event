const mongoose = require('mongoose')

const teamMemberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      trim: true,
    },
    bio: {
      type: String,
      default: '',
    },
    photo: {
      type: String,
      default: '',
    },
    links: {
      github: { type: String, default: '' },
      linkedin: { type: String, default: '' },
      portfolio: { type: String, default: '' },
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
)

teamMemberSchema.index({ order: 1 })

module.exports = mongoose.model('TeamMember', teamMemberSchema)
