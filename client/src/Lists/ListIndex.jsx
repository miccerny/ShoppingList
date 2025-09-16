import React, { useEffect, useState } from "react";
import ErrorMessage from "../Error/ErrorMessage";
import { apiFetch } from "../utils/api";

const ListIndex = (props) => {
    const [listState, setListState] = useState([]);
    const [errorState, setError] = useState(null);

    useEffect(() => {
        apiFetch("/list")
        .then(setListState)
        .catch((error) => 
            setError(err.message))
        
    },[]);

    if(errorState){
        return(<ErrorMessage message={errorState}/>)
    }

    return(
        <div>
            <h1>Seznamy</h1>
            <ul>{listState.map((list) =>(
                <li key={list._id}>{list.name}{list.ownerId}{list.count}</li>
            ))}
            </ul>
        </div>
    );
};

export default ListIndex;