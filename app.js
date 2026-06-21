import express from 'express'
import loginRoute from './controller/loginRoute'
import signupRoute from './controller/loginRoute'
const app = express()
app.use(express.json())

app.get('/', async (req, res) => {
    return res.json({ msg: "Hello world" })
})
app.use('/login', loginRoute);
app.use('/signup', signupRoute);


export default app;