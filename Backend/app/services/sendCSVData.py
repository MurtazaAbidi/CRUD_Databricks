queryResult = {}
list1 = []
totalList = []

def csv(connection, req):
    try:
        totalList.clear()
        list1.clear()
        
        cursor = connection.cursor()
        cursor.columns(schema_name="default", table_name=req["tableName"])

        for data in cursor.fetchall():
            list1.append(data[3])
        totalList.append(list1)

        string = "SELECT * FROM " + req["tableName"]
        cursor.execute(f"{string}")

        for data in cursor.fetchall():
            totalList.append(data)
         
        queryResult["metadata"] = totalList
        return queryResult

    except Exception as err:
        raise ValueError (f"{err}") from None