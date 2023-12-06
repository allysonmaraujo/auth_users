const yup = require("yup");
const { pt } = require("yup-locales");
yup.setLocale(pt);

const registerUserSchema = yup.object({
	name: yup.string().required(),
	email: yup.string().email().required(),
	age: yup
		.string()
		.min(1)
		.max(3)
		.matches(/^[0-9]+$/)
		.required(),
	cpf: yup
		.string()
		.length(11)
		.matches(/^[0-9]+$/)
		.required(),
	password: yup.string().min(8).max(30).required(),
});

const loginUserSchamea = yup.object({
	email: yup.string().email().required(),
	password: yup.string().min(8).max(30).required(),
});

const updateUserSchema = yup.object({
	name: yup.string().required(),
	emailAntigo: yup.string().email().required(),
	emailNovo: yup.string().email().required(),
	age: yup
		.string()
		.min(1)
		.max(3)
		.matches(/^[0-9]+$/)
		.required(),
	cpf: yup
		.string()
		.length(11)
		.matches(/^[0-9]+$/)
		.required(),
	password: yup.string().min(8).max(30).required(),
});

const deleteUserSchema = yup.object({
	email: yup.string().email().required(),
	password: yup.string().min(8).max(30).required(),
});

module.exports = {
	registerUserSchema,
	loginUserSchamea,
	updateUserSchema,
	deleteUserSchema,
};
