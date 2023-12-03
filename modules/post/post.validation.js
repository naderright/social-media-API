const Joi = require("joi");

const createPost = {

    body: Joi.object().required().keys({

        text: Joi.string().optional()

    })
}


const likePost = {

    params: Joi.object().required().keys({

        id: Joi.string().min(24).max(24)

    })
}


const createComment= {

    body: Joi.object().required().keys({

        text: Joi.string().optional()

    }),
    params: Joi.object().required().keys({

        id: Joi.string().min(24).max(24)

    })

}


const createReply= {

    body: Joi.object().required().keys({

        text: Joi.string().optional()

    }),
    params: Joi.object().required().keys({

        id: Joi.string().min(24).max(24),
        commentID: Joi.string().min(24).max(24),


    })

}


module.exports  = {
    createPost,
    likePost,
    createComment,createReply
}