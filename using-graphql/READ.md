- Server side operations
  - Schema
    - holds blueprint or the schema of our data/table
    - definition of what client can query, what client can mutate
  - Resolvers
    - basically holds the business logic to query and mutate data
  - Mutations
    - also need to be defined on the server
- Client side operations

  - Query
    - Reading docs
  - Mutations
    - Creation, updation and deletion of documents

- Relationships can be defined between 2 different schemas
- Parent argument can be used to resolve get the child schemas data

  - Eg - user schema's id can be used to get todos related to a user

- Context holds extra information that can be made available to the resolver functions, eg - logged in user info

---

Prisma setup

- `npx prisma init`
- it generates a .env file and prisma/schema.prisma
- we set the db credentials and url in .env
- we added a model called User in prisma/schema.prisma
- we ran `npx prisma db push`, this created a table in the db with the spec from the schema
- we also installed `npm install @prisma/client`
- no need of setting up dotenv, pisma handles that

---

Docker

- when running prisma and db through docker, we should use container name instead of localhost to connect to db
