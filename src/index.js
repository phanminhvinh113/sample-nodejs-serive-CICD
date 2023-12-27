const express = require('express');
const app = express();
const db = require('./persistence/index.js');
const getItems = require('./routes/getItems.js');
const addItem = require('./routes/addItem.js');
const updateItem = require('./routes/updateItem.js');
const deleteItem = require('./routes/deleteItem.js');

app.use(express.json());
app.use(express.static(__dirname + '/static'));

app.get('/items', getItems);
app.post('/items', addItem);
app.put('/items/:id', updateItem);
app.delete('/items/:id', deleteItem);
app.get('/check/status', async (req, res) => {
    res.sendStatus(200).json({
        message: 'server ok',
        status: 200,
    });
});
db.init()
    .then(() => {
        app.listen(3032, () => console.log('Listening on port 3032'));
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });

const gracefulShutdown = () => {
    db.teardown()
        .catch(() => {})
        .then(() => process.exit());
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);
process.on('SIGUSR2', gracefulShutdown); // Sent by nodemon
