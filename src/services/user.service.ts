import DbManager from '../db/manager.db';
import * as userModel from '../models/user.model';

export const updateLastActivityAt = async (id: string) => {
    console.log('user.service:updateLastActivityAt', id);
    const result = await userModel.updateLastActivityAt(id);
    return result;
}

export const getInfo = async (id: string) => {
    console.log('user.service:getInfo', id);

    const info = await userModel.getInfo(id);
    return { info };
}