const commentModel = require("../../../DB/model/comment");
const { populate } = require("../../../DB/model/post");
const postModel = require("../../../DB/model/post");
const userModel = require("../../../DB/model/User");
const select = 'userName email';
const getPosts = [

    {
        path: 'createdBy',
        select
    },
    {
        path: 'likes',
        select

    },
    {
        path: 'comments',
        match: { isDeleted: false },
        populate: [
            {
                path: 'createdBy',
                select
            },
            {
                path: 'replys',
                populate: [{
                    path: 'createdBy',
                    select
                }, {
                    path: 'replys',
                    populate: {
                        path: 'createdBy',
                        select
                    }
                }],
            }
        ]
    }

]

const createPost = async (req, res) => {
    try {
        const { text } = req.body
        if (req.fileErr) {
            res.json({ message: "in-valid file format" })
        } else {
            const imageURLs = []
            req.files.forEach(file => {
                imageURLs.push(`${req.finialDestination}/${file.filename}`)
            });
            const newPost = new postModel({ text, image: imageURLs, createdBy: req.user._id })
            const savedPost = await newPost.save();
            await userModel.findByIdAndUpdate(req.user._id, { $push: { posts: savedPost } })
            res.status(201).json({ message: "Done", savedPost })
        }
    } catch (error) {
        res.json({ message: 'err', error })
    }
}

const updateTextPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { text } = req.body;
        const post = await postModel.findByIdAndUpdate(id);
        if (!post) {
            res.status(404).json({ message: 'not found post' })
        } else {
            if (!post.createdBy.includes(req.user._id)) {
                res.status(403).json({ message: 'not allow' })
            } else {
                await postModel.findByIdAndUpdate(id, { text })
                res.status(200).json({ message: 'succses update text' });
            }

        }
    } catch (error) {
        res.json({ message: 'err', error })
    }
}

const updateImgPost = async (req, res) => {
    try {
        const { id } = req.params;
        const imgsUrl = [req.params.imgUrl].concat(req.params[0].split('/').slice(1));
        const post = await postModel.findById(id);
        if (!post) {
            res.json({ message: 'not found post' })
        } else {
            if (!post.createdBy.includes(req.user._id)) {
                res.status(403).json({ message: 'not allow' })
            } else {
                if (req.fileErr) {
                    res.json({ message: "in-valid file format" })
                } else {
                    const imageURLs = []
                    req.files.forEach(file => {
                        imageURLs.push(`${req.finialDestination}/${file.filename}`)
                    });
                    await postModel.findByIdAndUpdate(id, { image: imageURLs }, { new: true });
                    res.status(200).json({ message: 'succes update imge post' })
                }
            }
        }

    } catch (error) {
        res.json({ message: 'err', error })
    }
};


const likePost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await postModel.findById(id)
        if (!post) {
            res.status(404).json({ message: "in-valid post id" })
        } else {
            await postModel.findByIdAndUpdate(post._id, { $push: { likes: req.user._id } })
            res.status(200).json({ message: "Done" })
        }
    } catch (error) {
        res.json({ message: 'err', error })
    }
}

const unlikePost = async (req, res) => {
    try {
        const { id } = req.params
        const post = await postModel.findById(id)
        if (!post) {
            res.status(404).json({ message: "in-valid post id" })
        } else {
            await postModel.findByIdAndUpdate(post._id, { $pull: { likes: req.user._id } })
            res.status(200).json({ message: "Done" })
        }
    } catch (error) {
        res.json({ message: 'err', error })
    }
}


const postList = async (req, res) => {
    try {
        const post = await postModel.find({}).populate(getPosts)
        res.status(200).json({ message: "Done", post })
    } catch (error) {
        res.json({ message: 'err', error })
    }

}


const softDelete = async (req, res) => {
    try {
        const { postId } = req.params;
        const user = await userModel.findById(req.user._id);
        if (!user.posts.includes(postId) || !user.role == 'Admin') {
            res.status(403).json({ message: 'not allow' })
        } else {
            const post = await postModel.findByIdAndUpdate(postId, { isDeleted: true }, { new: true });
            if (!post) {
                res.status(400).json({ message: 'in valid post' })
            } else {
                await userModel.findByIdAndUpdate(req.user._id, { $pull: { posts: post } })
                res.status(200).json({ message: 'succed soft delete post' })
            }
        }
    } catch (error) {
        res.status(400).json({ message: 'err', error })
    }
}

module.exports = {
    createPost,
    likePost,
    unlikePost,
    postList,
    updateTextPost,
    updateImgPost,
    softDelete
}