import axios from 'axios';
import React, { useEffect, useState } from 'react';
import React, {Component} from 'react';
import {Query, Builder, BasicConfig, Utils as QbUtils} from 'react-awesome-query-builder';
import AntdConfig from 'react-awesome-query-builder/lib/config/antd';
import 'antd/dist/antd.css';

import MaterialConfig from 'react-awesome-query-builder/lib/config/material';
import MuiConfig from 'react-awesome-query-builder/lib/config/mui';
// For Bootstrap widgets only:
import BootstrapConfig from "react-awesome-query-builder/lib/config/bootstrap";
import {
  NotificationContainer,
  NotificationManager,
} from 'react-notifications';
import 'react-notifications/lib/notifications.css';


import 'react-awesome-query-builder/lib/css/styles.css';
import 'react-awesome-query-builder/lib/css/compact_styles.css'; 
import { MdHelpOutline } from 'react-icons/md';

import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { Spinner } from 'react-bootstrap';


function UpdateModal(props) {
  // const {}
  const {targetedRow, columns, tableName, dataType } = props;
  const [inserted_row, setInserted_row] = useState([])
  useEffect(()=>{
    // console.log ("targetedRow", targetedRow)
    
    targetedRow.forEach((element, index) => {
      if (index===0) return ;
      inserted_row.push(element)
    });
  })
  
  const apiCallForUpdate = async () => {
    let newObj = {};
    // console.log (columns)
    inserted_row.forEach((element, index)=>{
      if (index<columns.length-1)
      newObj[columns[index]] = `'${element}'`;
    })
    // console.log (newObj)
    console.log({
      tableName: tableName,
      set: newObj,
      where: { Serial: targetedRow[0]}
    })
    props.onHide();
    props.setloading();
    await axios
      .post(
        `http://localhost:8000/updateTable`,
        {
          tableName: tableName,
          set: newObj,
          where: { Serial: targetedRow[0]}
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
          props.refreshTable();
          // setLoading(!loading);
        }
      })
      .catch(function (error) {
        NotificationManager.error(error.response.data.detail);
        props.refreshTable();
        // setLoading(!loading);
      });
  }

  const handleUpdateSubmit =(event) => {
    event.preventDefault();
    apiCallForUpdate();



  }

  const handleUpdateChange =(e)=>{
    let targetindex = e.target.name
    // console.log (e.target.name)
    // //console.log (e.target.value)
    // console.log ("inserted_row",inserted_row)
    let changeArr = inserted_row;
    // console.log(e)
    for (let i = 0; i<inserted_row.length; i++){
      if (targetindex==i){
        changeArr[i] = e.target.value
      }
      //console.log (i, targetindex)
      // console.log (i, inserted_row[i])
      // if (i.toString()===e.targed.name)
    }
    //console.log (changeArr)
    setInserted_row(changeArr)
    
  }

  return (
    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Update Data
        </Modal.Title>
      </Modal.Header>
        <form onSubmit={handleUpdateSubmit}>
      <Modal.Body>
          {columns.map((element, index)=>{
            if (element==='Action') return <></>
            return (<>
              <Form.Label
                            style={{ paddingTop: '1rem', marginBottom: '0' }}
                            >
                            {element}{' ("' + dataType[index+1][1] + '")'}
                          </Form.Label>
                          <Form.Control
                            type={dataType[index+1][1] === 'INT' ? 'number' : dataType[index+1][1] === 'DATE' ? 'date': dataType[index+1][1] === 'TIMESTAMP'? 'datetime-local' : 'text'}
                            placeholder={'Enter '+element}
                            key={index}
                            name={index}
                            defaultValue={targetedRow[index+1]}
                            onChange={handleUpdateChange}
                            />
                            </>
            )
          })}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      <Button
                variant="primary"
                className="btn btn-warning btn-block"
                type="submit"
              >
                Update
              </Button>
      </Modal.Footer>
        </form>
    </Modal>
  );
}

// Choose your skin (ant/material/vanilla):
const InitialConfig = AntdConfig; // or MaterialConfig or MuiConfig or BootstrapConfig or BasicConfig
delete InitialConfig.operators.proximity;
// You need to provide your own config. See below 'Config format'
const config = {
  ...InitialConfig,
  fields: {}
};

const queryValue = {"id": QbUtils.uuid(), "type": "group"};

