const commentModel = require("../../../DB/model/comment");
const postModel = require("../../../DB/model/post");
const userModel = require("../../../DB/model/User");

const createComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;

        const post = await postModel.findById(id);
        if (!post) {
            res.status(404).json({ message: "in-valid post" })
        } else {
            const newComment = new commentModel({
                text,
                createdBy: req.user._id,
                postId: post._id
            })
            const savedComent = await newComment.save();
            const savedPost = await postModel.findByIdAndUpdate(post._id, { $push: { comments: savedComent._id } }, { new: true })
            res.status(201).json({ message: "Done", savedPost })
        }
    } catch (error) {
        res.json({ message: 'err', error })
    }
}
const softDelete = async (req, res) => {
    try {
        const { commentID } = req.params;
        const comment = await commentModel.findById(commentID);
        if (!comment) {
            res.status(404).json({ message: 'in valid comment' })
        } else {
            const user = await userModel.findById(req.user._id)
            if (!comment.createdBy.includes(req.user._id) || !user.role == 'Admin') {
                res.status(403).json({ message: 'not alow' })
            } else {
                const commentDelete = await commentModel.findByIdAndUpdate(commentID, { isDeleted: true }, { $push: { deletedBy: user._id } }, { new: true })
                if (!commentDelete) {
                    res.status(400).json({ message: 'in valid comment' })
                } else {
                    res.status(200).json({ message: 'success soft delete comment' })
                }
            }
        }
    } catch (error) {
        res.status(400).json({ message: 'err', error })
    }
}
const like = async (req, res) => {
    try {
        const { commentID } = req.params;
        const comment = await commentModel.findById(commentID);
        if (!comment) {
            res.status(404).json({ message: 'in valid commrnt' })
        } else {
            await commentModel.findByIdAndUpdate(commentID, { $push: { likes: req.user._id } })
            res.status(200).json({ message: 'success like comment' })
        }
    } catch (error) {
        res.status(400).json({ message: 'err', error })
    }
}
const editComment = async (req, res) => {
    try {
        const { commentID } = req.params;
        const { text } = req.body;
        const comment = await commentModel.findById(commentID);
        if (!comment) {
            res.status(404).json({ message: 'in valid comment' })
        } else {
            const user = await userModel.findById(req.user._id);
            if (!comment.createdBy.includes(req.user._id) || !user.role == 'Admin') {
                res.json({ message: 'not allow' })
            } else {
                const newComment = await commentModel.findByIdAndUpdate(commentID, { text }, { new: true })
                if (!newComment) {
                    res.status(400).json({ message: 'in valid' })
                } else {
                    res.status(200).json({ message: 'success edit text ' })
                }
            }
        }
    } catch (error) {
        res.status(400).json({ message: 'err', error })
    }
}



const replyComment = async (req, res) => {
    const { id, commentID } = req.params;
    const { text } = req.body;

    const post = await postModel.findById(id).populate({
        path: 'comments'
    });
    if (!post) {
        res.status(404).json({ message: "in-valid post" })
    } else {
        const comment = await commentModel.findOne({ postID: post._id, _id: commentID })
        if (!comment) {
            res.status(404).json({ message: "in-valid comment id" })
        } else {
            const newComment = new commentModel({
                text,
                createdBy: req.user._id,
                postId: post._id
            })
            const savedComent = await newComment.save();
            await commentModel.findByIdAndUpdate(comment._id, { $push: { replys: savedComent._id } })
            res.status(201).json({ message: "Done" })
        }
    }
}



module.exports = {
    createComment, replyComment, editComment, softDelete,like
}