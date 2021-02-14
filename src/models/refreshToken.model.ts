import DbManager from '../db/manager.db';
import * as tableDefinition from '../definitions/table.definition';
const TABLE: string = tableDefinition.THEETHRU.refreshTokens;

const createInfoQuery = `
INSERT INTO ${TABLE}
    (id, token, expiresAt)
VALUES
    (?, ?, FROM_UNIXTIME(?));`;
export const createInfo = async (id: string, token: string, expiresAt: number) => {
    console.log('refreshToken.model:createInfo', id, token, expiresAt);

    const query = createInfoQuery;
    const values = [id, token, expiresAt];

    const [result] = await DbManager.getInstance().query(query, values);

    return result;
}

const getInfoQuery = `
SELECT
    id, token
FROM
    ${TABLE}
WHERE
    id = ?;`;
export const getInfo = async (id) => {
    console.log('refreshToken.model:getInfo', id);

    const query = getInfoQuery;
    const values = [id];

    const [rows] = await DbManager.getInstance().query(query, values);

    return (rows.length > 0 ? rows[0] : null);
}