import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';
import Spinner from 'react-bootstrap/Spinner';
import { CSVLink, CSVDownload } from "react-csv";

function Dashboard() {
  const [csvData, setCsvData] = useState([]);
  const { id } = useParams();
  const [tableRows, setTableRows] = useState([]);
  const [tableNames, setTableNames] = useState([]);
  const [tablesData, setTablesData] = useState([]);
  const [apiWait, setApiWait] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [updateModalShow, setUpdateModalShow] = useState(false);
  const [columnNames, setColumnNames] = useState([]);
  const [insert_row, setInsert_row] = useState([]);
  const [loading, setLoading] = useState(false);
  const [targeted_Row, setTargeted_row] = useState([]);
  const [targeted_row_length, setTargeted_row_length]= useState(0)
  const [generateCSVFlag, setGenerateCSVFlag] = useState(false);
  const [LoadingCSVButton, setLoadingCSVButton] = useState(false);

  const getMetaData = async () => {
    await axios
      .get(
        // body: JSON.stringify({
        `http://localhost:8000/metadata`,
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
          console.log(response.status.toString());
          let table = JSON.parse(response.data[0]);

          let tableName = [];
          let tableData = [];
          let temp = [];
          i = 0;
          table.metaData.forEach((element) => {
            let temp1 = [];
            if (!tableName.includes(element[0])) {
              tableName.push(element[0]);
            }

            if (element[0] === tableName[i]) {
              temp1.push(element[1]);
              temp1.push(element[2]);

              temp.push(temp1);
              temp1 = [];
            } else {
              i++;
              tableData.push(temp);
              temp = [];
              temp1.push(element[1]);
              temp1.push(element[2]);
              temp.push(temp1);
              temp1 = [];
            }
          });
          // console.log(element[0])
          tableData.push(temp);
          console.log(tableData);
          setTablesData(tableData);

          setTableNames(tableName);
          console.log(tableName[id])
          axios
            .post(
              // body: JSON.stringify({
              `http://localhost:8000/showData`,
              {
                tableName: tableName[id],
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
                console.log (response.data.Data)
                // console.log (JSON.parse(response.data).Data)
                // console.log (JSON.parse(response.data))
                // setTableRows(JSON.parse(response.data).Data);
                setTableRows(response.data.Data);
                  setApiWait(false);
              }
            })
            .catch(function (error) {
              NotificationManager.error(error.response.data.detail);
            });
          let col_names = [];
          let inner_row = [];
          console.log ("tableData [ id ] : " , tableData[id]);
          tableData[id].forEach((element) => {
            if (element[0] !== 'Serial') {
              col_names.push(element[0]);
              inner_row.push('');
            }
          });

          console.log(col_names);
          // console.log("iiiiiiiiiiiinnnnnner ROW", inner_row);

          setTargeted_row_length(inner_row.length)
          setColumnNames(col_names);
          setInsert_row(inner_row);

        }
      })
      .catch(function (error) {
        // Alert.alert(error.response.data.msg);

      });
  };
  useEffect(() => {
    setApiWait(true);
    console.log(id);
    // ...................................To get Targeted Table Rows

    // .....................................To get table columns

    getMetaData();
    // setApiWait(false)

  }, [id, loading]);


  const [inputs, setInputs] = useState({});

  const handleChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log ("insert Rowwwwww: ", insert_row)
    let temp = insert_row;
    columnNames.forEach((element, index) => {
      name === element ? (temp[index] = `'${value}'`) : null;
    });
    console.log ("tempppppppppppp", temp )
    setInsert_row(temp);
    console.log(name, value);
  };

  const handleUpdateChange = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    console.log('columnNames:', columnNames);
    console.log('targeted_Row:', targeted_Row);
    let temp = targeted_Row;
    columnNames.forEach((element, index) => {
      element === name ? (temp[index + 1] = value) : null;
    });
    setTargeted_row(temp);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(!loading)
    console.log('table name: ', tableNames[id]);
    console.log('column names : ', columnNames);
    console.log('inserted row data  : ', insert_row);
    console.log (targeted_Row);
    let insertingData = {
      tableName: tableNames[id],
      columns: columnNames,
      values: insert_row,
    };
    console.log(insertingData);

    setModalShow(false);
    setApiWait(true);
    await axios
      .post(`http://localhost:8000/insertTable`, insertingData, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:8000',
          Accept: 'application/json',
        },
        withCredentials: true,
      })
      .then(function (response) {
        if (response.status === 200) {
          // Alert("Table created successfully")
          console.log('Row Inserted Successfully');
          NotificationManager.success('Record Inserted Successfully');
          setLoading(!loading);
        }
      })
      .catch(function (error) {
        NotificationManager.error(error.response.data.detail);
        console.log(error.response.data.detail)
        setLoading(!loading)
      });
  };
  const handleUpdateSubmit = async (event) => {
    event.preventDefault();
    console.log('table name: ', tableNames[id]);
    console.log('column names : ', columnNames);
    console.log('inserted row data  : ', insert_row);
    console.log('targeted_row:', targeted_Row);
    let newSetting = {};
    columnNames.forEach((element, index) => {
      newSetting[element] = `'${targeted_Row[index + 1]}'`;
    });
    let abc = {
      tableName: tableNames[id],
      set: newSetting,
      where: { Serial: targeted_Row[0] },
    };
    // targeted_Row ---->>>> [3, 'Murtaza hello', '25', '12']
    console.log(abc);
    // columnNames.forEach((e,i)=>{
    //   temp+={e:i}
    // })
    // console.log (temp)
    // let set_data = columnNames.map((element, index)=>{
    //   return {element:insert_row[index]}
    // })
    // console.log (set_data)
    // let insertingData = {
    //   "tableName": tableNames[id],
    //   "columns": columnNames,
    //   "values": insert_row,
    //   "where": {"Serial": targeted_Row[0]}
    // }
    // console.log (insertingData)

    setUpdateModalShow(false);
    setApiWait(true);
    await axios
      .post(
        `http://localhost:8000/updateTable`,
        {
          tableName: tableNames[id],
          set: newSetting,
          where: { Serial: targeted_Row[0] },
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
        if (response.status === 200) {
          // Alert("Table created successfully")
          console.log('Row Updated Successfully');
          NotificationManager.success('Record Updated Successfully');
          setLoading(!loading);
        }
      })
      .catch(function (error) {
        NotificationManager.error(error.response.data.detail);
        setLoading(!loading);
      });
  };

  function InsertData(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Insert data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <h4>Centered Modal</h4> */}

          <form onSubmit={handleSubmit}>
            {apiWait ? (
              <Spinner animation="border" />
            ) : (
              tablesData[id].map((element) => {
                if (element[0] === 'Serial') return null;
                // {console.log (element)}
                // return <input style={{display:'flex', margin:'1rem'}} placeholder={'Enter '+element[0]}/>
                return (
                  <>
                    <Form.Label
                      style={{ paddingTop: '1rem', marginBottom: '0' }}
                    >
                      <span style={{ fontWeight: 600 }}>{element[0]}</span>
                      {' ("' + element[1] + '")'}
                    </Form.Label>
                    {/* <Form.Control type="number" placeholder="check 1 2 3 ..."/> */}
                    <Form.Control
                      type={element[1] === 'INT' ? 'number' : element[1] === 'DATE' ? 'date': element[1] === 'TIMESTAMP'? 'datetime-local' : 'text'}
                      placeholder={'Enter ' + element[0]}
                      name={element[0]}
                      onChange={handleChange}
                    />
                  </>
                );
              })
            )}
            <Modal.Footer>
              <Button variant="secondary" onClick={props.onHide}>
                Close
              </Button>
              <Button variant="primary" type="submit">
                Insert
              </Button>
            </Modal.Footer>
          </form>
          {console.log(tablesData[id])}
        </Modal.Body>
      </Modal>
    );
  }
  function UpdateData(props) {
    return (
      <Modal
        {...props}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        {console.log(targeted_Row)}
        <Modal.Header closeButton>
          <Modal.Title id="contained-modal-title-vcenter">
            Update data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <h4>Centered Modal</h4> */}

          <form onSubmit={handleUpdateSubmit}>
            {apiWait ? (
              <Spinner animation="border" />
            ) : (
              tablesData[id].map((element, index) => {
                if (element[0] === 'Serial') return null;
                // {console.log (element)}
                // return <input style={{display:'flex', margin:'1rem'}} placeholder={'Enter '+element[0]}/>
                return (
                  <>
                    <Form.Label
                      style={{ paddingTop: '1rem', marginBottom: '0' }}
                    >
                      <span style={{ fontWeight: 600 }}>{element[0]}</span>
                      {' ("' + element[1] + '")'}
                    </Form.Label>
                    <Form.Control
                      type={element[1] === 'INT' ? 'number' : element[1] === 'DATE' ? 'date': element[1] === 'TIMESTAMP'? 'time' : 'text'}
                      placeholder={'Enter ' + element[0]}
                      name={element[0]}
                      defaultValue={targeted_Row[index]}
                      onChange={handleUpdateChange}
                    />
                  </>
                );
              })
            )}
            <Modal.Footer>
              <Button variant="secondary" onClick={props.onHide}>
                Close
              </Button>
              <Button
                variant="primary"
                className="btn btn-warning btn-block"
                type="submit"
              >
                Update
              </Button>
            </Modal.Footer>
          </form>
          {console.log(tablesData[id])}
        </Modal.Body>
      </Modal>
    );
  }
  const updateRow = (t_Row) => {
    setTargeted_row(t_Row);
    // console.log (tableNames[id], targeted_Row)

    // let Row_To_Delete = {
    //   "tableName": tableNames[id],
    //   "where": {"Serial": index}
    // }
    // axios.post(`http://localhost:8000/deleteTable`, Row_To_Delete,{
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Access-Control-Allow-Origin':'http://localhost:8000',
    //     Accept: 'application/json',
    //   },
    //   withCredentials: true,
    // })
    // .then(function (response) {
    //   if (response.status===200){
    //     // Alert("Table created successfully")
    //     console.log ("Row Deleted Successfully")
    //     setLoading(!loading)
    //   }
    // })
    // .catch(function(error){});
  };
  const deleteRow = async (index) => {
    setApiWait(true);
    console.log(tableNames[id], index);
    let Row_To_Delete = {
      tableName: tableNames[id],
      where: { Serial: index },
    };
    await axios
      .post(`http://localhost:8000/deleteTable`, Row_To_Delete, {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': 'http://localhost:8000',
          Accept: 'application/json',
        },
        withCredentials: true,
      })
      .then(function (response) {
        if (response.status === 200) {
          // Alert("Table created successfully")
          console.log('Row Deleted Successfully');
          NotificationManager.success('Record Deleted Successfully');
          setLoading(!loading);
        }
      })
      .catch(function (error) {
        NotificationManager.error(error.response.data.detail);
        setLoading(!loading)
      });
  };
  // })
  const handleSetRowSize = () => {
    console.log (targeted_row_length);
    let temp  = [] 
    for (i=0; i<targeted_row_length; i++){
      temp.push('')
    }
    setTargeted_row(temp);
  }

  const handleCSV = async () => {
    setLoadingCSVButton(true)
    await axios
    .post(
      // body: JSON.stringify({
        `http://localhost:8000/exportCSV`,
        {
          tableName:tableNames[id]
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
        console.log (response.data.metadata)
        setCsvData(response.data.metadata)
        setGenerateCSVFlag(true);
        NotificationManager.success("CSV Generated Successfully, Now you can Download.");

        // setCsvData(response.data.metadata)
        // done(true)
      // }else{
        // done(false);
      // }
      }
    })
    .catch(function (error) {
      // Alert.alert(error.response.data.msg);
      NotificationManager.error(error.response.data.detail);
    });

    setLoadingCSVButton(false)
  }
  return (
    <>
      <InsertData show={modalShow} onHide={() => {setModalShow(false); }} />
      <UpdateData
        show={updateModalShow}
        onHide={() => setUpdateModalShow(false)}
      />
      <div style={{ textAlign: 'center' }}>
        <h1>{tableNames[id]}</h1>
        <button
          className="btn btn-dark"
          style={{ position: 'absolute', right: '1rem', top: '1rem' }}
          onClick={() => {
            setModalShow(true);
            console.log('Insert data ');
          }}
          >
          Insert Data
        </button>
        {!generateCSVFlag?(<button
          className="btn btn-dark"
          onClick={()=>{
            handleCSV();
          }}
          style={{ position: 'absolute', right: '8rem', top: '1rem' }}
          >
          {LoadingCSVButton?("Generating..."):("Generate CSV")}
        </button>):
        (<CSVLink
        data={csvData}
        onClick={()=>{setGenerateCSVFlag(false)}}
        >
        <div
          className="btn btn-dark"
          style={{ position: 'absolute', right: '8rem', top: '1rem' }}
          >
          Download CSV
        </div>
          </CSVLink>)}
        {apiWait ? (
          <div style={{ padding: '3rem' }}>
            <Spinner animation="border" />
          </div>
        ) : (
          <Table
            striped
            bordered
            hover
            size="sm"
            style={{ borderColor: 'grey', backgroundColor:'#fff5' }}
          >
            <thead>
              <tr>
                <th>#</th>
                {tablesData[id].map((element) => {
                  return element[0] !== 'Serial' ? <th>{element[0]}</th> : null;
                })}
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {console.log(tableRows)}

              {tableRows.length !== 0 ? (
                tableRows.map((element, index) => {
                  return (
                    <tr>
                      <td style={{ fontWeight: 'bold' }}>
                        {index + 1}
                        {')'}
                      </td>
                      {element.map((e, i) => {
                        return i !== 0 ? <td>{e}</td> : null;
                      })}
                      <td>
                        <button
                          className="btn btn-primary"
                          style={{ margin: 2 }}
                          onClick={() => {
                            updateRow(element);
                            setUpdateModalShow(true);
                          }}
                        >
                          Edit
                        </button>
                        {/* to={`/users/edit/${element[0]}/${tableNames[id]}`} */}

                        <button
                          className="btn btn-danger"
                          onClick={() => {
                            deleteRow(element[0]);
                          }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <div
                  style={{
                    position: 'absolute',
                    width: '-webkit-fill-available',
                    fontSize: 32,
                    paddingTop: '4rem',
                  }}
                >
                  Empty Table
                </div>
              )}
            </tbody>
          </Table>
        )}
      </div>
      <NotificationContainer />
    </>
  );
}

export default Dashboard;
