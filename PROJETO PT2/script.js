// ----------------------------------------------------------------------
const form = document.getElementById('form')
const username = document.getElementById('username')
const email = document.getElementById('email')
const bornDate = document.getElementById('bornDate')
const gender = document.getElementById('gender')
const active = document.getElementById('active')
const localidade = document.getElementById('localidade')
const logradouro = document.getElementById('logradouro')
const bairro = document.getElementById('bairro')
const uf = document.getElementById('uf')

form.addEventListener('submit', e => {
  e.preventDefault()

  checkInputs()
})

function checkInputs() {
  const usernameValue = username.value
  const emailValue = email.value
  const bornDateValue = bornDate.value
  const localidadeValue = localidade.value
  const ufValue = uf.value
  const genderValue = gender.value
  const cepValue = cep.value
  const logradouroValue = logradouro.value
  const bairroValue = bairro.value

  if (usernameValue === '') {
    setErrorFor(username, 'O nome de usuário é Obrigatório.')
  } else {
    SetSuccessFor(username)
  }

  if (emailValue === '') {
    setErrorFor(email, 'Email é Obrigatório.')
  } else if (!checkEmail(emailValue)) {
    setErrorFor(email, alert('Email inválido!'))
  } else SetSuccessFor(email)

  if (bornDateValue === '') {
    setErrorFor(bornDate, 'Data de Nascimento Obrigatória')
  } else SetSuccessFor(bornDate)

  if (localidadeValue === '') {
    setErrorFor(localidade, 'Campo Obrigatório')
  } else SetSuccessFor(localidade)

  if (ufValue === '') {
    setErrorFor(uf, 'Campo Obrigatório')
  } else SetSuccessFor(uf)

  if (genderValue === '') {
    setErrorFor(gender, 'Campo Obrigatório')
  } else SetSuccessFor(gender)

  if (bairroValue === '') {
    setErrorFor(bairro, 'Campo Obrigatório')
  } else SetSuccessFor(bairro)

  if (cepValue === '') {
    setErrorFor(cep, 'Campo Obrigatório')
  } else SetSuccessFor(cep)

  if (logradouroValue === '') {
    setErrorFor(logradouro, 'Campo Obrigatório')
  } else SetSuccessFor(logradouro)

  const formGroupRow = form.querySelectorAll(`.formGroupRow`)

  const formIsValid = [...formGroupRow].every(formGroupRow => {
    return (formGroupRow.className = 'form-group row success')
  })
  if (formIsValid) {
    console.log(`O Formulário está completo`)
    alert(`USUÁRIO CADASTRADO COM SUCESSO`)
  }
}

function setErrorFor(input, message) {
  const formGroupRow = input.parentElement.parentElement

  formGroupRow.className = 'form-group row error'
}

function SetSuccessFor(input) {
  const formGroupRow = input.parentElement.parentElement

  formGroupRow.className = 'form-group row success'
}

//====================== FUNÇÃO PARA CHECAR EMAIL=================
function checkEmail(email) {
  return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  )
}

// =======================CONSULTAR VIA CEP =========================
const cep = document.querySelector('#cep')

const showData = result => {
  for (const campo in result) {
    if (document.querySelector('#' + campo)) {
      document.querySelector('#' + campo).value = result[campo]
    }
  }
}

cep.addEventListener('blur', e => {
  let search = cep.value.replace('-', '')
  const options = {
    method: 'GET',
    mode: 'cors',
    cache: 'default'
  }

  fetch(`https://viacep.com.br/ws/${search}/json`, options)
    .then(response => {
      response.json().then(data => showData(data))
    })
    .catch(e => console.log('Erro:' + e, message))
})

// ============= CADASTRO DE USER ====================

function saveUser() {
  let listaUser = JSON.parse(localStorage.getItem('listaUser') || `[]`)

  listaUser.push({
    name: username.value,
    Email: email.value,
    BornDate: bornDate.value,
    Cep: cep.value,
    Bairro: bairro.value,
    logradouro: logradouro.value,
    uf: uf.value,
    localidade: localidade.value,
    gender: gender.value,
    Active: active.value
  })

  localStorage.setItem(`listaUser`, JSON.stringify(listaUser))
  const index = document.getElementById('username').dataset.index

  if (index == 'new') {
    createUser(User)
    updateTable()
    clearFields()
  } else {
    updateUser(index, listaUser)
    updateTable()
    clearFields()
  }
}
// --------------------------------------------------------

