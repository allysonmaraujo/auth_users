# Authentication API

Essa API tem como finalidade a criação, edição, atualização (parcial ou completa) e exclusão de usuarios (CRUD) assim como o método de login com token de acesso, baseados em NodeJs com status de retorno correspondentes a cada solicitação

O código foi escrito em inglês, adiante será colocado a descrição e explicações também em inglês.

- O projetado em Javascript / Node / Express
- Banco de dados MongoDB (NoSQL)
- Jest / Supertest para teste unitário/integração/E2E
- Bcrypt para criptografia de dados sensiveis do usuario.
- Nodemon para monitoramento de alterações



## Documentação da API

## Endpoints
A API tem 6 endpoints e iremos detalhar o funcionamento de cada um.
1) GET /login
2) GET /users
3) POST /users
4) PUT /users
5) PATCH /users
6) DELETE /users
   

   
### 1) Login do Usuário
```http
 GET /login
```
#### Retorna um ítem específico e um status http 200 (ok), com as informações básicas do usuário e um Token com validade de 8 horas.

#### É necessário o usuario informar corretamente o usuário e senhas cadastrados no sistema (Banco de dados).

#### Exemplo de input 

| JSON   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `email` | `string` | **Obrigatório**. Deve conter um email válido |
| `senha` | `string` | **Obrigatório**. Deve conter a senha correspondente |

```javascript
{
    "email": "usuario@email.com",
    "password": "senhaDoUsuario"
}
```
#### Retorna um objeto no formato JSON
```javascript
{
	"name": "Usuario",
	"email": "usuario@email.com",
	"age": 33,
	"cpf": 11122233344
}
```
#### Códigos de erros especificos serão retornados caso haja incoerencia no input da requisição



### 2) Detalhar informações de um usuario
```http
 GET /users
```
#### Retorna um ítem específico e um status http 200 (ok), contendo os dados do usuário baseado no email informado

#### Exemplo de input 

| JSON   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `email` | `string` | **Obrigatório**. Deve conter um email válido |

```javascript
{
    "email": "usuario@email.com"
}
```
#### Retorna um objeto no formato JSON
```javascript
{
	"name": "Usuario",
	"email": "usuario@email.com",
	"age": 33,
	"cpf": 11122233344,
	"id": "656f9d9ef3d7f24c39d75cb7"
}
```

#### Códigos de erros especificos serão retornados caso haja incoerencia no input da requisição



### 3) Cadastrar um usuário
```http
 POST /users
```
#### retorna o status http 201 (Criado)

#### Exemplo de input 

| JSON   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` | **Obrigatório**. Deve conter uma string válida |
| `email` | `string` | **Obrigatório**. Deve conter um email válido |
| `age` | `integer` | **Obrigatório**. Deve conter um numeral, positivo, com no máximo 3 digitos|
| `cpf` | `integer` | **Obrigatório**. Deve conter um numeral, positivo, com no máximo 11 digitos |

```javascript
{
	"name": "Usuario",
	"email": "usuario@email.com",
	"age": 33,
	"cpf": 11122233344,
}
```
#### Retorna um status http 200 (ok)
```javascript

```

#### Códigos de erros especificos serão retornados caso haja incoerencia no input da requisição


continua...
