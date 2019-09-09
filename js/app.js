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

    showDating()
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

  // When the form is sent
  form.addEventListener('submit', addData)

  function addData(e) {
    e.preventDefault()

    const newDate = {
      pet: petName.value,
      client: clientName.value,
      telefon: telefon.value,
      date: date.value,
      hour: hour.value,
      symptom: symptom.value
    }

    // In indexDB transactions are used
    let transaction = DB.transaction(['dating'], 'readwrite')
    let objectStore = transaction.objectStore('dating')
    
    let request = objectStore.add(newDate)

    request.onsuccess = () => {
      form.reset()
    }
    transaction.oncomplete = () => {
      console.log('Cita agregada')
      showDating()
    }
    transaction.onerror = () => {
      console.log('Hubo un error')
    }
  }

  function showDating() {
    // Clean previous dating
    while(dating.firstChild) {
      dating.removeChild(dating.firstChild)
    }

    // Create a objectStore
    let objectStore = DB.transaction('dating').objectStore('dating')

    // Return a request
    objectStore.openCursor().onsuccess = function(e) {
      // Cursor is going to be in the indicated register to access the data 
      let cursor = e.target.result

      if(cursor) {
        let  dateHTML = document.createElement('li')
        dateHTML.setAttribute('data-date-id', cursor.value.key)
        dateHTML.classList.add('list-group-item')
        dateHTML.innerHTML = `
        <p class="font-weight-bold"> Mascota: <span class="font-weight-normal">${cursor.value.pet}</span></p>
        <p class="font-weight-bold"> Client: <span class="font-weight-normal">${cursor.value.client}</span></p>
        <p class="font-weight-bold"> Telefon: <span class="font-weight-normal">${cursor.value.telefon}</span></p>
        <p class="font-weight-bold"> Date: <span class="font-weight-normal">${cursor.value.date}</span></p>
        <p class="font-weight-bold"> Hour: <span class="font-weight-normal">${cursor.value.hour}</span></p>
        <p class="font-weight-bold"> Symptom: <span class="font-weight-normal">${cursor.value.symptom}</span></p>
        `
        // Delete button
        const deleteButton = document.createElement('button')
        deleteButton.classList.add('delete', 'btn', 'btn-danger')
        deleteButton.innerHTML = '<span aria-hidden="true">x</span> Borrar'
        deleteButton.onclick = delateDate
        dateHTML.appendChild(deleteButton)

        // append to father
        dating.appendChild(dateHTML)
        
        // Check the next registers
        cursor.continue()

      } else {
        if(!dating.firstChild) {
          // When there are no registers
          headingAdminister.textContent = 'Agregar citas para comenzar'
          let list = document.createElement('p')
          list.classList.add('text-center')
          list.textContent = 'No hay registros'
          dating.appendChild(list)
        } else {
          headingAdminister.textContent = 'Administra tus citas'
        }
      }
    }
  }

  function delateDate(e) {
    let dateID = Number(e.target.parentElement.getAttribute('data-date-id'))
    
    // In indexDB transactions are used
    let transaction = DB.transaction(['dating'], 'readwrite')
    let objectStore = transaction.objectStore('dating')
    
    let request = objectStore.delete(dateID)

    transaction.oncomplete = () => {
      e.target.parentElement.parentElement.removeChild(e.target.parentElement)
      console.log(`Se elimino la cita con el ID: ${dateID}`)

      if(!dating.firstChild) {
        // When there are no registers
        headingAdminister.textContent = 'Agregar citas para comenzar'
        let list = document.createElement('p')
        list.classList.add('text-center')
        list.textContent = 'No hay registros'
        dating.appendChild(list)
      } else {
        headingAdminister.textContent = 'Administra tus citas'
      }
    }
  }

})