import * as logger from '../loggers/common.logger';
import mysql from 'mysql2/promise';

interface IConnectionInfo {
    host: string,
    user: string,
    password: string,
    database: string,
    port: number,
    connectionLimit: number,
    multipleStatements: boolean,
    namedPlaceholders: boolean
}

interface IDb {
    pool: any;
    conn: any;
    connectionInfo: IConnectionInfo;
}

const defaultConnectionInfo: IConnectionInfo = {
    host: process.env.CREDENTIAL_DB_ENDPOINT,
    user: process.env.CREDENTIAL_DB_USERNAME,
    password: process.env.CREDENTIAL_DB_PASSWORD,
    database: process.env.CREDENTIAL_DB_DATABASE,
    port: parseInt(process.env.CREDENTIAL_DB_PORT, 10),
    connectionLimit: 10,
    multipleStatements: true,
    namedPlaceholders: true
}

export default class DbManager implements IDb {
    static instance: DbManager;

    pool: any;
    conn: any;
    connectionInfo: IConnectionInfo;

    constructor() { }

    public static getInstance() {
        if (!DbManager.instance) {
            DbManager.instance = new DbManager();
        }
        return DbManager.instance;
    }

    init = async (connectionInfo: IConnectionInfo = defaultConnectionInfo) => {
        if (!this.pool) {
            this.connectionInfo = connectionInfo;
            this.pool = await mysql.createPool(connectionInfo);
            this.conn = await this.createConnection();
        }
    }

    createConnection = async () => {
        if (this.pool) {
            return await this.pool.getConnection(async conn => conn);
        } else {
            return null;
        }
    }

    getConnection = () => {
        return this.conn;
    }

    beginTransaction = async () => {
        if (this.pool && this.conn) {
            await this.conn.beginTransaction();
        }
    }

    commit = async () => {
        if (this.pool && this.conn) {
            await this.conn.commit();
        }
    }

    rollback = async () => {
        if (this.pool && this.conn) {
            await this.conn.rollback();
        }
    }

    query = async (query: string, values: array = null) => {
        if (!this.pool) {
            throw new Error("There are no pool");
        } else if (!this.conn) {
            throw new Error("There are no connection");
        } else {
            if (values) {
                logger.query(query, values);
                return await this.conn.query(query, values);
            } else {
                logger.query(query);
                return await this.conn.query(query);
            }
        }
    }

    insert = async (query: string, values: any[] = []): Promise<{ insertedId: number, resultHeader: any }> => {
        const [resultHeader] = await this.query(query, values);
        return {
            insertedId: resultHeader.insertId,
            resultHeader
        }
    }

    update = async (query: string, values: any[] = []): Promise<{ result: boolean, resultHeader: any }> => {
        const [resultHeader] = await this.query(query, values);
        return {
            result: (resultHeader.affectedRows > 0),
            resultHeader
        }
    }

    count = async (query: string, values: any[] = []): Promise<{ count: number, rows: any[] }> => {
        const [rows] = await this.query(query, values);

        let count = 0;
        if (rows.length === 0) {
            count = 0;
        } else {
            count = rows[0]['cnt'];
        }
        return {
            count,
            rows
        }
    }
    first = async (query: string, values: any[] = []): Promise<{ row: any, rows: any[] }> => {
        const [rows] = await this.query(query, values);
        if (rows.length === 0) {
            return { row: null, rows };
        } else {
            return {
                row: rows[0],
                rows
            }
        }
    }
    list = async (query: string, values: any[] = []): Promise<any[]> => {
        const [rows] = await this.query(query, values);
        return rows;
    }

    releaseConnection = async () => {
        if (this.conn) {
            await this.conn.release();
        }
    }

    endConnection = async () => {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
        }
        return this.pool;
    }

    getEndpoint = () => {
        return process.env.AWS_DB_ENDPOINT;
    }
    getUsername = () => {
        return process.env.AWS_DB_USERNAME;
    }
    getPassword = () => {
        return process.env.AWS_DB_PASSWORD;
    }
    getDatabase = () => {
        return process.env.AWS_DB_DATABASE;
    }
    getPort = () => {
        return process.env.AWS_DB_PORT;
    }
    escape = (value) => {
        return mysql.escape(value);
    }
}