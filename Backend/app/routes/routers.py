import json
from fastapi import APIRouter, Request, Response
from fastapi.responses import StreamingResponse
import io
import pandas
from schemas.dbConnectionSchema import DBConnection
from schemas.readTableSchema import readTableRequest
from schemas.createTableSchema import createTableRequest
from schemas.deleteTableSchema import deleteTableRequest
from schemas.updateTableSchema import updateTableRequest
from schemas.insertTableSchema import insertTableRequest
from schemas.testDataSchema import testDataRequest
from schemas.querySchema import queryRequest
from controller.controller import exportCSV, truncateTableData, deleteCompleteTable, queryBuilderController, showDataTest, connectDataBricks, getmetadata, createUserTable, readUserTable, updateUserTable, deleteUserTable, insertUserTable

router = APIRouter()

@router.get('/connection')
async def connection():
    with open("./details.json") as file:
        test_data = json.load(file)
    
    result=[]
    
    for i in test_data:
        result.append({"id":i["id"], "name":i["name"]})
    
    return (result)

@router.post('/connectDB')
async def connectDB(req: DBConnection, res: Response):
    content, access_token = await connectDataBricks(req)   
    res.set_cookie('Credentials', value = access_token, httponly = True)    
    return {f'{content}'}

@router.get('/metadata')
async def metadata(request: Request):
    content, server_name = await getmetadata(request)
    temp = {"metaData" : content, "server_name": server_name}
    print(temp)
    return {json.dumps(temp)}

@router.post('/createTable')
async def createTable(req: createTableRequest, request: Request):
    content = await createUserTable(req, request)
    return {f'{content}'}

@router.post('/insertTable')
async def insertTable(req: insertTableRequest, request: Request):
    content = await insertUserTable(req, request)
    return {f'{content}'}

@router.post('/showData')
async def showData(req: testDataRequest, request: Request):
    content = await showDataTest(req, request)
    temp = {"Data" : content}
    return temp

@router.post('/readTable')
async def readTable(req: readTableRequest, request: Request):
    content = await readUserTable(req, request)
    return {f'{content}'}

@router.post('/updateTable')
async def updateTable(req: updateTableRequest, request: Request):
    content = await updateUserTable(req, request)
    return {f'{content}'}

@router.post('/deleteTable')
async def deleteTable(req: deleteTableRequest, request: Request):
    content = await deleteUserTable(req, request)
    return {f'{content}'}

@router.post('/deleteWholeTable')
async def deleteWholeTable(req: testDataRequest, request: Request):
    content = await deleteCompleteTable(req, request)
    return {f'{content}'}

@router.post('/truncateTable')
async def truncateTable(req: testDataRequest, request: Request):
    content = await truncateTableData(req, request)
    return {f'{content}'}

@router.post('/query')
async def query(req: queryRequest, request: Request):
    content = await queryBuilderController(req, request)
    return content

@router.post('/exportCSV')
async def csv(req: testDataRequest, request: Request):
    content = await exportCSV(req, request)
    return content


@router.get('/logout')
def query(res:Response):
    res.delete_cookie('Credentials')
    print (res)
    # return res.status_code(200)