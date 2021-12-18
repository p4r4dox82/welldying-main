import React from 'react';
import queryString from 'query-string';

interface Props {
    location: Location
}

function MyBook({ location }: Props) {
    let query = queryString.parse(location.search);
    let pid = query.pid;

    return (
        <>
            <div>{pid}</div>
        </>
    )
}

export default MyBook;