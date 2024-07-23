const { Schema, model } = require("mongoose");

const UserSchema = Schema(
  {
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      value: null,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    links: [
      {
        type: Schema.Types.ObjectId,
        ref: "Link",
        required: true,
        default: []
      }
    ],
  },
  {
    timestamps: true,
    versionKey: false,
    id: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
      },
    },
  }
);

// UserSchema.method("toJSON", function () {
//   const { __v, _id, ...object } = this.toObject();
//   object.id = _id;
//   return object;
// });

module.exports = model("User", UserSchema);
