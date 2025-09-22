import React, {useState, useEffect} from "react";
import getURLs from "../../services/urls";
import { makeRequest } from "../../utils/requests_utils";
import { GET } from "../../utils/constants";
import { Button, Table } from "react-bootstrap";

const ParcelStatus = ({parcelId}) => {
    const [todo, setToDo] = useState({});
    const [isLoaded, setIsLoaded] = useState(false);

    const getTodo = () => {
        makeRequest(getURLs().getToDosById(parcelId), GET, {}, false)
        .then((todo) => {
            setToDo(todo);
            setIsLoaded(true);
        })
        .catch((error)=>{
            setToDo(undefined)
            setIsLoaded(true);
        })
    }

    useEffect(()=> {    
        getTodo(parcelId);
    }, [parcelId])
   
    if(!isLoaded)  return (<div>Loading...</div>)
    
    return (
        <div>
            {todo && isLoaded?
                <>
                    <Table striped responsive>
                        <thead>
                            <th>Parcel Id</th>
                            <th>Delivery Status</th>
                        </thead>
                        <tbody>
                            <td>{todo.id}</td>
                            <td>{todo.completed? 'Delivered' : "Not delivered"}</td>
                        </tbody>
                    </Table>

                    <Button onClick={(e)=> getTodo()}>Refresh</Button>
                </>
                :
                <>
                    <p>We experienced a problem loading your todo</p>
                </>
            }

           
        </div>
    )

}

export default ParcelStatus;