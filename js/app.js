'use strict'

let DB

// Interfaz selectors
const form = document.querySelector('form')
const petName = document.querySelector('#pet')
const clientName = document.querySelector('#client')
const telefon = document.querySelector('#telefon')
const date = document.querySelector('#date')
const hour = document.querySelector('#hour')
const symptom = document.querySelector('#symptom')
const dating = document.querySelector('#dating')
const headingAdminister = document.querySelector('#administer')


// Wait for the DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  // Create data base
  let createDB = window.indexedDB.open('dating', 1)

  // If there is an error send it to the console
  createDB.onerror = function() {
    console.log('Hubo un error')
  }

  // If there is ok, show console and assign the database
  createDB.onsuccess = function() {
    console.log('Todo listo!!')
    
    // Assign the database
    DB = createDB.result
    console.log(DB)
  }

  // This method only run once
  createDB.onupgradeneeded = function(e) {
    // the event is the same data base
    let db = e.target.result

    // define object store
    // KeyPath is the index of data base
    let objectStore = db.createObjectStore('dating', { keyPath: 'key', autoIncrement: true })

    // Create index and data base fields
    objectStore.createIndex('pet', 'pet', { unique: false })
    objectStore.createIndex('client', 'client', { unique: false })
    objectStore.createIndex('telefon', 'telefon', { unique: false })
    objectStore.createIndex('date', 'date', { unique: false })
    objectStore.createIndex('hour', 'hour', { unique: false })
    objectStore.createIndex('symptom', 'symptom', { unique: false })
  }
})