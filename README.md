# Express-GraphQL-React

### Intro
A simple application built with express as a backend server, graphql as a query engine/language for API and react as a frontend client library.

## Project-
### Examples of queries
- Querying using `apollo-server`
- You can use either `query` or not, but it is highly recommended.
- You can also assign a name to the query.

```javascript
query GetUser{
  users {
    age,
    name,
    friends {
      age,
      name
    },
    favoriteMovies {
      id,
      name,
      yearOfPublication,
      isInTheaters
    }
  }

  user(id:1){
    age,
    name
  }
}

```

- Mutation using `apollo-server`

```javascript
//Operation
mutation CreateUser($input: CreateUserInput!){
  createUser(input: $input) {
    id,
    name,
    username,
    age,
    nationality
  }
}


//Variables

{
  "input": {
    "name": "omar",
    "username": "omar khan",
    "age": 28,
    "nationality": "CANADA"
  }
}
```

### enums
Enums works like a validator, you put all the possible values that it contains.

```javascript
  enum Nationality {
    CANADA
    BRAZIL
    INDIA
    GERMANY
    CHILE
    UKRAINE
  }
```

So, when you ask for nationality for a user, it should contain in the enum values

```javascript
...
  type User {
    id: ID!
    name: String!
    username: String!
    age: Int!
    nationality: Nationality!
    friends: [User]
    favoriteMovies: [Movie]
  }
...
```