import axios from 'axios';
import React, { useEffect, useState, useContext  } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import { Button } from 'react-bootstrap';

const TableDetails = () => {
  // const haha = ['heart_1_csv', 'squares', 'users'];
  const [tableNames, setTableNames] = useState([]);
  const [tablesData, setTablesData] = useState([]);
  const [meta, setMeta]= useState()
  const [selected, setSelected] = useState(-1);
  const location = useLocation();
  const [selectedTable,SetSelectedTable] = useState();
  const [loading, setLoading] = useState(false);


  useEffect( ()=>{
     axios
    .get(
          // body: JSON.stringify({
            `http://localhost:8000/metadata`,
          {
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin':'http://localhost:8000',
              Accept: 'application/json',
            },
            withCredentials: true,
          }
          )
          .then(function (response) {
            console.log(response.status.toString());


            if (response.status ===200){
            console.log(response.status.toString());
            let table = JSON.parse(response.data[0]);
            console.log (table)
            // var data = table;
            // console.log (data)
            


            let tableName = [] ;
          let tableData = [] 
        let temp = [] 
        i =0;
        (table.metaData).forEach((element) => {
          let temp1 = [] 
          if (!tableName.includes(element[0])){
            
            tableName.push(element[0]);
            // console.log (element[0])
          }
    
          if (element[0]===tableName[i]){
            temp1.push(element[1])
            temp1.push(element[2])
            
            temp.push(temp1)
            temp1=[]
            
          }
          else {
            tableData.push(temp)
            console.log(i,temp)
            i++;
            temp=[]
            temp1.push(element[1])
            temp1.push(element[2])
            temp.push(temp1)
            temp1=[]
          }
          // console.log(element[0])
        })
        tableData.push(temp)
        console.log (tableData)
        setTablesData(tableData)
        
        setTableNames(tableName)
        console.log (tableNames)

            }
        })
        .catch(function (error) {
          // Alert.alert(error.response.data.msg);
          console.log (error.data)
        });
  },[loading])

const handleSelect =(element) =>{
  if (element.target.value!==-1){
    setSelected(element.target.value);

  }
  console.log(selected);

}  

// const loadUsers = async () => {
//   const result = await axios.get('http://localhost:3003/users');
//   setTable(result.data.reverse());
//   console.log(result);
// };

// const deleteUser = async id => {
//   await axios.delete(`http://localhost:3003/users/${id}`);
//   loadUsers();
// };
// useEffect(()=>{console.log (tablesData[selected]),[selected]})
// console.log (tablesData[selected]);
  return (
    <>
    <div className="title">Tables</div>
      {/* <label for="cars">Choose a car:</label> */}
    <div style={{justifyContent:'center'}}>
    <Link
            className="btn btn-primary"
            to="/Table/createtable"
            
            style={{ position: 'absolute', right: '1rem' }}
          >
            Create Table
          </Link>
    {selected!==-1?(<><button
          className="btn btn-danger"
          onClick={()=>{
            axios.post(
      // body: JSON.stringify({
      `http://localhost:8000/truncateTable`,
      {
        tableName:tableNames[selected]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:8000',
          Accept: 'application/json',
        },
        withCredentials: true,
      }
    )
    .then(function (response) {
      console.log(response.status.toString());

      if (response.status === 200) {
        // navigate('/Messages' )
        NotificationManager.success('Table Truncate Successfully');
      }
    })
    .catch(function (error) {
      // console.log(error.data);
      NotificationManager.error(error.response.data.detail);
      // navigate('/Login')
    })
    
    setLoading(!loading)
  }}
            style={{ position: 'absolute', right: '9rem' }}
            >
            Truncate Table
          </button>
    <button
            className="btn btn-outline-danger"            
            onClick={()=>{
              axios.post(
        // body: JSON.stringify({
        `http://localhost:8000/deleteWholeTable`,
        {
          tableName:tableNames[selected]
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': 'http://localhost:8000',
            Accept: 'application/json',
          },
          withCredentials: true,
        }
      )
      .then(function (response) {
        console.log(response.status.toString());

        if (response.status === 200) {
          // navigate('/Messages' )
          // NotificationManager.success('Table Deleted Successfully');
          window.location.reload(false);
        }
      })
      .catch(function (error) {
        // console.log(error.data);
        NotificationManager.error(error.response.data.detail);
        // navigate('/Login')
      })
      setLoading(!loading)
    }}
              
            style={{ position: 'absolute', right: '18rem' }}
          >
            Delete Table
          </button></>):null}
          
      <select name="table" id="table" onChange={handleSelect} autofocus>
        <option disabled selected value="">Select Table</option>
        {tableNames.map((element,index)=>{
          return <option key={index+1} value={index} >{element}</option>
        })}
        {/* <option value="volvo">Volvo</option>
        <option value="saab">Saab</option>
        <option value="mercedes">Mercedes</option>
        <option value="audi">Audi</option> */}
      </select>
      <div className="py-4">
        <h1>Columns</h1>
        {selected!==-1?<table className="table border shadow">
          <thead className="table-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Columns</th>
              <th scope="col">Type</th>
              {/* <th scope="col">Handle</th> */}
              {/* <th >Action</th> */}
            </tr>
          </thead>
          <tbody>
            {/* {console.log (tablesData[selected][0])} */}
            {(tablesData[selected]).map((user, index) => (
              user[0]==='Serial'?null:(
              <tr>
              <th scope="row">{index}</th>
              <td>{user[0]}</td>
              <td>{user[1]}</td>
              {/* <td>{user.email}</td> */}
              {/* <td>
                <Link className="btn btn-primary" style={{margin:2}} to={`/users/${index}`}>View</Link>
                <Link className="btn btn-outline-primary" style={{margin:2}} to={`/users/edit/${index}`}>Edit</Link>
                <button className="btn btn-danger" style={{margin:2}} onClick={()=>{deleteUser(index)}}>Delete</button>
              </td> */}
            </tr>)
              
            ))}
          </tbody>
        </table>:null}
        
      </div>
      <NotificationContainer/>
      </div>
    </>
    
  );
};

export default TableDetails;
