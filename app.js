const express = require('express');
const graphqlHTTP = require('express-graphql');
const schema = require('./schema/schema');
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
// bind express with graphql
app.use('/graphql', graphqlHTTP({
    schema,
    graphiql:true
}));

console.log("Connected to MongoDB")
mongoose.connect(process.env.MONGO_URL).then(
).catch(err => console.error(err));

app.listen(4000, () => {
    console.log('now listening for requests on port 4000');
});