const getLocalStorageDate = () => {
  return JSON.parse(localStorage.getItem('listaUser')) ?? []
}

const createRow = (User, index) => {
  const newRow = document.createElement('tr')
  newRow.innerHTML = `
      <td>${User.Nome}</td>
      <td>${User.Email}</td>
      <td>${User.bornDate}</td>
      <td>${User.cep}</td>
      <td>${User.logradouro}</td>
      <td>${User.Bairro}</td>
      <td>${User.localidade}</td>
      <td>${User.uf}</td>
      <td>${User.male === true ? 'Masculino' : 'Feminino'}</td>
      <td>${User.checkbox === true ? 'Sim' : 'Não'}</td>
      <td><button type="button" class="button edit" id="edit-${index}" data-action="edit">Editar</button></td>
      <td><button type="button" class="button del" id="del-${index}" data-action="delete">Excluir</button></td>
  `
  document.querySelector('#tableUser>tbody').appendChild(newRow)
}

const clearTable = () => {
  const rows = document.querySelectorAll('#tableUser>tbody tr')
  rows.forEach(row => row.parentNode.removeChild(row))
}

const updateTable = () => {
  const listaUser = readUser()
  clearTable()
  listaUser.forEach(createRow)
}

const getLocalStorage = () => {
  return JSON.parse(localStorage.getItem('listaUser')) ?? []
}

const setLocalStorage = listaUser =>
  localStorage.setItem('listaUser', JSON.stringify(listaUser))

//CRUD Delete
const deleteUser = index => {
  const listaUser = readUser()
  listaUser.splice(index, 1)
  setLocalStorage(listaUser)
}

//CRUD Update
const updateUser = (index, User) => {
  const listaUser = readUser()
  listaUser[index] = User
  setLocalStorage(listaUser)
}

//CRUD Read "duplicado"
const readUser = () => getLocalStorage()

//CRUD Create
const createUser = User => {
  const listaUser = getLocalStorage()
  listaUser.push(User)
  console.log(listaUser)
  setLocalStorage(listaUser)
}

const isValidFields = () => {
  return document.getElementById('form').reportValidity()
}

const clearFields = () => {
  const fields = document.querySelectorAll('.form-control')
  fields.forEach(field => (field.value, (field.checked = '')))
}

// const saveUser = () => {
//   if (isValidFields()) {
//     const User = {
//       name: document.getElementById('username').value,
//       email: document.getElementById('email').value,
//       DataDeNascimento: document.getElementById('bornDate').value,
//       cep: document.getElementById('cep').value,
//       logradouro: document.getElementById('logradouro').value,
//       bairro: document.getElementById('bairro').value,
//       cidade: document.getElementById('localidade').value,
//       uf: document.getElementById('uf').value,
//       gender: document.getElementById('gender').checked
//     }
//     const index = document.getElementById('username').dataset.index
//     if (index == 'new') {
//       createUser(User)
//       updateTable()
//       clearFields()
//     } else {
//       updateUser(index, User)
//       updateTable()
//       clearFields()
//     }
//   }
// }

const fillFields = User => {
  document.getElementById('username').value = User.username
  document.getElementById('email').value = User.email
  document.getElementById('borndDate').value = User.bornDate
  document.getElementById('cep').value = User.cep
  document.getElementById('uf').value = User.uf
  document.getElementById('bairro').value = User.bairro
  document.getElementById('logradouro').value = User.logradouro
  document.getElementById('localidade').value = User.cidade
  // document.getElementById('bairro').checked = User.bairro
  document.getElementById('gender').checked = User.gender

  document.getElementById('Nome').dataset.index = User.index
}

const editUser = index => {
  const listaUser = readUser()[index]
  listaUser.index = index
  fillFields(listaUser)
}

const editDelete = event => {
  if (event.target.type == 'button') {
    const [action, index] = event.target.id.split('-')

    if (action == 'edit') {
      editUser(index)
    } else {
      const listaUser = readUser()[index]
      const response = confirm(`Excluir o usuário ${listaUser.Nome} ?`)
      if (response) {
        deleteUser(index)
        updateTable()
      }
    }
  }
}

//botão salvar os dados
const element = document.getElementById('enviar')
element.addEventListener('click', saveUser)

updateTable()

document.querySelector('#tableUser>tbody').addEventListener('click', editDelete)
