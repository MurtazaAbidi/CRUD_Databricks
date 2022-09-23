import { checkTargetForNewValues, motion } from 'framer-motion';
import { FaHome } from 'react-icons/fa';
import { Link, NavLink } from 'react-router-dom';
import { FaBars, FaHome, FaLock, FaMoneyBill, FaUser } from 'react-icons/fa';
import { MdMessage } from 'react-icons/md';
import { BiAnalyse, BiSearch } from 'react-icons/bi';
import { BiCog } from 'react-icons/bi';
import { AiFillHeart, AiTwotoneFileExclamation } from 'react-icons/ai';
import { BsCartCheck } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import SidebarMenu from './SideBarMenu';
import Button from 'react-bootstrap/Button'
import { BiLogOut } from 'react-icons/bi'; 
// import logo from '../../assets/PJD.jpg'

import logo from '../../assets/PJD.jpg';
import axios from 'axios';
import { windowsStore } from 'process';
const Sidebar = ({ children }) => {
  const [serverName, setServerName]= useState('')
  const [route, setRoute] = useState([
    {
      id: 0,
      path: '/TableDetails',
      name: 'Table Details',
      icon: <MdMessage />,
    },
    {
      id: 1,
      path: '/file-manager',
      name: 'Tables',
      icon: <AiTwotoneFileExclamation />,
      subRoutes: [],
    },
    {
      id: 2,
      path: '/QueryBuilder',
      name: 'Query Builder',
      icon: <AiFillHeart />,
    },
  ]);
  console.log ("SubRoutes",route[1].subRoutes)
  const [isOpen, setIsOpen] = useState(false);
  const [tableNames, setTableNames] = useState([]);
  // const [isRouteChange, setIsRouteChange] = useState(false)
  const [tablesData, setTablesData] = useState([]);
  const [meta, setMeta]= useState()
  const [selected, setSelected] = useState(-1);
  const [selectedTable,SetSelectedTable] = useState();
  const [showSideBar, setShowSideBar] = useState(false);
  // const [subRoutes, setSubRoutes] = useState([]);
  // const [showDropDown, setShowDropDown] = useState(false);
  const getMetaData= async()=>{
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
            console.log (table)
            setServerName(table.server_name)
            setShowSideBar(true)
            let tableName = [] ;
          let tableData = [] 
        let temp = [] 
        i=0;
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
            i++;
            tableData.push(temp)
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
        let asdfasdf = tableNames.map((element, index) => {
          return { path: `/Dashboard/${index}`, name: element };
        });
        // setSubRoutes(asdfasdf);
        let routesdata = route;
        // setRoute([])
        routesdata.forEach((element)=>{
          if (element.id===1){
            element.subRoutes = asdfasdf;
            console.log (element)
          }
        })
        setRoute(routesdata)
        // setShowDropDown(true)
            }
        })
        .catch(function (error) {
          setShowSideBar(false)
        });
  }
  useEffect(()=>{
    getMetaData();
    // setShowDropDown(false)
  },[isOpen])
  // useEffect(()=>{
  //   getMetaData();
  // }, [])
  const toggle = () => setIsOpen(!isOpen);
  const inputAnimation = {
    hidden: {
      width: 0,
      padding: 0,
      transition: {
        duration: 0.2,
      },
    },
    show: {
      width: '140px',
      padding: '5px 15px',
      transition: {
        duration: 0.2,
      },
    },
  };

  const showAnimation = {
    hidden: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.5,
      },
    },
    show: {
      opacity: 1,
      width: 'auto',
      transition: {
        duration: 0.5,
      },
    },
  };
  const handleLogout = async () => {
    await axios
    .get(
          // body: JSON.stringify({
            `http://localhost:8000/logout`,
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
            console.log (response)
            window.location.reload(false);
        })
        .catch(function (error) {
        });
  }
  return (
    <>
      <div className="main-container">
    {showSideBar?
        (<motion.div
          animate={{
            width: isOpen ? '200px' : '45px',
            position:'fixed',

            transition: {
              duration: 0.5,
              type: 'spring',
              damping: 10,
            },
          }}
          className={`sidebar `}
        >
          <div className="top_section">
            <AnimatePresence>
              {isOpen && (
                <motion.h1
                  variants={showAnimation}
                  initial="hidden"
                  animate="show"
                  exit="hidden"
                  className="logo"
                  style={{ alignItems: 'center', justifyContent: 'center' }}
                >
                  <img
                    src={logo}
                    alt={''}
                    style={{ width: 40, height: 40, borderRadius: 20 }}
                    />
                  <div style={{ paddingLeft: 5, color:'white'}}>{serverName}</div>
                </motion.h1>
              )}
            </AnimatePresence>

            <div className="bars">
              <FaBars onClick={toggle} />
                    
            </div>
          </div>
          <section className="routes">
            {route.map((route, index) => {
              if (route.subRoutes) {
                return (
                  <SidebarMenu
                    setIsOpen={setIsOpen}
                    route={route}
                    showAnimation={showAnimation}
                    isOpen={isOpen}
                  />
                );
              }
              
              return (
                <NavLink
                to={route.path}
                key={index}
                className="link"
                  activeClassName="active"
                >
                  <div className="icon">{route.icon}</div>
                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        variants={showAnimation}
                        initial="hidden"
                        animate="show"
                        exit="hidden"
                        className="link_text"
                      >
                        {route.name}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </NavLink>
              );
            })}
          </section>
          <div style={{textAlign:'right', padding:'1rem', }}>
          {isOpen?
          (<Button
          onClick={()=>{
            handleLogout();
          }}
          variant="secondary"
          >
      <span style ={{paddingRight:'1rem'}}>
      <BiLogOut/>
      </span>
      Disconnect
    </Button>)
      :null}
      </div>
        </motion.div>)
        :null}

        <main style={{ flex: 1, position:'absolute', left:showSideBar?(isOpen?200:45):0, right:0}}>{children}</main>
      </div>
    </>
  );
};

export default Sidebar;
