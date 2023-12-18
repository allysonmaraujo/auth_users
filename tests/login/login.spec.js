const app = require("../../src/server/server");
const request = require("supertest");
const yup = require("yup");

describe("Login method correct", () => {
	test("must return a object with User and Token", async () => {
		const result = await request(app).get("/users").send({
			email: "floatfurlan@testfy.com",
			password: "123456abc",
		});

		expect(result.statusCode).toBe(202);
		expect(typeof result.body).toBe("object");
	});
});

describe("Login method with a wrong email", () => {
	test("login method must return with a error message", async () => {
		const result = await request(app).get("/users").send({
			email: "nononono@testfy.com",
			password: "123456abc",
		});

		expect(result.statusCode).toBe(404);
		expect(typeof result.error.text).toBe("string");
	});
});

describe("Login method with a wrong password", () => {
	test("login method must return with a error message", async () => {
		const result = await request(app).get("/users").send({
			email: "floatfurlan@testfy.com",
			password: "nonononon",
		});
		console.log(yup.ValidationError);
		expect(result.statusCode).toBe(404);
		expect(typeof result.error.text).toBe("string");
	});
});
