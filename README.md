# Express-GraphQL-React

### Intro
A simple application built with express as a backend server, graphql as a query engine/language for API and react as a frontend client library.


### Examples of queries
- Querying RootQuery using `GraphiQL`..

```javascript
{
  book(id: 2) {
    id
    name
    genre,
    author{
      name,
      age
    }
  }
  
  author(id: 1) {
    id,
    name
    age,
    books{
      name,
      author {
        id
      }
    }
  }
  
  
  books{
    name,
    genre
  }
  
  authors{
    name,
    age
  }
}

```

- Mutation using `MutationQueryGraphQL`

```javascript
mutation{

  addAuthor(name:"Name of the Wind", age: 44){
    name,
    age
  }

  addBook(name:"Name of the Wind", genre: "Fantasy", authorId: "6469cca163b6c47a755faeb1"){
    name,
    genre
  }
}
```