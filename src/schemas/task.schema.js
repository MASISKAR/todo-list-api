const mongoose = require('mongoose'),
  mongoosePaginate = require('mongoose-paginate'),
  Schema = mongoose.Schema,
  ObjectId = Schema.Types.ObjectId;

const TaskSchema = new Schema(
  {
    owner: {
      type: ObjectId,
      ref: 'User',
      required: true
    },
      title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    status: {
      type: String,
      default: 'active',
      enum: ['active', 'done']
    },
    date: {
      type: Date,
        format : 'date-time'
    },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at'
    }
  }
);

TaskSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Task', TaskSchema);
