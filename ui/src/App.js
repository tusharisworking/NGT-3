import logo from './logo.svg';
import './App.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [updateParams, setUpdateParams] = useState({
    columns: [],
    data: [],
    index: [],
    rows: [],
    allcolumns: [],
    i: -1,
    j: -1,
    val: 0,
  });
  const [attributes, setAttributes] = useState({ rows: [], column: [], value: '' });
  const [showForm, SetShowForm] = useState(false);
  useEffect(() => {
    fetchData();
  }, [attributes]);
  const fetchData = async () => {
    try {
      const response = await axios.post('http://127.0.0.1:8080', attributes);
      // setPivotTable(response.data);
      // console.log(response.data);
      // alert(response.data);
      setUpdateParams({
        ...updateParams,
        columns: response.data.columns,
        rows: response.data.rows,
        data: response.data.data,
        index: response.data.index,
        allcolumns: response.data.allcolumns,

      });
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdateData = async () => {
    try {
      await axios.post('http://127.0.0.1:8080/updateData', updateParams);
      // Refresh data after updating
      fetchData();
      // Reset updateParams to default values
      setUpdateParams({ columns: [], data: [], index: [], rows: [], i: -1, j: -1, val: 0 });
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  const handleAttributeGroupChange = (group, value) => {
    const tempAttributes = attributes;
    if (group === 'value') {
      tempAttributes[group] = value;
    }
    else {
      tempAttributes[group].push(value);
    }
    setAttributes(tempAttributes);
    console.log(attributes);
  }
  const handleShowForm = ()=>{
    SetShowForm(!showForm);
  }
  return (
    <div className="App">
      <h1>Forecasting App</h1>
      {showForm && <button className='btn btn-danger' onClick={handleShowForm}>Collapse</button>}
      {!showForm && <button className='btn btn-info' onClick={handleShowForm}>Set Attributes</button>}
      {
        showForm &&
        <form>
          {updateParams.allcolumns.map((attribute) => (
            <div key={attribute}>
              <label>
                {attribute}:
                <select onChange={(e) => handleAttributeGroupChange(e.target.value, attribute)}>
                  <option value="">None</option>
                  <option value="rows">Row</option>
                  <option value="column">Column</option>
                  <option value="value">Value</option>
                </select>
              </label>
            </div>
          ))}
          <button className='btn btn-primary' onClick={fetchData}>Fetch</button>
        </form>
      }

      <div>
        <table>
          <thead>
            <tr>
              {updateParams.rows.map((val, index) => (
                <th key={index}>{val}</th>
              ))}
              {updateParams.columns.map((year, index) => (
                <th key={index}>{year}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {updateParams.index.map((rowData, rowIndex) => (
              <tr key={rowIndex}>
                {rowData.map((value, colIndex) => (
                  <td key={colIndex}>{value}</td>
                ))}
                {updateParams.data[rowIndex].map((cellValue, colIndex) => (
                  <td key={colIndex}>{cellValue}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div>
        <h2>Update Data</h2>
        <label>
          i:
          <input
            type="number"
            value={updateParams.i}
            onChange={(e) => setUpdateParams({ ...updateParams, i: parseInt(e.target.value) })}
          />
        </label>
        <label>
          j:
          <input
            type="number"
            value={updateParams.j}
            onChange={(e) => setUpdateParams({ ...updateParams, j: parseInt(e.target.value) })}
          />
        </label>
        <label>
          val:
          <input
            type="number"
            value={updateParams.val}
            onChange={(e) => setUpdateParams({ ...updateParams, val: parseInt(e.target.value) })}
          />
        </label>
        <button onClick={handleUpdateData}>Update Data</button>
      </div>
    </div>
  );
}

export default App;
