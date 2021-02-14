import { BadRequestException } from '../exceptions/common.exception';

import * as userModel from '../models/user.model';
import * as commonCodeModel from '../models/commonCode.model';
import * as imageModel from '../models/image.model';
import * as regHelper from '../helpers/reg.helper';

import * as cryptoService from '../services/crypto.service';
import DbManager from '../db/manager.db';

export const getInfo = async (userId: string) => {
    console.log('my.service:getInfo', userId);

    const info = await userModel.getInfo(userId);
    return { info };
}

export const updateInfo = async (userId: string, name: string, imageId: number, genderTypeCode: string) => {
    console.log('my.service:updateInfo', userId, name, imageId, genderTypeCode);

    const userInfo = await userModel.getInfo(userId);
    if (!userInfo) {
        throw new BadRequestException("NO_USER");
    }

    if (!name) {
        throw new BadRequestException("NEED_NAME");
    }

    if (imageId) {
        const existsImage = await imageModel.checkExists(imageId);
        if (!existsImage) {
            throw new BadRequestException("NEED_IMAGE_ID");
        }
    }

    const existsGenderTypeCode = await commonCodeModel.checkExists(genderTypeCode);
    if (!existsGenderTypeCode) {
        throw new BadRequestException("NEED_GENDER_TYPE_CODE");
    }

    await DbManager.getInstance().beginTransaction();

    if (userInfo.imageInfo) {
        await imageModel.updateIsActivated(userInfo.imageInfo.id, 0);
    }

    await imageModel.updateIsActivated(imageId, 1);

    const result = await userModel.updateInfo(userId, name, imageId, genderTypeCode);

    await DbManager.getInstance().commit();

    return { result };
}

export const updatePassword = async (userId: string,
    password: string,
    newPassword: string, confirmedNewPassword: string) => {
    console.log('my.service:updatePassword', userId);

    const email = await userModel.getEmail(userId);
    if (!email) {
        throw new BadRequestException("NO_USER");
    }

    const hashedPassword = await cryptoService.makeEncryptedPassword(password);
    const userInfo = await userModel.getInfoForEmailSignupType(email, hashedPassword);
    if (!userInfo) {
        throw new BadRequestException("WRONG_PASSWORD");
    }

    if (!regHelper.checkPassword(newPassword)) {
        throw new BadRequestException("NEED_NEW_PASSWORD");
    } else if (newPassword != confirmedNewPassword) {
        throw new BadRequestException("MISMATCH_NEW_PASSWORD_AND_CONFIRMED_NEW_PASSWORD");
    }

    const hashedNewPassword: string = await cryptoService.makeEncryptedPassword(newPassword);

    const result = await userModel.updatePassword(userId, hashedNewPassword);

    return { result }
}
