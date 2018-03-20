const express = require('express');
const expressGraphQL = require('express-graphql');
const schema = require('./schema.js')

// express server
const app = express();

// express-Graphql links the two
app.use('/graphql', expressGraphQL({
  // GraphQL Config
  schema: schema,
  graphiql: true
}));

app.listen(4000, () => {
  console.log('Server is running')
});