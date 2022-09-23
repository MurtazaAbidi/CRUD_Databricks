import Sidebar from 'components/Sidebar';
import { Start } from 'pages/Start';
import Dashboard from 'pages/Dashboard';
import TableDetails from 'pages/TableDetails';
import QueryBuilder from 'pages/QueryBuilder';
import { MemoryRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import '../../node_modules/bootstrap/dist/css/bootstrap.css';
import './App.css';
import CreateTable from 'Table/CreateTable';
// import axios from 'axios';
// import { useCallback, useEffect, useState } from 'react';
import { useCallback, useEffect } from 'react';
import axios from 'axios';
import { useState } from 'react';
import Spinner from 'react-bootstrap/Spinner';


const PJD = () => {
    const navigate = useNavigate();
    const [apiWait, setApiWait] = useState (false);

  const Connection = useCallback(async () => {
        await axios
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
                  setApiWait(false)
                  navigate('/TableDetails' )
                }
    
            })
            .catch(function (error) {
              // console.log (error.data)
              setApiWait(false)
              navigate('/Start')
            });
    }, [navigate]);

    useEffect(()=>{
      setApiWait(true)
      Connection();
    },[])
  return (
    <div
    style={{
      display: 'flex',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '30rem',}}>{apiWait?<Spinner animation="border" />:null}</div>
  )
}


export default function App() {
  
  return (
    <Router>
      <Sidebar>
        <Routes>
          <Route path="/" element={<PJD />} />
          <Route path="/Start" element={<Start />} />
          <Route path="/Dashboard/:id" element={<Dashboard />} />
          <Route path="/TableDetails" element={<TableDetails />} />
          <Route path="/QueryBuilder" element={<QueryBuilder />} />
          <Route path="/Table/createtable" element={<CreateTable />} />
          <Route path="*" element={<> not found</>} />
        </Routes>
      </Sidebar>
    </Router>
  );
}
