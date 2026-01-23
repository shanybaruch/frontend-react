import React, { useState } from 'react';
import { DayPicker } from 'react-day-picker';
import { he } from 'date-fns/locale';

export function Calendar({ range, setRange, months = 2 }) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const farFuture = new Date()

  return (
    <div className="calendar">
      <DayPicker
        mode="range"
        selected={range}
        onSelect={setRange}
        numberOfMonths={months}
        disabled={{ before: today }}
        onDayClick={(day, modifiers) => {
          if (modifiers.disabled) return
        }}
        startMonth={today}
        formatters={{
          formatCaption: (date) =>
            date.toLocaleString('en-US', { month: 'long', year: 'numeric' }),
          formatWeekdayName: (date) =>
            date.toLocaleString('en-US', { weekday: 'narrow' }),
        }}
      />
    </div>
  )
}