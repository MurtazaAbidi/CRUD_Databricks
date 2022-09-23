def deleteTableData(connection, req):
    try:
        string = "DELETE FROM " + req["tableName"] + " WHERE "
        string = string + str(list(req["where"].keys())[0]) + " = " + str(list(req["where"].values())[0])

        cursor = connection.cursor()
        cursor.execute(f"{string}")
    
    except Exception as err:
        raise ValueError (f"{err}") from None