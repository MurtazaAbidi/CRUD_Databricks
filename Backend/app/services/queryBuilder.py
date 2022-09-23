queryResult = {}
list1 = []
totalList = []

def queryBuilderSQL(connection, req):
    try:
        totalList.clear()
        cursor = connection.cursor()
        cursor.columns(schema_name="default", table_name=req["tableName"])

        for data in cursor.fetchall():
            list1.append(data[3])
            totalList.append(list(list1))
            list1.clear()

        queryResult["metadata"] = totalList


        string = "SELECT * FROM "
        string = string + req["tableName"] + " WHERE " 
        
        string2 = req["where"] 
        string2 = string2[1:-1]
        string = string + string2 
        print(string)
        cursor.execute(f"{string}") 
        
        queryResult["result"] = cursor.fetchall()
        
        return queryResult

    except Exception as err:
        raise ValueError (f"{err}") from None