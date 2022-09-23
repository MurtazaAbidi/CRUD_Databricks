list1 = []
totalList = []

def returnMetadata(connection):
    try:
        totalList.clear()
        cursor = connection.cursor()
        cursor.columns(schema_name="default")

        for data in cursor.fetchall(): # [{},{}]
            list1.append(data[2])
            list1.append(data[3])
            list1.append(data[5])
            totalList.append(list(list1))
            list1.clear()

        return totalList
        
    except Exception as err:
        raise ValueError (f"{err}") from None