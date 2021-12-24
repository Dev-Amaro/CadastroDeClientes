'use strict'

const openModal = () => document.getElementById('modal')
    .classList.add('active')

const closeModal = () => {
    clearFields()
    document.getElementById('modal').classList.remove('active')  
}


const getLocaStorage = () => JSON.parse(localStorage.getItem('db_client')) ?? []
const setLocaStorage = (db_client) => localStorage.setItem("db_client", JSON.stringify(db_client))

const Delete = (index) => {
    const db_client = readClient()
    db_client.splice(index,1)
    setLocaStorage(db_client)
}

const updateClient = (index, client) => {
    const db_client = readClient()
    db_client[index] = client
    setLocaStorage(db_client)
}

const readClient = () => getLocaStorage()

const createClient = (client) => {
    const db_client = getLocaStorage()
    db_client.push (client)
    setLocaStorage(db_client)
    
}

const isValidFields = () => {
    return document.getElementById('form').reportValidity()
}

const clearFields = () => {
    const fields = document.querySelectorAll('.modal-field')
    fields.forEach(field => field.value = "")
}

const saveClient = () => {
    if (isValidFields()){
        const client = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            celular: document.getElementById('celular').value,
            cidade: document.getElementById('cidade').value
        }
        const index = document.getElementById('nome').dataset.index
        if(index == 'new'){
            createClient(client)
            updateTable()
            closeModal()
        } else{
           updateClient(index, client)
           updateTable()
           closeModal()
        }
        
    }
}

const createRow = (client, index) =>{
    const newRow = document.createElement('tr')
    newRow.innerHTML = `
        <td>${client.nome}</td>
        <td>${client.email}</td>
        <td>${client.celular}</td>
        <td>${client.cidade}</td>
        <td>
            <button type="button" class="button green" id="editar-${index}">Editar</button>
            <button type="button" class="button red" id="excluir-${index}">Excluir</button>
        </td>
    `
    document.querySelector('#tbClient>tbody').appendChild(newRow)
    
}

const clearTable = () => {
    const rows = document.querySelectorAll('#tbClient>tbody tr')
    rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
   const db_client = readClient()
   clearTable()
   db_client.forEach(createRow)
}

const fillFields = (client) => {
    document.getElementById('nome').value = client.nome
    document.getElementById('email').value = client.email
    document.getElementById('celular').value = client.celular
    document.getElementById('cidade').value = client.cidade
    document.getElementById('nome').dataset.index = client.index
}

const editClient = (index) =>{
    const client = readClient() [index]
    client.index = index
    fillFields(client)
    openModal()
}

const editDelete = (evente) => {
    if(evente.target.type == 'button'){
        const [action, index] = evente.target.id.split('-')

        if(action == 'editar'){
            editClient(index)
        } else {
            const client = readClient()[index]
            const response = confirm(`Deseja realmente excluir o cliente ${client.nome}`)
            if (response){
                Delete(index)
                updateTable()
            }
            
        }
    }
}

updateTable()

//eventos
document.getElementById('cadastrarCliente')
    .addEventListener('click', openModal)

document.getElementById('modalClose')
    .addEventListener('click', closeModal)

document.getElementById('salvar')
    .addEventListener('click', saveClient)

document.querySelector('#tbClient>tbody')
    .addEventListener('click', editDelete)
