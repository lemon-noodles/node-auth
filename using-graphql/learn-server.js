import { ApolloServer, gql } from "apollo-server";
import crypto from "crypto";

const users = [
  {
    id: "1",
    first_name: "Naveen",
    last_name: "Kumar",
    email: "naveen@example.com",
    password: "12345",
  },
  {
    id: "2",
    first_name: "Pooja",
    last_name: "Naveen",
    email: "pooja@example.com",
    password: "12345",
  },
];

const todos = [
  { id: "1", title: "What the fuck!", by: "1" },
  { id: "2", title: "What the duck!", by: "2" },
  { id: "3", title: "What the muck!", by: "2" },
];

// schema
// tagged template literal
const typeDefs = gql`
  type Query {
    greet: String
    users: [User]
    user(id: ID!): User
  }
  input UserInput {
    first_name: String!
    last_name: String!
    email: String!
    password: String!
  }
  type Mutation {
    createUser(new_user: UserInput): User
  }
  type Todo {
    id: ID!
    title: String!
    by: String!
  }
  type User {
    id: ID!
    first_name: String!
    last_name: String!
    email: String!
    todos: [Todo]
  }
`;

const resolvers = {
  Query: {
    greet: () => "Hello World!",
    users: () => users,
    user: (parent, args, context) => {
      console.log(context);
      return users.find((item) => item.id === args.id);
    },
  },
  User: {
    todos: (parent) => {
      return todos.filter((t) => t.by === parent.id);
    },
  },
  Mutation: {
    createUser: (parent, args, context) => {
      const { new_user } = args;
      const user = { ...new_user, id: crypto.randomUUID() };
      users.push(user);
      console.log(users);
      return user;
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: { owner: "Naveen" },
});

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
