const yup = require('yup')

const userSchema = yup.object({
    body: yup.object({
        firstname: yup.string().required('Please enter name'),
        lastname: yup.string().required('Please enter name'),
        email: yup
            .string()
            .email('Invalid email format')
            .required('Please enter email'),
        password: yup.string().required('Please enter password'),
        confirmpassword: yup
            .string()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
            .required('Please confirm your password'),
    }),
});

const userLoginSchema = yup.object({
    body: yup.object({
        email: yup.string()
            .required('Please enter email')
            .matches(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Invalid email format"),
        password: yup.string().required('Please enter password')
    })
});

const userValidate = (schema) => async (req, res, next) => {
    try {
        await schema.validate({
            body: req.body,
        }, { abortEarly: false }); // Validates all fields and returns all errors
        return next();
    } catch (err) {
        console.error(err);
        return res.status(400).json({ errors: err.errors });
    }
};


module.exports = {
    userSchema,
    userValidate,
    userLoginSchema
}