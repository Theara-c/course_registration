import express from 'express';

const server = express();
server.get('/', async (req,res) => {
    return res.json({msg: "Hello world"})
})