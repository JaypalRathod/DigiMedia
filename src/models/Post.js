import mongoose, { Schema } from 'mongoose';

const CommentSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User" },
    text: { type: String, trim: true, default: "" },
}, { timestamps: true });

const PostSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    media: [{ type: String, default: "" }],
    text: { type: String, trim: true, default: "" },
    category: { type: String, trim: true, default: "" },
    likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
    comments: [CommentSchema],
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);
export default Post;
