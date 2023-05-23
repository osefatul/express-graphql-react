import React from 'react'
import { gql, useQuery } from '@apollo/client';

const BookQuery = gql `
query GetBooks {
    books{
        id,
        name,
        genre
    }
}
`
function BookList() {

    console.log(BookQuery)
    const { loading, error, data } = useQuery(BookQuery);

    if (loading) return 'Loading...';
    if (error) return `Error! ${error.message}`;


return (
    <div>
        <ul id="book-list">
        {data.books.map((book) => (
            <li>
                {book.name}
            </li>
        ))}

        </ul>
    </div>
)
}

export default BookList