def insert(connection, req):
    string = "INSERT INTO "
    string = string + req["tableName"] + " ("

    for value in req["columns"]:
        string = string + value + ", "

    string = string.rstrip(string[-1])
    string = string.rstrip(string[-1])
    string = string + ") VALUES ("

    for value in req["values"]:
        string = string + value + ", "

    string = string.rstrip(string[-1])
    string = string.rstrip(string[-1])
    string = string + ")"
    print(string)
    cursor = connection.cursor()
    cursor.execute(f"{string}")
    return    

def insertIntoTable(connection, req):
    try:
        repeatCol = []
        repeatVal = []

        for column, value in zip(req["columns"], req["values"]):
            if column.find('__pk') != -1: 
                repeatCol.append(column)
                repeatVal.append(value)     

        if len(repeatCol) == 0:
            insert(connection, req)

        else:
            checkString = "SELECT * FROM " + req["tableName"] + " WHERE "
            for col, val in zip(repeatCol, repeatVal):
                checkString = checkString + col + " = " + val + " AND "

            checkString = checkString[:-4]
            print(checkString)
            cursor = connection.cursor()
            cursor.execute(f"{checkString}")
            result = cursor.fetchall()
            
            if (len(result) == 0):
                insert(connection, req)
            
            else:
                raise Exception("Record Already Exists, No Duplicate Records Allowed")
            
    except Exception as err:
        raise ValueError (f"{err}") from None