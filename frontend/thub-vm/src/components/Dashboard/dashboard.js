import React from "react";
import Card  from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import axios from 'axios'; 

const SERVER_URL = process.env.REACT_APP_DEV_API_URL + "/visitor/";
const token = localStorage.getItem('token')
const options = {
    headers: {'Authorization': 'Bearer ' + token}
  };



const DashboardChild = ({ visitors }) => {

    function onApprove(id){
        updateStatus(id,"Approved")
    }
    function onReject(id){
        updateStatus(id,"Rejected")
    }
    function updateStatus(id,status){
        axios.put(SERVER_URL+id,{ status : status },options )
      .then(res => {
        console.log(res)
      }, (error) => {
        console.log(error);
      });

    }
    
    return (
       
      <div className="row card-body">
           {visitors.map((visitor, i ) => ( 
          <div className="col-xs-12 col-sm-6 col-md-6">
        <Card border={visitor.status === "Rejected" ?  "danger" : "success" }   style={{ width: "20rem", margin : "1rem" }}>
          <Card.Header>{visitor.status}</Card.Header>
          <Card.Body>
           <Card.Title>{visitor.visitorName}</Card.Title>
            <Card.Text>
                Requested Time: {visitor.time} <br></br>
              Phone Number: {visitor.phone} <br></br>
              Reason : {visitor.description}
            </Card.Text>
            <Button variant="success" onClick={(e) => onApprove(visitor._id, e)}>Approve</Button> <Button variant="danger" onClick={(e) => onReject(visitor._id, e)}>Reject</Button>
          </Card.Body>
        </Card>
        </div>    
        ))}    
    </div>
    )
  
};

export default DashboardChild
