def showTableData(connection, req):
    try:
        print(req["tableName"])
        string = "SELECT * FROM "
        string = string + req["tableName"] + " LIMIT 100"
        # string = string + req["tableName"]
        print(string)
        cursor = connection.cursor()
        cursor.execute(f"{string}")  
        result = cursor.fetchall()
        print(result)
        return result

    except Exception as err:
        raise ValueError (f"{err}") from None