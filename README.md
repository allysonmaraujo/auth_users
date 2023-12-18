# # Authentication API

Essa API tem como finalidade a criação, edição, atualização (parcial ou completa) e exclusão de usuarios (CRUD) assim como o método de login com token de acesso.

O código foi escrito em inglês, adiante será colocado a descrição e explicações também em inglês.

-   O projetado em Javascript / Node / Express
-   Banco de dados MongoDB (NoSQL)
-   Jest / Supertest para teste unitário/integração/E2E
-   Bcrypt para criptografia de dados sensiveis do usuario.
-   Nodemon para monitoramento de alterações

## Documentação da API

## Endpoints

Nossa API tem 6 endpoints e iremos detalhar o funcionamento de cada um.

1. GET /login
2. GET /users
3. POST /users
4. PUT /users
5. PATCH /users
6. DELETE /users

### Detalhar um usuario

```http
 GET /users
```

#### Retorna um item específico

#### Exemplo de input

| JSON    | Tipo     | Descrição                                    |
| :------ | :------- | :------------------------------------------- |
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

continua...
