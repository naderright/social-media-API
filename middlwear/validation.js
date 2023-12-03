const dataMethod = ['body', 'params', 'query', 'file', 'headers']



const validation = (schema) => {
    return (req, res, next) => {
        const validationErrorArr = []
        dataMethod.forEach(key => {
            if (schema[key]) {
                const validationRsult = schema[key].validate(req[key], { abortEarly: false })
                if (validationRsult.error) {
                    validationErrorArr.push(validationRsult.error.details)
                }
            }
        })

        if (validationErrorArr.length) {
            res.status(400).json({ message: 'Validation error', validationErrorArr })
        } else {
            next()
        }

    }
}

module.exports = validation