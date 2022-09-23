def update(connection, req):
        string = "UPDATE " + req["tableName"] + " SET "

        for key, value in req["set"].items():
            string = string + key
            string = string + " = " + value + ", "
        
        string = string.rstrip(string[-1])
        string = string.rstrip(string[-1])

        string = string + " WHERE " + str(list(req["where"].keys())[0]) + " = " + str(list(req["where"].values())[0])

        cursor = connection.cursor()
        cursor.execute(f"{string}")

def updateTableData(connection, req):
    try:
        checkPkReq = {}
        checkPkInTable = {}

        for key, value in req["set"].items():
            if key.find('__pk') != -1:  
                checkPkReq[key] = value
        
        if len(checkPkReq) == 0:
            update(connection, req)
        
        else:
            checkString = "SELECT * FROM " + req["tableName"] + " WHERE " + str(list(req["where"].keys())[0]) + " = " + str(list(req["where"].values())[0])

            cursor = connection.cursor()
            cursor.execute(f"{checkString}")
            result = cursor.fetchall()
            resultDict = result[0].asDict()

            for key, value in resultDict.items():
                if key.find('__pk') != -1: 
                    value = f"'{value}'"                    
                    checkPkInTable[key] = value

            if (checkPkReq == checkPkInTable):
                update(connection, req)
            
            else:
                raise Exception("You cannot change/update the Primary Key")
   
    except Exception as err:
        raise ValueError (f"{err}") from None