import { BadRequestException } from '../exceptions/common.exception';
import DbManager from '../db/manager.db';

import * as userModel from '../models/user.model';
import * as commonCodeModel from '../models/commonCode.model';
import * as refreshTokenModel from '../models/refreshToken.model';

import * as cryptoService from './crypto.service';
import * as regHelper from '../helpers/reg.helper';
import * as jwtService from './jwt.service';
import * as commonHelper from '../helpers/common.helper';

export const signup = async (
    email: string, password: string, confirmedPassword: string,
    name: string, genderTypeCode: string) => {
    console.log('auth/auth.service:signup', email, password, confirmedPassword, name);

    if (!regHelper.checkIsEmail(email)) {
        throw new BadRequestException("NEED_EMAIL");
    } else if (!regHelper.checkPassword(password)) {
        throw new BadRequestException("NEED_PASSWORD");
    } else if (password != confirmedPassword) {
        throw new BadRequestException("MISMATCH_PASSWORD_AND_CONFIRMED_PASSWORD");
    } else if (!name) {
        throw new BadRequestException("NEED_NAME");
    }

    const existsGenderType = await commonCodeModel.checkExists(genderTypeCode, 'genderType');
    if (!existsGenderType) {
        throw new BadRequestException("NEED_GENDER_TYPE");
    }

    const exists = await userModel.checkExistsByEmailAndSignupTypeCode(email, 'signupType:email');
    if (exists) {
        throw new BadRequestException("EXISTS_EMAIL");
    }

    const id = commonHelper.makeUuidV4();
    const hashedPassword: string = await cryptoService.makeEncryptedPassword(password);

    // Create user info Logic
    await DbManager.getInstance().beginTransaction();

    await userModel.createInfo(id, 'signupType:email', email, hashedPassword, name, genderTypeCode);

    const userInfo = await userModel.getInfoForEmailSignupType(email, hashedPassword);

    const issuedId = commonHelper.makeUuidV4();
    const expiresIn = "1d";

    const accessToken = await jwtService.generateAccessToken(userInfo.id, userInfo.email, userInfo.name, userInfo.signupTypeInfo.code, issuedId, expiresIn);
    const accessTokenExpiresAt = jwtService.getExpiresIn(accessToken);

    const refreshToken = await jwtService.generateRefreshToken(userInfo.id, issuedId, "365d");
    const refreshTokenExpiresAt = jwtService.getExpiresIn(refreshToken);

    await refreshTokenModel.createInfo(issuedId, refreshToken, refreshTokenExpiresAt);

    await DbManager.getInstance().commit();

    return {
        userId: id,
        accessToken,
        expiresAt: accessTokenExpiresAt,
    };
}

export const login = async (email: string, password: string) => {
    console.log('auth.service:login', email, password);

    if (!email) {
        throw new BadRequestException("NEED_EMAIL");
    } else if (!password) {
        throw new BadRequestException("NEED_PASSWORD");
    }

    const hashedPassword = await cryptoService.makeEncryptedPassword(password);

    const userInfo = await userModel.getInfoForEmailSignupType(email, hashedPassword);
    if (!userInfo) {
        throw new BadRequestException("NO_USER_INFORMATION");
    }

    const issuedId = commonHelper.makeUuidV4();
    const expiresIn = "1d";

    const accessToken = await jwtService.generateAccessToken(userInfo.id, userInfo.email, userInfo.name, userInfo.signupTypeInfo.code, issuedId, expiresIn);
    const accessTokenExpiresAt = jwtService.getExpiresIn(accessToken);

    const refreshToken = await jwtService.generateRefreshToken(userInfo.id, issuedId, "365d");
    const refreshTokenExpiresAt = jwtService.getExpiresIn(refreshToken);

    await refreshTokenModel.createInfo(issuedId, refreshToken, refreshTokenExpiresAt);

    return {
        accessToken,
        expiresAt: accessTokenExpiresAt,
    };
}

// 
export const refreshAccessToken = async (accessToken: string) => {
    console.log('auth.service:refreshAccessToken', accessToken);

    if (!accessToken) {
        throw new BadRequestException('NEED_ACCESS_TOKEN');
    }

    const decodedToken = jwtService.decodeToken(accessToken);

    const issuedId = decodedToken['payload']['issuedId'];

    const refreshTokenInfo = await refreshTokenModel.getInfo(issuedId);
    if (!refreshTokenInfo) {
        throw new BadRequestException('NO_REFRESH_TOKEN_INFORMATION');
    }

    const refreshToken = refreshTokenInfo['token'];
    await jwtService.verifyRefreshToken(refreshToken);

    const userId = decodedToken['payload']['id'];
    const userInfo = await userModel.getInfo(userId);
    if (!userInfo) {
        throw new BadRequestException("NO_USER_INFORMATION");
    }

    const newAccessToken = await jwtService.refreshAccessToken(accessToken, refreshToken);
    const accessTokenExpiresAt = jwtService.getExpiresIn(accessToken);

    return {
        accessToken: newAccessToken,
        expiresAt: accessTokenExpiresAt,
    };
}

export const getUserInfoByAccessToken = async (accessToken) => {
    console.log('auth.service:getUserInfoByAccessToken', accessToken);

    const userInfo = await jwtService.verifyAccessToken(accessToken);
    console.log('userInfo', userInfo);

    return { userInfo };
}

export const secession = async (userId: string, password: string) => {
    console.log('auth.service:secession', userId);

    const email = await userModel.getEmail(userId);
    if (!email) {
        throw new BadRequestException("NO_USER");
    }

    const hashedPassword = await cryptoService.makeEncryptedPassword(password);
    const userInfo = await userModel.getInfoForEmailSignupType(email, hashedPassword);
    if (!userInfo) {
        throw new BadRequestException("WRONG_PASSWORD");
    }

    const result = await userModel.updateUserStatusCode(userId, 'userStatus:secession');

    return { result }
}