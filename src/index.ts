import * as env from 'dotenv';
env.config();

import express from 'express';
import { emailAuthTypes } from "./constants";
import AuthConfigEmail from "./auth/auth-config-email";
import { authenticateToken} from "./auth-utils"
const authConfig = new AuthConfigEmail(emailAuthTypes.MONGODB, {
    username: process.env.MONGO_USERNAME,
    password: process.env.MONGO_PASSWORD,
    host: process.env.MONGO_HOST,
    port: process.env.MONGO_PORT,
    serviceName: process.env.MONGO_SERVICE_NAME,
});
authConfig.configure();


const app : express.Application = express();
app.use(express.json())


const posts = [
    {
        username:'arjunw7',
        body:'test'
    },
    {
        username:'arjunw8',
        body:'test'
    }
];

app.get('/posts', authenticateToken, (req : express.Request, res : express.Response) => {
    res.send(posts.filter(post => post.username === req['user'].name))
})

app.post('/login', (req : express.Request, res : express.Response) => {
    authConfig.login(req.body.username, req.body.password)
        .then((response) => {
            res.status(200);
            res.json(response)
        })
        .catch((error) => {
            res.status(500);
            res.json(error)
        })
})

app.post('/signup', (req : express.Request, res : express.Response) => {
    authConfig.signup(req.body)
        .then((response) => {
            res.status(200);
            res.json(response)
        })
        .catch((error) => {
            res.status(400);
            res.json(error)
        })
})

app.listen(3600, () => {
    console.log("App running on port 3000.")
})
