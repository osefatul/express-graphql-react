# Express-GraphQL-React

### Intro
A simple application built with express as a backend server, graphql as a query engine/language for API and react as a frontend client library.

## Project - GraphQL-FakeData-React
### Examples of queries
- Querying using `apollo-server`
- You can use either `query` or not, but it is highly recommended.
- You can also assign a name to the query.

```javascript
//Using A simple query
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
}


//using query a long with error handling techniques:
query GetUser{
  users {
    ...on UsersSuccessfulResult{
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
    }

    ...on UsersErrorResult{
      message
    }
  }
}



query GetUser($userId: ID!){
  user(id: $userId) {
    id,
    name,
    username
  }
}

"userId": "2"

```

- Mutation using `apollo-server`

```javascript
//Operation
mutation deleteUser($deleteUserId: ID!){
  deleteUser(id: $deleteUserId) {
    id
  }
}


mutation updateUsername($updateUsernameInput2:  UpdateUsernameInput!){
  updateUsername(input: $updateUsernameInput2) {
    id,
    username,
    name
  }
}


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
    "name": "SEFAT",
    "username":"Sefatullah Omar",
    "age":28,
    "nationality": "CANADA",
  },

  "deleteUserId": "4",

  "updateUsernameInput2": {
    "id": "2",
    "newUsername": "Osefatul"
  },

  "userId": "2"

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

type User 
{
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