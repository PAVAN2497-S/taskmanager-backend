require('dotenv').config();
const express = require('express');
const cors = require('cors');
const passport = require('passport');
const cookieSession = require('cookie-session');
const helmet = require('helmet');
const configureDb = require('./config/db');
const passportSetup = require('./app/middleware/passport');
const authRoute = require('./app/routes/auth');
const { user_register, user_login, getProfile } = require('./app/controllers/userCltr');
const { userValidate, userSchema, userLoginSchema } = require('./app/helpers/userValidation');
const { checkSchema } = require('express-validator');
const { taskValidationSchema } = require('./app/helpers/taskValidation');
const { add_task, get_task, individual_task, edit_task, delete_task, get_tasks_by_user } = require('./app/controllers/taskCltr');
const { authenticate } = require('./app/middleware/authentication');
const session = require('express-session');

const app = express();

app.use(express.json());
app.use(helmet());
app.use(cors({
    origin: "https://taskmanager-frontend-5yrv-dx2yod0zk-pavan2497s-projects.vercel.app",
    methods: "GET,POST,PUT,DELETE",
    credentials: true
}));

app.use(
    session({
        secret: process.env.SESSION_SECRET, 
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 60 * 60 * 24 * 365 * 1000,
            secure: process.env.NODE_ENV === 'production' 
        }
    })
);
app.use(passport.initialize());
app.use(passport.session());


passportSetup(); 


configureDb();


app.use("/auth", authRoute);

// User routes
app.post('/api/register', userValidate(userSchema), user_register);
app.post('/api/login', userValidate(userLoginSchema), user_login);
app.get('/api/getprofile', authenticate, getProfile)
app.get('/api/tasks/user/:userId',authenticate, get_tasks_by_user);
// Task routes
app.post('/api/add-task', authenticate, checkSchema(taskValidationSchema), add_task);
app.get('/api/task', authenticate, get_task);
app.get('/api/task/:id', authenticate, individual_task);
app.put('/api/edit-task/:id', authenticate, checkSchema(taskValidationSchema), edit_task);
app.delete('/api/delete-task/:id', authenticate, delete_task);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
