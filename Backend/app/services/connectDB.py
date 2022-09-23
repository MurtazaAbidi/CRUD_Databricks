from sqlite3 import connect
from databricks import sql

def databricksConnection(req):
    try:
        connection = sql.connect(server_hostname = req["DATABRICKS_SERVER_HOSTNAME"],
                                http_path       = req["DATABRICKS_HTTP_PATH"],
                                access_token    = req["DATABRICKS_TOKEN"]
                            )
        
        print("DATABRICKS CONNECTED")
        return connection

    except Exception as err:
        raise ValueError (f"{err}") from None