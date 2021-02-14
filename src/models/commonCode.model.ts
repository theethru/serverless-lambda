import DbManager from '../db/manager.db';
const TABLE = "ITTA_APP.commonCodes";
export const getTableName = () => TABLE;

const getListQuery = `
SELECT
    sc.code, sc.names, c.code as parentCode
FROM 
    ${TABLE} c
    RIGHT JOIN ${TABLE} sc ON c.code = sc.parentCode`;
export const getList = async () => {
    console.log('commonCode.model:getList');

    const query = getListQuery;

    const [rows] = await DbManager.getInstance().query(query);

    const list = [];
    for (let i = 0; i < rows.length; i++) {
        const row = rows[i];

        list.push({
            code: row['code'],
            names: JSON.parse(row['names']),
            parentCode: row['parentCode'],
        });
    }

    return list;
}

const checkExistsQuery = `
SELECT
    COUNT(*) cnt
FROM
    ${TABLE}
WHERE
    code = ?
    %WHERE_CLAUSE_FOR_PARENT_CODE%;`;
export const checkExists = async (code: string, parentCode: string = null) => {
    console.log('user.model:checkExists', code, parentCode);

    let query = checkExistsQuery;
    const values = [code];

    if (parentCode) {
        query = query.replace(/%WHERE_CLAUSE_FOR_PARENT_CODE%/g, ' AND parentCode = ?');
        values.push(parentCode);
    } else {
        query = query.replace(/%WHERE_CLAUSE_FOR_PARENT_CODE%/g, '');
    }

    const [rows] = await DbManager.getInstance().query(query, values);
    console.log(rows[0]['cnt'] > 0);

    return (rows[0]['cnt'] > 0);
}