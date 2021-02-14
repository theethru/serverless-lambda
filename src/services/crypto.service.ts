import * as crypto from 'crypto';
const repeatCnt = 256;
const salt = process.env.CREDENTIAL_APP_HASH_SALT;

export const makeEncryptedPassword = async (password: string) => {
    const keyBuffer: Buffer = await new Promise<Buffer>((resolve, reject) => {
        crypto.pbkdf2(password, salt, repeatCnt, 64, 'sha512', (err, key: Buffer) => {
            if (!err) {
                resolve(key);
            } else {
                reject(err);
            }
        })
    }).catch(err => {
        console.error(err);
        return null;
    });

    if (!keyBuffer) {
        return null;
    }

    return keyBuffer.toString('base64');
}