import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {NotificationContainer, NotificationManager} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Spinner from 'react-bootstrap/Spinner';

export const Start = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [userid, setUserId] = useState(-1);
  const [apiWait, setApiWait] = useState(false);
  const getUserDetails = async () => {
    await axios
      .get(
        // body: JSON.stringify({
        `http://localhost:8000/connection`,

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
          console.log(response.data);
          setData(response.data);
        }
      })
      .catch(function (error) {
        console.log(error.data);
        // navigate('/Login')
      });
  };
  useEffect(() => {
    // console.log (process.env.API_URL)
    getUserDetails();
  }, []);

  const handleSelect = (element) => {
    setUserId(element.target.value);
    console.log(element.target.value);
  };

  const handleSubmit = async () => {
    console.log(userid);
    setApiWait(true);
    await axios
      .post(
        // body: JSON.stringify({
        `http://localhost:8000/connectDB`,
        {
          "id":userid
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
            console.log (response.data)
            // setApiWait(false)
            window.location.reload(false);
            // navigate('/messages')
        }
      })
      .catch(function (error) {
        // console.log(error.response.data.detail, "errrrrrrrrororrrr");
        NotificationManager.error(error.response.data.detail);
        setApiWait(false);

        console.log(error.detail);
      });
  };

  return (
    <div
      style={{
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '30rem',
      }}
    >
      {apiWait?<Spinner animation="border" />:
      (<><div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 'xxx-large',
            boxShadow: '20px 17px 20px 6px',
            marginTop: '3rem',
          }}
        >
          PJD USD Application
        </div>
      </div>
      <div style={{ flex: 1, textAlign: 'center' }}>
        <label
          for="userid"
          style={{
            display: 'flex',
            fontSize: '1.25rem',
            justifyContent: 'center',
            fontWeight: 600,
            paddingBottom: '1rem',
          }}
        >
          Select User Name:
        </label>
        <select
          style={{
            textAlign: 'center',
            fontSize: 'large',
            padding: 1,
            margin: 1,
            paddingTop: 5,
            paddingBottom: 5,
            borderRadius: '1rem',
            boxShadow: '0px 0px 20px 0px',
            width: '25rem',
          }}
          onChange={handleSelect}
          name="userid"
          id="userid"
        >
          <option disabled selected value="">
            Select User Name
          </option>
          {data.map((element, index) => {
            return (
              <option key={index + 1} value={element.id}>
                {element.name}
              </option>
            );
          })}
        </select>
        {userid !== -1 ? (
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={handleSubmit}
              style={{
                marginTop: '3rem',
                borderRadius: '2rem',
                boxShadow: '0px 0px 20px 10px',
                width: '7rem',
                backgroundColor: 'grey',
                color: 'white',
                height: '2.25rem',
              }}
            >
              Connect
            </button>
          </div>
        ) : null}
      </div></>)}
      <NotificationContainer/>
    </div>
  );
};
