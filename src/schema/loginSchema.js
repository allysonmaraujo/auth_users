const yup = require("yup");
const { pt } = require("yup-locales");
yup.setLocale(pt);

const loginUserSchamea = yup.object({
	email: yup.string().email().required(),
	password: yup.string().min(8).max(30).required(),
});

module.exports = loginUserSchamea;
