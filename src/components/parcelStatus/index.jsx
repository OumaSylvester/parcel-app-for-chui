import React, {useState, useEffect} from "react";
import getURLs from "../../services/urls";
import { makeRequest } from "../../utils/requests_utils";
import { GET } from "../../utils/constants";
import { Button, Table, Card } from "react-bootstrap";

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
                    <Card className="mb-3">
                        <Card.Body className="text-start">
                            <Card.Title className="text-capitalize">{todo.title}</Card.Title>
                            <Card.Text>
                                <p><span className="h6">Parcel Id:</span> {todo.id}</p>
                                <p><span className="h6">Delivery Status:</span> {todo.completed? 'Delivered' : "Not delivered"}</p>
                            </Card.Text>
                          
                        </Card.Body>
                    </Card>
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