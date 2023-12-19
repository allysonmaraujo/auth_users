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
1) > GET /login
2) > GET /users
3) > POST /users
4) > PUT /users
5) > PATCH /users
6) > DELETE /users
   


## 1) Login do Usuário
```http
 GET /login
```
#### Retorna um ítem específico e um código de status aceito, com as informações básicas do usuário e um Token com validade de 8 horas.

#### É necessário o usuario informar corretamente o usuário e senhas cadastrados no sistema (Banco de dados).

### Exemplo de input 

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
### Exemplo de retorno

#### a) Retorna um status code http
```javascript
202 (Accepted)
```
#### b) Retorna um objeto no formato JSON
```javascript
{
	"name": "Usuario",
	"email": "usuario@email.com",
	"age": 33,```
	"cpf": 11122233344
}
```

#

### 2) Detalhar informações de um usuario
```http
 GET /users
```
#### Retorna um ítem específico e um status, contendo os dados do usuário baseado no email informado

#### Exemplo de input 

| JSON   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `email` | `string` | **Obrigatório**. Deve conter um email válido |

```javascript
{
    "email": "usuario@email.com"
}
```
#### Retorna um status code http
```javascript
200 (ok)
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

#
### 3) Cadastrar um usuário
```http
 POST /users
```
#### Deve ser inserido todos os campos obrigatórios para o cadastro do usuário: name, email, age, cpf. Obedecendo regras conforme o exemplo e descrição de input abaixo.


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
#### Retorna um status code http
```javascript
201 (criado)
```
#### retorna uma mensagem em formato JSON
```javascript
{
	message: "register complete"
}
```
#

### 4) Atualizar um usuário
```http
 PUT /users
```
#### Como o método atualiza todas as propriedades do cadastro, deve ser inserido obrigatóriamente todos os campos  para o atualizar, porém haverá um campo a mais para email onde deve ser colocado o email já cadastrado e o novo email para cadastro, são os campos: name, email (antigo), email (novo), age, cpf. Obedecendo regras conforme o exemplo e descrição de input abaixo.


#### Exemplo de input 

| JSON   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` | **Obrigatório**. Deve conter uma nova string válida com o nome |
| `email(antigo)` | `string` | **Obrigatório**. Deve conter um email válido e cadastrado pertencente ao usuário|
| `email(novo)` | `string` | **Obrigatório**. Deve conter um novo email válido |
| `age` | `integer` | **Obrigatório**. Deve conter um novo numeral, positivo, com no máximo 3 digitos|
| `cpf` | `integer` | **Obrigatório**. Deve conter um novo numeral, positivo, com no máximo 11 digitos |

```javascript
{
	"name": "Usuario",
	"emailAntigo": "usuario@email.com",
	"emailNovo": "usuario@novoemail.com",
	"age": 33,
	"cpf": 11122233344,
}
```
#### Retorna um status code http
```javascript
202 (aceito)
```
#### retorna uma mensagem em formato JSON
```javascript
{
	message: "Update complete" 
}
```

#
### 5) Atualizar parcialmente um usuário
```http
 PATCH /users
```
#### Atualiza um ou mais campos nas propriedades do cadastro, podendo ser os campos: name, age, cpf e/ou password. Obedecendo regras conforme o exemplo e descrição de input abaixo. Obrigatório preencher um campo.


#### Exemplo de input 

| JSON   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` |  Pode conter uma nova string válida com o nome |
| `email` | `string` | Pode conter um novo email válido |
| `age` | `integer` |  Pode conter um novo numeral, positivo, com no máximo 3 digitos|
| `cpf` | `integer` |  Pode conter um novo numeral, positivo, com no máximo 11 digitos 

```javascript
{
	"name": "Usuario",
	"emailAntigo": "usuario@email.com",
	"emailNovo": "usuario@novoemail.com",
	"age": 33,
	"cpf": 11122233344,
}
```
#### Retorna um status code http
```javascript
202 (aceito)
```

#### retorna uma mensagem em formato JSON
```javascript
{
	message: "User's register sucessfully updated"
}
```
#
### 6) Excluir um usuário cadastrado
```http
 DELETE /users
```
#### Exclui um cadastro completo, baseando-se no campo email e senha válidos cadastrados. Obedecendo regras conforme o exemplo e descrição de input abaixo. 


#### Exemplo de input 

| JSON   | Tipo       | Descrição                           |
| :---------- | :--------- | :---------------------------------- |
| `name` | `string` |  Pode conter uma nova string válida com o nome |
| `email` | `string` | Pode conter um novo email válido |

```javascript
{
	"name": "Usuario",
	"emailAntigo": "usuario@email.com",
	"emailNovo": "usuario@novoemail.com",
	"age": 33,
	"cpf": 11122233344,
}
```
#### Retorna um status code http
```javascript
200 (ok)
```
#### retorna uma mensagem em formato JSON
```javascript
{
	message: "User's document was sucessfuly deleted"
}
```
## Considerações Finais sobre a API

> [!IMPORTANT]
> Mensagens de erro específicas serão retornadas caso haja algum erro no input da requisição.

