def deleteWholeTable(connection, req):
    try:
        string = "DROP TABLE " + req["tableName"] 
        cursor = connection.cursor()
        cursor.execute(f"{string}")
    
    except Exception as err:
        raise ValueError (f"{err}") from None