import * as jwt from 'jsonwebtoken';
import * as randToken from 'rand-token';
import * as userModel from '../models/user.model';
import { NotAuthorizedException, ExpiredAuthException, UnknownException, BadRequestException } from '../exceptions/common.exception';

const issuer = process.env.AWS_DOMAIN_API;
const privateKey = process.env.CREDENTIAL_JWT_PRIVATE_KEY;

export const getExpiresIn = accessToken => {
    console.log('jwt.service:getExpiresIn', accessToken);
    const decodedJwt = decodeToken(accessToken);
    console.log('decodedJwt', decodedJwt);
    return decodedJwt['payload']['exp'];
}

export const generateAccessToken = async (id: string, email: string, name: string, signupTypeCode: string, issuedId: string, expiresIn: string = "1d") => {
    console.log("jwt.service:generateAccessToken", id, email, name, signupTypeCode, issuedId, expiresIn);
    const payload = {
        id,
        email,
        name,
        signupTypeCode,
        issuedId,
    };

    const options = {
        expiresIn,
        issuer,
        subject: 'accessToken'
    };

    const token = await new Promise<string>((resolve, reject) => {
        jwt.sign(
            payload,
            privateKey,
            options,
            (err, token) => {
                if (!err) {
                    resolve(token);
                } else {
                    reject(err);
                }
            }
        );
    });
    return token;
}

export const generateRefreshToken = async (id, issuedId, expiresIn = '365d') => {
    console.log('jwt.service:generateRefreshToken', id, issuedId, expiresIn)
    const payload = {
        id,
        issuedId
    }

    const options = {
        expiresIn,
        issuer,
        subject: 'refreshToken'
    }

    const token = await new Promise<string>((resolve, reject) => {
        jwt.sign(
            payload,
            privateKey,
            options,
            (err, token) => {
                if (!err) {
                    resolve(token);
                } else {
                    reject(err);
                }
            }
        )
    })
    return token;
}

export const decodeToken = (accessToken) => {
    console.log('jwt.service:decodeToken', accessToken);
    return jwt.decode(accessToken, { complete: true });
}

export const verifyAccessToken = async (accessToken) => {
    return await new Promise((resolve, reject) => {
        jwt.verify(accessToken, privateKey, (err, decoded) => {
            if (!err) {
                resolve(decoded);
            } else {
                reject(err);
            }
        })
    }).catch(err => {
        console.log('err', err);
        const errStack = err.stack;
        if (errStack.indexOf("TokenExpiredError") >= 0) {
            throw new ExpiredAuthException("EXPIRED_ACCESS_TOKEN");
        } else if (errStack.indexOf("JsonWebTokenError") >= 0) {
            throw new NotAuthorizedException("INVALID_ACCESS_TOKEN");
        } else {
            throw new UnknownException();
        }
    })
}
export const verifyRefreshToken = async (refreshToken) => {
    console.log('jwt.service:verifyRefreshToken', refreshToken)
    return await new Promise((resolve, reject) => {
        jwt.verify(refreshToken, privateKey, (err, decoded) => {
            if (!err) {
                resolve(decoded);
            } else {
                reject(err);
            }
        })
    }).catch(err => {
        console.log('err', err);
        const errStack = err.stack;
        if (errStack.indexOf("TokenExpiredError") >= 0) {
            throw new ExpiredAuthException("EXPIRED_REFRESH_TOKEN");
        } else if (errStack.indexOf("JsonWebTokenError") >= 0) {
            throw new NotAuthorizedException("INVALID_REFRESH_TOKEN");
        } else {
            throw new UnknownException();
        }
    })
}

export const validAccessToken = async (accessToken) => {
    return await verifyAccessToken(accessToken)
        .catch(err => {
            console.log('err', err);
            const errStack = err.stack;
            if (errStack.indexOf("TokenExpiredError") >= 0) {
                throw new Error("EXPIRED_ACCESS_TOKEN");
            } else if (errStack.indexOf("JsonWebTokenError") >= 0) {
                throw new Error("INVALID_ACCESS_TOKEN");
            } else {
                throw new Error("UNKNOWN_ERROR");
            }
        });
}

export const refreshAccessToken = async (accessToken, refreshToken) => {
    console.log("jwt.service:refreshAccessToken", accessToken, refreshToken);
    try {
        const decodedAccessToken = await decodeToken(accessToken);
        console.log('decodedAccessToken', decodedAccessToken);

        const userId = decodedAccessToken['payload']['id'];
        const userInfo = await userModel.getInfo(userId);
        console.log(userInfo);

        const decodedRefreshToken = await decodeToken(refreshToken);
        console.log('decodedRefreshToken', decodedRefreshToken);

        if (decodedAccessToken.issuedId !== decodedRefreshToken.issuedId) {
            throw new Error("MISMATCH_ACCESS_TOKEN_AND_REFRESH_TOKEN");
        }

        const issuedId = decodedRefreshToken['payload']['issuedId'];

        // , id, email, name, signupTypeCode, issuedId, expiresIn
        const newAccessToken = await generateAccessToken(userInfo.id, userInfo.email, userInfo.name, userInfo.signupTypeInfo.code, issuedId);

        return newAccessToken;
    } catch (err) {
        console.error(err);
        throw new Error(err.message);
    }
}


export const generateSmsAuthToken = async (smsAuthInfo, expiresIn = "1d") => {
    let issuedId = randToken.uid(64);

    const payload = {
        name: smsAuthInfo['MBR_NAME'],
        cellphone: smsAuthInfo['CP_NUM'],
        email: smsAuthInfo['AUTH_NUM'],
        email: smsAuthInfo['MBR_EMAIL'],
        issuedId
    };

    const options = {
        expiresIn,
        issuer: 'dawinapps.com',
        subject: 'userInfo'
    };

    const token = await new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            privateKey,
            options,
            (err, token) => {
                if (!err) {
                    resolve(token);
                } else {
                    reject(err);
                }
            }
        );
    });

    return token;
}