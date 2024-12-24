import { useState } from 'react'
import NepaliDatePicker from './components/NepaliDatePicker'
import './App.css'

function App() {
  const [inputValue, setInputValue] = useState('')

  return (
    <>
      <h1>React Nepali DateTime</h1>
      <div className="card">
        <form method="get">
          <div>Basic Nepali Date picker</div>
          <NepaliDatePicker name="date1" />
          <hr />
          <div>Nepali Date picker (locale=ne)</div>
          <NepaliDatePicker name="dateNe" locale="ne" />
          <hr />
          <div>Input onDateSelect, value: {inputValue}</div>
          <NepaliDatePicker
            value={inputValue}
            placeholder="Select a date"
            onDateSelect={value => setInputValue(value)}
            name="date2"
          />
          <hr />
          <div>Custom inputElement</div>
          <NepaliDatePicker
            value={inputValue}
            onDateSelect={value => setInputValue(value)}
            inputElement={
              <input
                name="date3"
                placeholder="Custom Input"
                style={{ height: 32, width: '100%' }}
              />
            }
          />
          <button type="submit">Submit</button>
        </form>
      </div>
    </>
  )
}

export default App
