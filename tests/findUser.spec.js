const app = require("../src/server/server");
const request = require("supertest");

describe(" Find a user", () => {
	test("Find a user with all fiels correctly, must return ok", async () => {
		const result = request(app).get("/users").send({
			email: "floatfurlan@testfy.com",
		});
	});
	expect(result.statusCode).toBe(202);
	expect(result.body).toEqual(expect.objectContaining(expect.any(String)));
});
