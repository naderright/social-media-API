const router = require("express").Router();
const { auth } = require("../../middlwaer/auth");
const { myMulter, customValidation, HME } = require("../../service/multer");
const endpoint = require("./post.endPoint");
const postController = require("./controller/post");
const commentController = require("./controller/comment")
const validation = require("../../middlwaer/validation");
const validators = require("./post.validation")

router.get('/', postController.postList)
router.post("/add", myMulter('/post', customValidation.image).array('image', 5),
    HME, validation(validators.createPost), auth(endpoint.createPost),
    postController.createPost)

router.post("/update/:id/image", myMulter('/post', customValidation.image).array('image', 5),
    HME, auth(endpoint.createPost),
    postController.updateImgPost)

router.patch('/update/:id/text', validation(validators.createPost),
    auth(endpoint.createPost), postController.updateTextPost)


router.post('/softDelete/:postId',auth(endpoint.createPost),postController.softDelete)    

router.patch("/:id/like", validation(validators.likePost), auth(endpoint.createPost), postController.likePost)
router.patch("/:id/unlike", validation(validators.likePost), auth(endpoint.createPost), postController.unlikePost)


//comment
router.post("/:id/comment", validation(validators.createComment),
    auth(endpoint.createPost), commentController.createComment)
//soft delete comment 
router.patch('/deleteComment/:commentId',auth(endpoint.createPost),commentController.softDelete)    
//Edit comment
router.patch('/Edit/:commentId',validation(validators.createComment),auth(endpoint.createPost)
,commentController.editComment)
//likes comment
router.patch('/:commenId/like',validation(endpoint.likePost),auth(endpoint.createPost),commentController.like)
//reply
router.patch("/:id/comment/:commentID/reply", validation(validators.createReply),
    auth(endpoint.createPost), commentController.replyComment)



module.exports = router