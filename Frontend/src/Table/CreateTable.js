import React, { useState } from 'react';
import axios from 'axios'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { Alert } from 'react-bootstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Spinner from 'react-bootstrap/Spinner';



const CreateTable = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [isPrimaryKey, setIsPrimaryKey] = useState(false);
  const [apiWait, setApiWait] = useState(false)



//   let history = useHistory();
  const [tableName, setTableName] = useState () ; 
  const [first, setFirst] = useState([]);
  const [last, setLast] = useState([]);
  const [att, setAtt] = useState()

  const [user, setUser] = useState({
    tableName: '',
  });

  // const { tableName, username, email, phone, website } = user;
  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
  };
  const createTable = async () => {
    // e.preventDefault();
    setApiWait(true);
    
    
    let flag = true
    console.log (user.tableName)


    if (att===undefined){
      if (!user.tableName){
        NotificationManager.error("Please fill Table Name and Columns Details");
      }else{
        NotificationManager.error("Columns Cannot be Empty");
      }
      console.log ('undefined')
      setApiWait(false)
      return null;
    } 
    if (!user.tableName){
      NotificationManager.error("Table Name Cannot be Empty");
    }


    let attributes=JSON.parse(att);

    let requestData = {
      "tableName":user.tableName,
      "attributes": attributes,
    }
    console.log (requestData)
    
    await axios.post(`http://localhost:8000/createTable`, requestData,{
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'http://localhost:8000',
        Accept: 'application/json',
      },
      withCredentials: true,
    })
    .then(function (response) {
      if (response.status===200){
        console.log (response.data)
        // Alert("Table created successfully")
        console.log ("Table Created Successfully")
        // alert('Table Created Successfully')
        // NotificationManager.success('Table Created Successfully');
        navigate('/TableDetails')
      }
    })
    .catch(function(error){
      NotificationManager.error(error.response.data.detail);
    });
    // history.push('/');
    setApiWait(false);
  };

  

const [first_name, setFirst_name] = useState("")
const [last_name, setLast_name] = useState("");
const handleColumnsData = () => {
  // console.log (first_name, last_name);
  let temp = first;
  isPrimaryKey?temp.push (first_name+'__pk'):temp.push (first_name)
  setIsPrimaryKey(false)
  setFirst(temp)
  temp = last;
  temp.push (last_name)
  setLast(temp);
  console.log (first, last)
  const result = first.map((item, index)=> {return [item,last[index]]})
  // console.log ("objectttt: ",result)
  const json =JSON.stringify(Object.fromEntries(result))
  // console.log (json)
  setFirst_name("")
  setAtt(json)
  console.log (att)
  
  handleClose();

}
  return (
    <div className="container" style={{marginTop:'2rem'}}>  

      <Modal
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Column</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <div className="form-group" style={{marginTop:'1rem', }}>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Column Name"
              name="first_name"
              value={first_name}
              onChange={(e)=>{setFirst_name(e.target.value)}}
            />
          </div>
        <div className="form-group" style={{margin:'1rem',}}>
          <select name="last_name"  onChange={(e)=>{setLast_name(e.target.value)}} required>
            <option disabled selected value="">Select Column Type</option>
          <option  value={"String"} >String</option>
          <option  value={"INT"} >INT</option>
          <option  value={"BIGINT"} >BIGINT</option>
          <option  value={"BOOLEAN"} >BOOLEAN</option>
          <option  value={"DOUBLE"} >DOUBLE</option>
          <option  value={"FLOAT"} >FLOAT</option>
          <option  value={"DATE"} >DATE</option>
          <option  value={"TIMESTAMP"} >TIMESTAMP</option>
      </select>
          </div>
        <div className="form-group" style={{margin:'1rem',textAlign:'right'}}>
        <input
              type="checkbox"
              id="isPrimary"
              name="isPrimary"
              unchecked
              // value="isPrimary"
              onChange={(e)=>{setIsPrimaryKey(!isPrimaryKey)}}
              // checked={isChecked}
              />
        <label style={{paddingLeft:4}} for="isPrimary">Is Primary </label>
          </div>
          
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={()=>{handleColumnsData()}}>Add</Button>
        </Modal.Footer>
      </Modal>
      {apiWait?<div style={{textAlign:'center'}}><Spinner animation="border" /></div>:
      <div className="w-75 mx-auto shadow p-5">
        <h2 className="text-center mb-4">Create a Table</h2>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="form-group" style={{marginTop:'1rem', }}>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Table Name"
              name="tableName"
              value={tableName}
              onChange={(e) => onInputChange(e)}
            />
          </div>
          <button
            className="btn btn-outline-primary"
            style={{ margin:'1rem' }}
            onClick={handleShow}
          >
            Add Column
          </button>
          <table className="table border shadow">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Columns</th>
              <th scope="col">Type</th>
            </tr>
          </thead>
          <tbody>
            {first.map((f_name, index) => (
              <tr>
                <th scope="row">{index + 1}</th>
                <td>{f_name}</td>
                <td>{last[index]}</td>
                <td>
                </td>
                {/* <td>
                  <Link className="btn btn-primary" style={{margin:2}} to={`/users/${user.id}`}>View</Link>
                  <Link className="btn btn-outline-primary" style={{margin:2}} to={`/users/edit/${user.id}`}>Edit</Link>
                  <button className="btn btn-danger" style={{margin:2}} onClick={()=>{deleteUser(user.id)}}>Delete</button>
                </td> */}
              </tr>
            ))}
          </tbody>
        </table>
          {/* <div className="form-group" style={{marginTop:'1rem'}}>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Username"
              name="username"
              value={username}
              onChange={(e) => onInputChange(e)}
            />
          </div>
          <div className="form-group" style={{marginTop:'1rem'}}>
            <input
              type="email"
              className="form-control form-control-lg"
              placeholder="Enter Your E-mail Address"
              name="email"
              value={email}
              onChange={(e) => onInputChange(e)}
            />
          </div>
          <div className="form-group" style={{marginTop:'1rem'}}>
            <input
              type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Phone Number"
              name="phone"
              value={phone}
              onChange={(e) => onInputChange(e)}
            />
            </div>
            <div className="form-group" style={{marginTop:'1rem'}}>
            <input
            type="text"
              className="form-control form-control-lg"
              placeholder="Enter Your Website Name"
              name="website"
              value={website}
              onChange={(e) => onInputChange(e)}
            />
          </div> */}
          <button className="btn btn-primary btn-block" style={{width:'100%', marginTop:'2rem'}} onClick={()=>{createTable()}} >Create Table</button>
        </form>
      </div>
          }
      <NotificationContainer/>
    </div>
  );
};

export default CreateTable;
