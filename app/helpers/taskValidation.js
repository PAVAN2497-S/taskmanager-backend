
const taskValidationSchema = {
    title: {
        notEmpty: {
            errorMessage: "title required"
        },
        description: {
            notEmpty: {
                errorMessage: "description required"
            }
        }
    }
}

module.exports = {
    taskValidationSchema
}