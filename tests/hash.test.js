const { HashPasswrod, DecryptPassword } = require('../middleware/hash'); // Pastikan path sesuai
const bcrypt = require('bcrypt');

describe('Hash Password and Decrypt Password', () => {
    const plainPassword = 'mySecretPassword';
    let hashedPassword;

    test('should hash the password', () => {
        hashedPassword = HashPasswrod(plainPassword);
        expect(hashedPassword).not.toBe(plainPassword); // Memastikan hashed tidak sama dengan password asli
        expect(bcrypt.compareSync(plainPassword, hashedPassword)).toBe(true); // Memastikan hashing berhasil
    });

    test('should decrypt the password', () => {
        const result = DecryptPassword(plainPassword, hashedPassword);
        expect(result).toBe(true); // Memastikan password dapat didekripsi dengan benar
    });

    test('should not decrypt with wrong password', () => {
        const result = DecryptPassword('wrongPassword', hashedPassword);
        expect(result).toBe(false); // Memastikan password yang salah tidak dapat didekripsi
    });
});