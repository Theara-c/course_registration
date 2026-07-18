import app from './app.js'
import dotenv from 'dotenv'

dotenv.config();
app.listen(8000, () => {
    console.log(`Server is running on port ${process.env.DB_PORT} `)
})