const app = require("../src/server/server");
const request = require("supertest");

describe("Register new users", () => {
	test("Register with all fields correct, must return ok", async () => {
		const result = await request(app).post("/users").send({
			name: "Tester Jason",
			email: "tester@testfy.com",
			age: 33,
			cpf: 77777777788,
			password: "123456abc",
		});
		expect(result.statusCode).toBe(201);
	});
});

describe("Register new users with duplicated CPF", () => {
	test("Register with CPF already registered, middleware filter, register must fail", async () => {
		const result = await request(app).post("/users").send({
			name: "nononono",
			email: "nono@testfy.com",
			age: 11,
			cpf: 77777777788,
			password: "654321cba",
		});
		expect(result.statusCode).toBe(403);
		expect(result.body).toEqual(
			expect.objectContaining({ message: expect.any(String) })
		);
	});
});

describe("Register new users with duplicated EMAIL", () => {
	test("Register with EMAIL already registered, middleware filter, register must fail", async () => {
		const result = await request(app).post("/users").send({
			name: "nononono",
			email: "tester@testfy.com",
			age: 11,
			cpf: 11111111111,
			password: "654321cba",
		});
		expect(result.statusCode).toBe(403);
		expect(result.body).toEqual(
			expect.objectContaining({ message: expect.any(String) })
		);
	});
});

describe("Register new users", () => {
	test("Register without NAME, middleware, must return fail", async () => {
		const result = await request(app).post("/users").send({
			email: "proxy@testfy.com",
			age: 44,
			cpf: 22222222244,
			password: "654321cba",
		});
		expect(result.statusCode).toBe(500);
		expect(typeof result.error.text).toBe("string");
		expect(result.error.text).toEqual(expect.any(String));
	});
});

describe("Register new users", () => {
	test("Register without EMAIL, middleware, must return fail", async () => {
		const result = await request(app).post("/users").send({
			name: "Tester Jason",
			age: 44,
			cpf: 22222222244,
			password: "654321cba",
		});
		expect(result.statusCode).toBe(500);
		expect(typeof result.error.text).toBe("string");
		expect(result.error.text).toEqual(expect.any(String));
	});
});

describe("Register new users", () => {
	test("Register without AGE, middleware, must return fail", async () => {
		const result = await request(app).post("/users").send({
			name: "Tester Jason",
			email: "proxy@testfy.com",
			cpf: 22222222244,
			password: "654321cba",
		});
		expect(result.statusCode).toBe(500);
		expect(typeof result.error.text).toBe("string");
		expect(result.error.text).toEqual(expect.any(String));
	});
});

describe("Register new users", () => {
	test("Register without CPF, middleware, must return fail", async () => {
		const result = await request(app).post("/users").send({
			name: "Tester Jason",
			email: "proxy@testfy.com",
			age: 44,
			password: "654321cba",
		});
		expect(result.statusCode).toBe(500);
		expect(typeof result.error.text).toBe("string");
		expect(result.error.text).toEqual(expect.any(String));
	});
});

describe("Register new users", () => {
	test("Register without PASSWORD, middleware, must return fail", async () => {
		const result = await request(app).post("/users").send({
			name: "Tester Jason",
			email: "proxy@testfy.com",
			age: 44,
			cpf: 22222222244,
		});
		expect(result.statusCode).toBe(500);
		expect(typeof result.error.text).toBe("string");
		expect(result.error.text).toEqual(expect.any(String));
	});
});