class QueryBuilder extends Component {
  // this.state.tableNames.length
  constructor(props){
    // console.log(config);
    super(props);
    this.state = {
      tree: QbUtils.checkTree(QbUtils.loadTree(queryValue), config),
      config: config,
      tableNames:[],
      tablesData:[],
      selected:-1,
      selectedTable:"",
      where:"",
      responseColumns:[],
      responseRows:[],
      loading:true, 
      modalShow:false,
      targetedUpdateRow:[],
      showSpinner:false

    };
  }



  

  componentDidMount=async()=> {
    let tableName=[]
    let tableData=[]
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
        let table = JSON.parse(response.data[0]);
        // let tableName = [] ;
        // let tableData = [] 
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
            //console.log(i,temp)
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
        // console.log ("tableData",tableData)
        // console.log ("tableName",tableName)
        // console.log (this.state.selected)
        // this.setState({
        //     tableNames :['tableName','hello'],
        // })
        // console.log ("tableNames :", this.state.tableNames)
        // console.log ("tablesData: ", this.state.tablesData)
        
        
      }
    })
    .catch(function (error) {
      // Alert.alert(error.response.data.msg);
      //console.log (error)
    });

    this.setState({tableNames:tableName,
    tablesData:tableData})
    // console.log ("hahahahatableName:",tableName)
    // console.log ("hahahahtableData", tableData)
  }

  handleSelect =(element) =>{
    let id= element.target.value
    if (element.target.value!==-1){
      this.setState({selected:id})
      // setSelected(element.target.value);
  
    }
    // console.log(this.state.selected);
    let temp = this.state.tablesData[id];
    //console.log (this.state.tablesData[id])
    let koonfig={}
    temp.forEach((element, index)=>{
      if (element[0]!=='Serial'){
        koonfig[element[0]]={
          label:element[0],
          type: this.checkType(element[1])
        }
      }
    })
    let finalConfig = {...InitialConfig, fields:koonfig};
    // console.log (finalConfig)
    // console.log (config)
    this.setState({
      config:finalConfig
    })
    //console.log (finalConfig)
    
    // console.log ({...InitialConfig,koonfig})
  
  }

  checkType = (col_type) =>{
    return (col_type === 'INT' ? 'number' : col_type === 'DATE' ? 'date': col_type === 'TIMESTAMP'? 'datetime' : 'text')
  }

  handleExecute= async ({tree: immutableTree, config})=>{
    if (JSON.stringify(QbUtils.sqlFormat(immutableTree, config))===undefined){
      NotificationManager.error("Empty Query");
      return;
    }
    this.setState({showSpinner:true})
    console.log ('executed')
    // this.setState({where:JSON.stringify(QbUtils.sqlFormat(immutableTree, config))})
    //console.log (this.state.tableNames[this.state.selected])
    //console.log (JSON.stringify(QbUtils.sqlFormat(immutableTree, config)))
    let flag=true
    this.setState({loading:flag})
    let columns= []
    let rows = []
    await axios
    .post(
      // body: JSON.stringify({
        `http://localhost:8000/query`,
        {
          tableName:this.state.tableNames[this.state.selected],
          where:JSON.stringify(QbUtils.sqlFormat(immutableTree, config))
        },
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
          

      if (response.status === 200){
        // console.log (response.data)
        // console.log ("data:",JSON.stringify(response.data)[0])
        // console.log ('data',JSON.parse(response.data[0]))
        console.log (response.data)
        let col = response.data.metadata;
        // console.log (col)
        col.forEach((element, index)=>{
        if (element[0]!=='Serial'){
          columns.push(element[0])
        }
        })
        columns.push ("Action")
        // console.log ("columns= ", columns)
        rows = response.data.result;
        
        console.log (rows)
        
        

        // console.log ()
        // console.log ("result",JSON.stringify(response.data)[0].result)
        // let temp1 = {"metadata": [["Serial"], ["employee_id"], ["employee_name"],["employee_job"]],
        // "result": [[1,1,"Murtaza Abidi","Full Stack Developer"],
        //           [2,2,"Haris Aqeel", "Full Stack Developer"]]}
        
        // columns = temp1.metadata;
        // rows = temp1.result;

        //console.log ("columns: ",columns)
        //console.log ("rows: ", rows)
        

        flag=false
        NotificationManager.success("Successfull");
      }
    })
    .catch(function (error) {
      NotificationManager.error(error.response.data.detail);
    });
    this.setState({loading:flag, responseColumns:columns, responseRows:rows, showSpinner:false})
  }

  deleteRow = async (id)=>{
    //console.log (this.state.tableNames[this.state.selected], id)
    axios.post(`http://localhost:8000/deleteTable`, {
      "tableName": this.state.tableNames[this.state.selected],
  "where": {"Serial": id}
    },{
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin':'http://localhost:8000',
        Accept: 'application/json',
      },
      withCredentials: true,
    })
    .then(function (response) {
      if (response.status===200){
        // Alert("Table created successfully")
        console.log ("Row Deleted Successfully")
        
      }
    })
    .catch(function(error){});
    this.handleExecute(this.handleExecute(this.state))
  }
  render = () => (
    <div>
      <div className="title">Query Builder</div>
      <select name="table" id="table" onChange={this.handleSelect} autofocus>
        <option disabled selected value="">Select Table</option>
        {this.state.tableNames.map((element,index)=>{
          return <option key={index+1} value={index} >{element}</option>
        })}

        </select>
        {/* {console.log (this.state.tableNames[this.state.selected])}
      {console.log (this.state.tableNames)} */}
{/* <Heloo/> */}
        <Query
        {...this.state.config} 
        value={this.state.tree}
        onChange={this.onChange}
        renderBuilder={this.renderBuilder}
        />
        {this.renderResult(this.state)}
        {this.state.selected!==-1?(
          <div style={{ textAlign:'center', padding:5}}>
          <button className="btn btn-primary" onClick={()=>this.handleExecute(this.state)}>Execute</button>
          </div>
          ):(null)
        }
        {this.state.loading?(<div style={{textAlign:'center', padding:20}}>{this.state.showSpinner?<Spinner animation="border" />:null}</div>):(
          
          <div style={{textAlign:'center', padding:20}}>

        <Table striped bordered hover size="sm" style={{ borderColor: 'grey' }}>
        <thead>
          <tr>

            {this.state.responseColumns.length!==0?<th>#</th>:null}
            {/* {console.log (this.state.columns)} */}
            {this.state.responseColumns.map((element, index)=>{
              return <th>{element}</th>
            })}

          </tr>
        </thead>
        <tbody>
                {this.state.responseRows.map((element, index)=>{
                  return (<tr>
                {element.map((e,i)=>{
                  return <td>{e}</td>
                })}
                <td>
                <button className="btn btn-primary" style={{margin:2}} onClick={() => {
                  this.setState({targetedUpdateRow:element,modalShow:true})                  
                  }}>Edit</button>
                  <button className="btn btn-danger" onClick={()=>{this.deleteRow(element[0])}}>Delete</button>
                </td>
                {/* <td style={{fontWeight:'bold'}}>1{')'}</td>
                {element.map((e,i)=>{
                  <td>element</td>
                })} */}

              </tr>)
                })}
{/* <td>Murtaza</td> */}
{/* <td>Abidi</td> */}
                {/* {console.log (this.state.where)} */}
                      
        </tbody>
      </Table>
      </div>

        )}
        <UpdateModal
        show={this.state.modalShow}
        onHide={() => {this.setState({modalShow:false})}}
        setloading={()=>{this.setState({loading:true, showSpinner:true})}}
        targetedRow = {this.state.targetedUpdateRow}
        columns = {this.state.responseColumns}
        tableName= {this.state.tableNames[this.state.selected]}
        dataType = {this.state.tablesData[this.state.selected]}
        refreshTable = {()=>{this.handleExecute(this.state)}}
      />
      <NotificationContainer />
        </div>
    )
    
    renderBuilder = (props) => (
      <div className="query-builder-container" style={{padding: '10px'}}>
        <div className="query-builder qb-lite">
            <Builder {...props} />
        </div>
      </div>
    )
    
    renderResult = ({tree: immutableTree, config}) => (
      <div className="query-builder-result">
          {/* <div>Query string: <pre>{JSON.stringify(QbUtils.queryString(immutableTree, config))}</pre></div>
          <div>MongoDb query: <pre>{JSON.stringify(QbUtils.mongodbFormat(immutableTree, config))}</pre></div>
          <div>JsonLogic: <pre>{JSON.stringify(QbUtils.jsonLogicFormat(immutableTree, config))}</pre></div> */}
          <div>SQL where: <pre>{JSON.stringify(QbUtils.sqlFormat(immutableTree, config))}</pre></div>
          {/* {this.setState({where:JSON.stringify(QbUtils.sqlFormat(immutableTree, config))})} */}
      </div>
    )
    
    onChange = (immutableTree, config) => {
      // Tip: for better performance you can apply `throttle` - see `examples/demo`
      this.setState({tree: immutableTree, config: config});
      
      const jsonTree = QbUtils.getTree(immutableTree);
      console.log(jsonTree);
      // `jsonTree` can be saved to backend, and later loaded to `queryValue`
    }
}
    export default QueryBuilder;