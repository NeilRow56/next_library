import React from 'react'

const locations = [
  {
    id: 1,
    name: 'Venus library',
    address: '3344 venus rd',
    hours: '10:00 am to 9:00 pm',
    contact: '234-232-0099'
  },
  {
    id: 2,
    name: 'Mars library',
    address: '23 mars rd',
    hours: '09:00 am to 9:00 pm',
    contact: '675-232-0099'
  },
  {
    id: 3,
    name: 'Uranus library',
    address: '69 uranus ave.',
    hours: '10:00 am to 9:00 pm',
    contact: '234-232-1233'
  },
  {
    id: 4,
    name: 'Pluto library',
    address: '3 pluto circ.',
    hours: '10:00 am to 9:00 pm',
    contact: '444-232-0099'
  }
]

function Locations() {
  return (
    <div className='mx-auto max-w-7xl flex-col space-y-8 p-4 pt-16 sm:space-x-4'>
      <p className='text-2xl sm:text-4xl'>Locations</p>
      {locations.map(location => (
        <div key={location.id}>
          <div className='flex w-full flex-col space-y-2 rounded-md border p-4'>
            <div>
              <p className='text-lg font-bold sm:text-2xl'>{location.name}</p>
              <p className='text-slate-500'>{location.address}</p>
            </div>
            <p>Hours: {location.hours}</p>
            <p>Contact: {location.contact}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Locations
