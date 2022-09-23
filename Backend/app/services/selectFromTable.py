op={
"_eq": "=",
  "_between": "BETWEEN",
  "_notbetween": 'NOT BETWEEN',
  "_neq": "!=",
  "_lt": "<",
  "_lte": "<=",
  "_gt": ">",
  "_gte": ">=",
  "_in": "IN",
  "_like": 'like',
  "_notIn": '!=',
  "_and": "AND",
  "_or": "or",
}

def gen_string(x,y):
    if(list(x.keys())[0]=='_between' or list(x.keys())[0]=='_notbetween'):
        y=y+' '+op[list(x.keys())[0]]+' '+str(list(x.values())[0][0])+' AND '+str(list(x.values())[0][1])
    elif(list(x.keys())[0]=='_in' or list(x.keys())[0]=='_notIn'):
         y=y+' '+op[list(x.keys())[0]]+' '+str(list(x.values())[0])
         y=y.replace('[','(')
         y=y.replace(']',')')

    else:
        if(type(list(x.values())[0])==str):
            
            y=y+' '+op[list(x.keys())[0]]+' '+"'"+list(x.values())[0]+"'"
        else:
            y=y+' '+op[list(x.keys())[0]]+' '+list(x.values())[0]
    return y

def builder(a,b,nested=False,op=''):
    for i in a:
        if(i=='and' or i=='or'):
            b=b+' '+i+' '
            b=b+'('
            b=builder(a[i][0],b,nested=True,op=i)
            nested=False
            b=b[0:-3]
            b=b+')'
        else:
            if(nested==False):
                b=b+' '+i
                b=gen_string(a[i],b)
                
            else:
                b=b+' '+i
                b=gen_string(a[i],b)
                b=b+' '+op
    return b
        
def query_builder(temp):
    query='SELECT'
    a=temp['SELECT']
    
    if len(temp['SELECT'])==0:
        query=query+' '+'*'+' '
    else:
        for items in a:
            query=query+' '+items+' '
    
    
    query=query+'FROM '+str(', '.join(temp["From"]))+' WHERE'
    query=query.replace('[','')
    query=query.replace(']','')
    query=builder(temp["filters"],query)

    return query

def readTable(connection, req):
    try:
        string = query_builder(req)
        print(string)
        
        cursor = connection.cursor()
        cursor.execute(f"{string}")  
        result = cursor.fetchall()
        return result
    
    except Exception as err:
        raise ValueError (f"{err}") from None