import DbManager from '../db/manager.db';
import * as tableDefinition from '../definitions/table.definition';
const TABLE: string = tableDefinition.THEETHRU.images;

const createInfoQuery = `
INSERT INTO ${TABLE}
    (id, filename, filesize, width, height, bucket, uri)
VALUES
    (?, ?, ?, ?, ?, ?, ?);`;
export const createInfo = async (
    id: string,
    filename: string, filesize: number, width: number, height: number,
    bucket: string, uri: string) => {
    console.log('image.model:createInfo',
        id,
        filename, filesize, width, height,
        bucket, uri);

    const query = createInfoQuery;
    const values = [id,
        filename, filesize, width, height,
        bucket, uri];

    const { insertedId } = await DbManager.getInstance().insert(query, values);

    return insertedId;
}

const checkExistsQuery: string = `
SELECT
    COUNT(*) cnt
FROM
    ${TABLE}
WHERE
    id = ?
    AND isRemoved = 0
;`;
export const checkExists = async (id: number) => {
    console.log('image.model:checkExists', id);

    const query = checkExistsQuery;
    const values = [id];

    const [rows] = await DbManager.getInstance().query(query, values);

    return (rows[0]['cnt'] > 0);
}

const updateIsActivatedQuery = `
UPDATE
    ${TABLE}
SET
    isActivated = ?
WHERE
    id = ?;`;
export const updateIsActivated = async (id: number, isActivated: number) => {
    console.log('image.model:updateIsActivatedQuery', id, isActivated);

    const query = updateIsActivatedQuery;
    const values = [isActivated, id];

    const [resultHeader] = await DbManager.getInstance().query(query, values);

    return resultHeader;
}