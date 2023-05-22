import React, { useState } from "react";
import { useQuery, useLazyQuery, gql, useMutation } from "@apollo/client";

// const QUERY_ALL_USERS = gql`
//   query GetAllUsers {
//     users {
//       id
//       name
//       age
//       username
//       nationality
//     }
//   }
// `;

const QUERY_ALL_USERS = gql`
  query GetUser{
  users {
    ...on UsersSuccessfulResult{
      users {
        id,
        age,
        name,
        username,
        nationality,
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
`;

const QUERY_A_USER = gql`
  query User ($id: ID!) {
    user(id: $id){
      id
      name
      age
      username
      nationality
    }
  }
`;

const QUERY_ALL_MOVIES = gql`
  query GetAllMovies {
    movies {
      name
    }
  }
`;

const GET_MOVIE_BY_NAME = gql`
  query Movie($name: String!) {
    movie(name: $name) {
      name
      yearOfPublication
    }
  }
`;

const CREATE_USER_MUTATION = gql`
  mutation CreateUser($input: CreateUserInput!) {
    createUser(input: $input) {
      name
      id
    }
  }
`;

const DELETE_USER_MUTATION = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
    id
    }
  }
`
const UPDATE_USERNAME_MUTATION = gql`
  mutation UpdateUser($input: UpdateUsernameInput!) {
    updateUsername(input: $input ){
      id,
      username,
      name
    }
  }
`

function DisplayData() {

  //Query All users
  const { data, loading, refetch } = useQuery(QUERY_ALL_USERS);
  console.log(data)
  //Query All movies
  const { data: movieData } = useQuery(QUERY_ALL_MOVIES);
  
  // Create User States
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const [nationality, setNationality] = useState("");
  const [createUser] = useMutation(CREATE_USER_MUTATION);
  
  //Searched Movie
  const [movieSearched, setMovieSearched] = useState("");
  const [fetchMovie,{ data: movieSearchedData, error: movieError },] = useLazyQuery(GET_MOVIE_BY_NAME);

  //Search A Specific User
  const [getAUser, { data: userSearchedData, error: userError }] = useLazyQuery (QUERY_A_USER);

  //Delete A User
  const [id, setId] = useState("")
  const [deleteUser] = useMutation(DELETE_USER_MUTATION)

  //Update-username
  const [newUsername, setNewUsername] = useState("")
  const [updateUser] = useMutation(UPDATE_USERNAME_MUTATION)


  if (loading) {
    return <h1> DATA IS LOADING...</h1>;
  }

  return (
    <div style= {{display:"flex", flexDirection: "column", margin: "0px auto", width:"50%" }}>
      <div style={{display: "flex", margin: "0px auto", justifyContent: "space-between", gap: "10px"}}>
        <input
          type="text"
          placeholder="Name..."
          onChange={(event) => {
            setName(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Username..."
          onChange={(event) => {
            setUsername(event.target.value);
          }}
        />
        <input
          type="number"
          placeholder="Age..."
          onChange={(event) => {
            setAge(event.target.value);
          }}
        />
        <input
          type="text"
          placeholder="Nationality..."
          onChange={(event) => {
            setNationality(event.target.value.toUpperCase());
          }}
        />
        <button
          onClick={() => {
            createUser({
              variables: {
                input: { name, username, age: Number(age), nationality },
              },
            });

            refetch();
          }}
        >
          Create User
        </button>
      </div>

      <div style={{display: "flex", justifyContent: "start", gap: "10px"}}>
        <input
            type="text"
            placeholder="ID"
            onChange={(event) => {
              setId(event.target.value);
            }}
        />

        <input
            type="text"
            placeholder="New Username"
            onChange={(event) => {
              setNewUsername(event.target.value);
            }}
        />
      
        <button
          onClick={() => {
            updateUser({
              variables: {
                input: {id, newUsername}
              },
            });

            refetch();
          }}
        >
          Update Username
        </button>
      </div>

      <div style={{display: "flex", justifyContent: "start", gap: "10px"}}>
        <input
            type="text"
            placeholder="ID"
            onChange={(event) => {
              setId(event.target.value);
            }}
        />
      
        <button
          onClick={() => {
            deleteUser({
              variables: {
                id:id,
              },
            });

            refetch();
          }}
        >
          Delete User
        </button>
      </div>

      <div style={{display: "flex", justifyContent: "start", gap: "10px"}}>
        <input
            type="text"
            placeholder="ID"
            onChange={(event) => {
              setId(event.target.value);
            }}
        />
      
        <button
          onClick={() => {
            getAUser({
              variables: {
                id:id,
              },
            });
            
          }}>
          Fetch User
        </button>
      </div>

      {
        userSearchedData &&
        <p>
          Searched user: {userSearchedData.user.username}
        </p>
      }

      {userError && <h1> There was an error fetching the data</h1>}

      <h1>All Users</h1>
      {data &&
        data.users.users.map((user) => {
          return (
            <div style={{display: "flex", gap: "10px"}}>
              <p>Id: {user.id}</p>
              <p>Name: {user.name}</p>
              <p>Username: {user.username}</p>
              <p>Age: {user.age}</p>
              <p>Nationality: {user.nationality}</p>
            </div>
          );
        })}

      <h1>All Movies</h1>
      {movieData &&
        movieData.movies.map((movie) => {
          return <p style={{display: "flex", justifyContent:"center", alignItems:"start", textAlign: "center", gap: "10px"}}>
            Movie Name: {movie.name}
            </p>;
        })}

      <div>
        <input
          type="text"
          placeholder="Interstellar..."
          onChange={(event) => {
            setMovieSearched(event.target.value);
          }}
        />
        <button onClick={() => {
          fetchMovie({variables:{name:movieSearched}})
          }}>
          Fetch Data
        </button>
        <div>
          {movieSearchedData && (
            <div>
              <p>MovieName: {movieSearchedData.movie.name}</p>
              <p>
                Year Of Publication: {movieSearchedData.movie.yearOfPublication}
              </p>{" "}
            </div>
          )}
          {movieError && <h1> There was an error fetching the data</h1>}
        </div>
      </div>
    </div>
  );
}

export default DisplayData;
