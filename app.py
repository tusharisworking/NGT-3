from flask import Flask, jsonify
from flask import Flask,request
from flask_cors import CORS, cross_origin
import pandas as pd
from main import *
import numpy as np

app = Flask(__name__)
cors = CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})


app.config['CORS_HEADERS'] = 'Content-Type'
rows = []
column = []
value = ''


@app.route('/getColumns',methods=['POST'])
@cross_origin()
def get_columns():
    data = request.get_json()
    print(data)
    return data


@app.route('/',methods=['POST'])
@cross_origin()
def get_pt():
    global rows,column,value
    data = request.get_json()
    print(data)
    df = pd.read_excel("Pivot Practice.xlsx",sheet_name="Sheet5")
    if data['value']=='' and value=='':
        return {'columns': [],
        'data': [],
        'index': [],
        'rows': [],
        'allcolumns': df.columns.tolist()}
    if data['value']!='':
        rows = data['rows']
        column = data['column']
        value = data['value']
    pivot_table = pd.pivot_table(df, values=value, index=rows, columns=column, aggfunc='sum', fill_value=0, margins=True, margins_name='Total')
    # temp = pivot_table.to_dict(orient='split')
    # # temp = subtotals(temp,df,rows,column,value)
    # temp['rows'] = rows
    # temp['allcolumns'] = df.columns.tolist()
    temp = subtotals(pivot_table,df,rows,column,value)
    temp['data'] = [
        [int(cell) if isinstance(cell, (int, np.int64)) else cell for cell in row] for row in temp['data']
    ]
    return jsonify(temp)
    # return {'columns': [],
    #     'data': [],
    #     'index': [],
    #     'rows': [],
    #     'allcolumns': df.columns.tolist()}

if __name__ == '__main__':
    app.run(debug=True,port=8080)