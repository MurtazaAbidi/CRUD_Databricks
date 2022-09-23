import json
from datetime import timedelta
from fastapi import HTTPException, status, Request
from services.metadata import returnMetadata
from services.createTable import createTable
from services.selectFromTable import readTable
from services.insertTable import insertIntoTable
from services.showdata import showTableData
from services.connectDB import databricksConnection
from services.updateTable import updateTableData
from services.deleteTable import deleteTableData
from services.delTableCom import deleteWholeTable
from services.queryBuilder import queryBuilderSQL
from services.truncate import truncateTable
from services.sendCSVData import csv
from middleware.auth import create_access_token, getCredentials
from asgiref.sync import sync_to_async

userCredentials = {}
ACCESS_TOKEN_EXPIRE_HOURS = 24

async def connectDataBricks(req : dict):
    try:
        with open("./details.json") as file:
            test_data = json.load(file)
        credentials={}
        for i in test_data:
            if(i["id"]==req.id):
                credentials=i
        # print(credentials)
        userCredentials["DATABRICKS_SERVER_HOSTNAME"] = credentials["DATABRICKS_SERVER_HOSTNAME"]
        userCredentials["DATABRICKS_HTTP_PATH"] = credentials["DATABRICKS_HTTP_PATH"]
        userCredentials["DATABRICKS_TOKEN"] = credentials["DATABRICKS_TOKEN"]
        connection = await sync_to_async(databricksConnection)(req = userCredentials)  

        access_token_expires = timedelta(hours=ACCESS_TOKEN_EXPIRE_HOURS)
        access_token = create_access_token({"id":req.id}, expires_delta=access_token_expires)
        
        return connection, access_token   

    except ValueError as err:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = f"Invalid Credentials: {err}"
        )

async def getmetadata(request: Request):
    try:
        cookie_Credentials: str = request.cookies.get("Credentials")
        payload = getCredentials(cookie_Credentials)
        connection = await sync_to_async(databricksConnection)(req = payload)
        metadata = await sync_to_async(returnMetadata)(connection = connection)
        # metadata = returnMetadata(connection)
        return metadata, payload['name']

    except ValueError as err:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = f"Error During fetching Metadata: {err}"
        )

async def createUserTable(req: dict, request: Request):
    try:
        cookie_Credentials: str = request.cookies.get("Credentials")
        print(cookie_Credentials)
        payload = getCredentials(cookie_Credentials)
        connection = await sync_to_async(databricksConnection)(req = payload) 
        await sync_to_async(createTable)(connection = connection, req = req)
        # createTable(connection, req)
        return "Table Created"

    except ValueError as err:
        print(err.args)
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = f"Error During Creating Table: {err.args}"
        )
    
async def insertUserTable(req: dict, request: Request):
    try:
        cookie_Credentials: str = request.cookies.get("Credentials")
        payload = getCredentials(cookie_Credentials)
        print(req)
        connection = await sync_to_async(databricksConnection)(req = payload) 
        await sync_to_async(insertIntoTable)(connection = connection, req = req)
        # insertIntoTable(connection, req)
        return "Insertion Completed"

    except ValueError as err:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = f"Error During Inserting into Table: {err.args}"
        )
    
async def showDataTest(req: dict, request: Request):
    try:
        cookie_Credentials: str = request.cookies.get("Credentials")
        payload = getCredentials(cookie_Credentials)
        connection = await sync_to_async(databricksConnection)(req = payload) 
        data = await sync_to_async(showTableData)(connection = connection, req = req)
        # data = showTableData(connection, req)       
        return data
    
    except ValueError as err:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = f"Error During Selection from Table: {err.args}"
        )

async def readUserTable(req: dict, request: Request):
    try:
        cookie_Credentials: str = request.cookies.get("Credentials")
        payload = getCredentials(cookie_Credentials)
        connection = await sync_to_async(databricksConnection)(req = payload) 
        results = await sync_to_async(readTable)(connection = connection, req = req)
        # results = readTable(connection, req)
        return results
    
    except ValueError as err:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = f"Error During Selection from Table: {err.args}"
        )

async def updateUserTable(req: dict, request: Request):
    try:
        cookie_Credentials: str = request.cookies.get("Credentials")
        payload = getCredentials(cookie_Credentials)
        connection = await sync_to_async(databricksConnection)(req = payload)
        await sync_to_async(updateTableData)(connection = connection, req = req)
        # updateTableData(connection, req)
        return "Updation Completed"

    except ValueError as err:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = f"Error During Updating: {err.args}"
        )

async def deleteUserTable(req: dict, request: Request):
    try:
        cookie_Credentials: str = request.cookies.get("Credentials")
        payload = getCredentials(cookie_Credentials)
        connection = await sync_to_async(databricksConnection)(req = payload)
        await sync_to_async(deleteTableData)(connection = connection, req = req)
        # deleteTableData(connection, req)       
        return "Deletion Completed"
    
    except ValueError as err:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = f"Error During Deletion from Table: {err.args}"
        )

async def queryBuilderController(req: dict, request: Request):
    try:
        cookie_Credentials: str = request.cookies.get("Credentials")
        payload = getCredentials(cookie_Credentials)
        connection = await sync_to_async(databricksConnection)(req = payload) 
        results = await sync_to_async(queryBuilderSQL)(connection = connection, req = req)
        # results = queryBuilderSQL(connection, req)
        return results
    
    except ValueError as err:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = f"Error During Selection from Table: {err.args}"
        )

async def deleteCompleteTable(req: dict, request: Request):
    try:
        cookie_Credentials: str = request.cookies.get("Credentials")
        payload = getCredentials(cookie_Credentials)
        connection = await sync_to_async(databricksConnection)(req = payload) 
        await sync_to_async(deleteWholeTable)(connection = connection, req = req)
        # results = queryBuilderSQL(connection, req)
        return "Table Deletion Completed"

    except ValueError as err:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = f"Error During Table Deletion: {err.args}"
        )   

async def truncateTableData(req: dict, request: Request):
    try:
        cookie_Credentials: str = request.cookies.get("Credentials")
        payload = getCredentials(cookie_Credentials)
        connection = await sync_to_async(databricksConnection)(req = payload) 
        await sync_to_async(truncateTable)(connection = connection, req = req)
        # results = queryBuilderSQL(connection, req)
        return "Table Truncation Completed"

    except ValueError as err:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = f"Error During Table Deletion: {err.args}"
        )   

async def exportCSV(req: dict, request: Request):
    try:
        cookie_Credentials: str = request.cookies.get("Credentials")
        payload = getCredentials(cookie_Credentials)
        connection = await sync_to_async(databricksConnection)(req = payload) 
        results = await sync_to_async(csv)(connection = connection, req = req)
        # results = queryBuilderSQL(connection, req)
        return results
    
    except ValueError as err:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail = f"Error During Sending CSV Data: {err.args}"
        )