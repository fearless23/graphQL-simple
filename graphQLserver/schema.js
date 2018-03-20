const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLSchema,
  GraphQLList,
  GraphQLNonNull
} = require('graphql');
const axios = require('axios');

// Data Models
const CustomerType = new GraphQLObjectType({
  name: 'Customer',
  fields: () => ({
    id: { type: GraphQLString },
    name: { type: GraphQLString },
    email: { type: GraphQLString },
    age: { type: GraphQLInt }
  })
})

// Query Model
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    customer: {
      type: CustomerType,
      args: {
        id: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        // Getting Data from Database
        return axios.get('htpp://localhost:3000/customers/'+ args.id)
        .then( result => result.data )
      }
    },
    customers: {
      type: new GraphQLList(CustomerType),
      args: {
        length: { type: GraphQLInt },
        sort: { type: GraphQLString }
      },
      resolve(parentValue, args) {
        let customers = axios.get('htpp://localhost:3000/customers').then( result => result.data )
        console.log(customers)
        if (args.sort === 'inc') {
          const sorted = customers.then( res => res.sort((a, b) => a.age > b.age))
          return sorted.then(res => res.slice(0, args.length));
        }
        if (args.sort === 'dec') {
          const sorted = customers.then( res => res.sort((a, b) => a.age < b.age))
          return sorted.then(res => res.slice(0, args.length));
        }
        else{
          return customers.then(res => res.slice(0,args.length))
        }
      }

    }
  }

});
// Mutations 
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addCustomer: {
      type: CustomerType,
      args: {
        name: {type: new GraphQLNonNull(GraphQLString)},
        email: {type: new GraphQLNonNull(GraphQLString)},
        id: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: new GraphQLNonNull(GraphQLInt)}
      },
      resolve(parentValue, args){
        return axios.post('http://localhost:3000/customers', {
          name: args.name,
          age: args.age,
          email: args.email,
          id: args.id
        }).then(res => res.data)
      }
    },
    delteCustomer: {
      type: CustomerType,
      args: {
        id: {type: new GraphQLNonNull(GraphQLString)},
      },
      resolve(parentValue, args){
        return axios.delete('http://localhost:3000/customers/'+ args.id).then(res => res.data)
      }
    },
    updateCustomer: {
      type: CustomerType,
      args: {
        name: {type: GraphQLString},
        email: {type: GraphQLString},
        id: {type: new GraphQLNonNull(GraphQLString)},
        age: {type: GraphQLInt}
      },
      resolve(parentValue, args){
        return axios.patch('http://localhost:3000/customers/'+ args.id, args).then(res => res.data)
      }
    },
  }
})

// Query to the Server
module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation: mutation
})
