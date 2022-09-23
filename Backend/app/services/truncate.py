def truncateTable(connection ,req):
    try:
        string = "TRUNCATE TABLE " + req["tableName"] 
        cursor = connection.cursor()
        cursor.execute(f"{string}")
    
    except Exception as err:
        raise ValueError (f"{err}") from None