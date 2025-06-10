import React, { useState } from 'react'
import NepaliDatePicker from '../src/components/NepaliDatePicker/NepaliDatePicker'
import './App.css'

function App() {
  const [dates, setDates] = useState({
    Date1: '',
    Date2: '',
    Date3: '',
    Date4: ''
  })

  const [submittedDates, setSubmittedDates] = useState({
    Date1: '',
    Date2: '',
    Date3: '',
    Date4: ''
  })

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmittedDates({ ...dates })
  }

  const handleDateSelect = (name: keyof typeof dates, value: string) => {
    setDates(prev => ({ ...prev, [name]: value }))
  }

  return (
    <>
      <h1>React Nepali DateTime</h1>
      <div className="card">
        <form method="get" onSubmit={handleSubmit}>
          <div>Basic Nepali Date picker</div>
          <NepaliDatePicker
            name="date1"
            value={dates.Date1}
            onDateSelect={value => handleDateSelect('Date1', value)}
          />

          <div>Nepali Date picker (locale=ne)</div>
          <NepaliDatePicker
            name="dateNe"
            locale="ne"
            value={dates.Date2}
            onDateSelect={value => handleDateSelect('Date2', value)}
          />

          <div>Input onDateSelect, value: {dates.Date3}</div>
          <NepaliDatePicker
            name="date2"
            value={dates.Date3}
            onDateSelect={value => handleDateSelect('Date3', value)}
            placeholder="Select a date"
          />

          <div>Custom inputElement</div>
          <NepaliDatePicker
            name="date3"
            value={dates.Date4}
            onDateSelect={value => handleDateSelect('Date4', value)}
            inputElement={<input placeholder="Custom Input" className="custom-date-input" />}
          />

          <button type="submit">Submit</button>
        </form>

        <div>
          {Object.values(submittedDates).some(value => value !== '') && (
            <div>
              <h2>Submitted Dates</h2>
              {Object.entries(submittedDates)
                .filter(([_, value]) => value !== '')
                .map(([key, value]) => (
                  <div key={key}>
                    {key}: {value || 'Not selected'}
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default App
