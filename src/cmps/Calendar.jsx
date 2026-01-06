import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { he } from 'date-fns/locale'; 

export function Calendar()  {
  const [range, setRange] = useState()

  return (
    <div className="calendar">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={2}
        showOutsideDays  
        formatters={{
          formatCaption: (date) => 
            date.toLocaleString('en-US', { month: 'long', year: 'numeric' })
        }}
      />
    </div>
  )
}
