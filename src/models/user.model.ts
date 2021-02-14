import DbManager from '../db/manager.db';
import * as tableDefinition from '../definitions/table.definition';
const TABLE: string = tableDefinition.THEETHRU.users;

import * as commonCodeModel from './commonCode.model';
import * as commonHelper from '../helpers/common.helper';
import * as imageHelper from '../helpers/image.helper';

const getInfoQuery: string = `
SELECT
    u.id, u.email, 
    u.name,
    CONCAT("{\\"code\\":\\"", cc.code, "\\",\\"names\\":", cc.names ,"}") AS signupTypeInfo,
	CONCAT("{\\"code\\":\\"", gc.code ,"\\",\\"names\\":", gc.names, "}") AS genderTypeInfo,
	CONCAT("{\\"id\\":", i.id ,",\\"uri\\":\\"", i.uri, "\\"}") AS imageInfo
FROM
    ${TABLE} AS u
    LEFT JOIN ${tableDefinition.THEETHRU.commonCodes} AS cc ON cc.code = u.signupTypeCode
    LEFT JOIN ${tableDefinition.THEETHRU.commonCodes} AS gc ON gc.code = u.genderTypeCode
    LEFT JOIN ${tableDefinition.THEETHRU.images} AS i ON i.id = u.imageId
WHERE 
    u.id = ?
    AND u.userStatusCode != 'userStatus:secession'
;`;
export const getInfo = async (id: string) => {
    console.log('user.model:getInfo', id);

    const query = getInfoQuery;
    const values = [id];

    console.log(query, values);

    const { row } = await DbManager.getInstance().first(query, values);
    if (!row) {
        return null;
    }

    console.log(row);

    return {
        id: row.id,
        email: row.email,
        name: row.name,
        signupTypeInfo: commonHelper.jsonParse(row.signupTypeInfo),
        genderTypeInfo: commonHelper.jsonParse(row.genderTypeInfo),
        imageInfo: imageHelper.makeImageInfo(row.imageInfo),
    }
}

const createInfoQuery: string = `
INSERT INTO ${TABLE}
    (id, signupTypeCode, 
    email, password, 
    name, genderTypeCode)
VALUES
    (?, ?,
    ?, ?, 
    ?, ?);`;
export const createInfo = async (
    id: string, signupTypeCode: string,
    email: string, password: string,
    name: string, genderTypeCode: string) => {
    console.log('user.model:createInfo',
        id, signupTypeCode,
        email, password,
        name, genderTypeCode);

    const query = createInfoQuery;
    const values = [
        id, signupTypeCode,
        email, password, name,
        genderTypeCode];

    const [result] = await DbManager.getInstance().query(query, values);

    return result;
}

const updateInfoQuery: string = `
UPDATE
    ${TABLE}
SET
    name = ?,
    imageId = ?,
    genderTypeCode = ?
WHERE
    id = ?
;`;
export const updateInfo = async (id: string, name: string, imageId: number, genderTypeCode: string) => {
    console.log('user.model:updateInfo', id, name, imageId, genderTypeCode);

    const query = updateInfoQuery;
    const values = [name, imageId, genderTypeCode, id];

    const { result } = await DbManager.getInstance().update(query, values);

    return result;
}

const checkExistsQuery: string = `
SELECT
    COUNT(*) cnt
FROM
    ${TABLE}
WHERE
    id = ?
    AND userStatusCode != 'userStatus:secession'
;`;
export const checkExists = async (id: string) => {
    console.log('user.model:checkExists', id);

    const query = checkExistsQuery;
    const values = [id];

    const [rows] = await DbManager.getInstance().query(query, values);

    return (rows[0]['cnt'] > 0);
}

const checkExistsByEmailAndSignupTypeCodeQuery: string = `
SELECT
    COUNT(*) cnt
FROM
    ${TABLE}
WHERE
    email = ?
    AND signupTypeCode = ?
    AND userStatusCode != 'userStatus:secession'
;`;
export const checkExistsByEmailAndSignupTypeCode = async (email: string, signupTypeCode: string) => {
    console.log('user.model:checkExistsByEmailAndSignupTypeCode', email, signupTypeCode);

    const query = checkExistsByEmailAndSignupTypeCodeQuery;
    const values = [email, signupTypeCode];

    const [rows] = await DbManager.getInstance().query(query, values);

    return (rows[0]['cnt'] > 0);
}

const getInfoForEmailSignupTypeQuery: string = `
SELECT
    id, email, name,
    CONCAT("{\\"code\\":\\"", cc.code, "\\",\\"names\\":", cc.names ,"}") as signupTypeInfo
FROM
    ${TABLE} AS u
    INNER JOIN ${commonCodeModel.getTableName()} AS cc ON cc.code = u.signupTypeCode
WHERE
    1 = 1
    AND signupTypeCode = 'signupType:email'
    AND userStatusCode != 'userStatus:secession'
    AND email = ?
    AND password = ?;`;
export const getInfoForEmailSignupType = async (email: string, password: string) => {
    console.log('user.model:getInfoForEmailSignupType', email, password);

    const query = getInfoForEmailSignupTypeQuery;
    const values = [email, password];

    const [rows] = await DbManager.getInstance().query(query, values);

    if (rows.length === 0) {
        return null;
    }

    const row = rows[0];
    const info = {
        id: row.id,
        email: row.email,
        name: row.name,
        signupTypeInfo: JSON.parse(row.signupTypeInfo)
    }

    return info;
}

const updateLastActivityAtQuery: string = `
UPDATE
    ${TABLE}
SET
    lastActivityAt = NOW()
WHERE
    id = ?;`;
export const updateLastActivityAt = async (id: string) => {
    console.log('user.model:updateLastActivityAt', id);

    const query = updateLastActivityAtQuery;
    const values = [id];

    const [result] = await DbManager.getInstance().query(query, values);

    return result;
}

const updatePasswordQuery: string = `
UPDATE
    ${TABLE}
SET
    password = ?
WHERE
    id=?;`;
export const updatePassword = async (id: string, password: string) => {
    console.log('user.model:updatePassword', id);

    const query = updatePasswordQuery;
    const values = [password, id];

    const { result } = await DbManager.getInstance().update(query, values);

    return result;
}

const getEmailQuery: string = `
SELECT
    email
FROM
    ${TABLE}
WHERE
    id = ?
;`;
export const getEmail = async (id: string) => {
    console.log('user.model:getEmail', id);

    const query = getEmailQuery;
    const values = [id];

    const [rows] = await DbManager.getInstance().query(query, values);

    if (rows.length === 0) {
        return null;
    }

    return rows[0]['email'];
}

const updateUserStatusCodeQuery: string = `
UPDATE
    ${TABLE}
SET
    userStatusCode = ?
WHERE
    id = ?
    AND userStatusCode != 'userStatus:secession'
;`;
export const updateUserStatusCode = async (id: string, userStatusCode: string) => {
    console.log('user.model:updateUserStatusCode', id, userStatusCode);

    const query = updateUserStatusCodeQuery;
    const values = [userStatusCode, id];

    const { result } = await DbManager.getInstance().update(query, values);

    return result;
}