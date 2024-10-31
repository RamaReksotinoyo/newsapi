const Validator = require("fastest-validator");
const dns = require('dns');
const v = new Validator({
    secretKey: "364517fdef24070994c6b518de138e37fe0e43ec"
});

const Validation = (cek, schema, res) => {
    const validationResponse = v.validate(cek, schema);
    if (validationResponse !== true) {
        return res.status(400).json({
            message: "Validation Failed",
            errors: validationResponse,
        });
    }
};

const ErrInvalidEmail = new Error('invalid email');
const ErrDomainNotFound = new Error('domain not found');
const ErrNotImplemented = new Error('not yet implemented');


const validateMail = (email) => {
    try {
        const parsedEmail = email.match(/(.+)@(.+)/);
        if (!parsedEmail) {
            throw ErrInvalidEmail;
        }

        const domain = parsedEmail[2];
        dns.resolveMx(domain, (err, addresses) => {
            if (err || addresses.length === 0) {
                throw ErrDomainNotFound;
            }
        });
    } catch (error) {
        throw error;
    }
}

const validatePassword = (pass) => {
    const isMoreThan8 = pass.length > 8;
    const isLower = /[a-z]/.test(pass);
    const isUpper = /[A-Z]/.test(pass);
    const isSymb = /[!@#$%^&*(),.?":{}|<>]/.test(pass);

    if (!(isLower && isUpper && isSymb && isMoreThan8)) {
        throw new Error('invalid password');
    }
}

module.exports = Validation;