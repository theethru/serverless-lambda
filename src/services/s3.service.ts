const { BadRequestException, UnknownException } = require('../exceptions/common.exception');

import * as s3Helper from '../helpers/s3.helper';
import * as commonHelper from '../helpers/common.helper';

const AWS = require('aws-sdk');
const s3 = new AWS.S3({ apiVersion: '2006-03-01', signatureVersion: "v4" });

export const getPutObjectSignatureUrl = async (bucket, key, contentType, Metadata = {}) => {
    console.log("getPutObjectSignatureUrl : ", bucket, key, contentType);
    return await new Promise((resolve, reject) => {
        s3.getSignedUrl('putObject', {
            Bucket: bucket,
            Key: key,
            ContentType: contentType,
            Expires: 60,
            Metadata
        }, (err, url) => {
            if (err) {
                reject(err);
            } else {
                resolve(url)
            }
        })
    }).then(result => {
        console.log("getPutObjectSignatureUrl : result", bucket, key, contentType);
        return { url: result, key: key, bucket: bucket, contentType: contentType };
    }).catch(err => {
        throw new Error(err.message);
    })
}

export const getPutObjectSignatureUrlForImage = async (width: number, height: number, filesize: number, contentType: string = 'image/jpeg') => {
    const bucket: string = s3Helper.getImageBucket();
    const today: string = (new Date()).toISOString().substr(0, 10);
    const filename: string = (+ new Date()).toString();
    const ext: string = contentType.split("/")[1];
    const key: string = `${filename}.${ext}`;
    const metaData = {
        filesize: `${filesize}`,
        width: `${width}`,
        height: `${height}`
    }

    const result = await getPutObjectSignatureUrl(bucket, key, contentType, metaData);
    return { id: filename, key, bucket, contentType, url: result.url };
}

export const getObjList = async (bucket, folder) => {
    const params = {
        Bucket: bucket,
        MaxKeys: 100,
    }
    return await new Promise((resolve, reject) => {
        s3.listObjects(params, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    }).catch(err => {
        console.error(err);
        throw new UnknownException(err.message);
    })
}

export const getObj = async (bucket, params) => {
    params['Bucket'] = bucket;
    return await new Promise((resolve, reject) => {
        s3.getObject(params, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    })
}

export const putObj = async (bucket, params) => {
    params['Bucket'] = bucket;
    console.log(params);
    return new Promise((resolve, reject) => {
        s3.putObject(params, (err, result) => {
            if (!err) {
                resolve(result);
            } else {
                reject(err);
            }
        })
    })
    // .then(result => {
    //     return { err: null, data: result };
    // }).catch(err => {
    //     console.error(err);
    //     return { err, data: null };
    // })
}
export const getJsonObj = async (bucket, key) => {
    const params = {
        Key: key,
    };

    return await getObj(bucket, params)
        .then((result: any) => {
            return JSON.parse(result.Body.toString());
        });
}
export const putJsonObj = async (bucket, key, jsonObj) => {
    const params = {
        Key: key,
        Body: JSON.stringify(jsonObj),
        ContentType: 'application/json'
    };

    return await putObj(bucket, params);
}

export const getImageSignedUrl = (key, expires = 10000) => {
    console.log("s3.service:getImageSignedUrl");
    const bucket = s3Helper.getImageBucket();
    return getSignedUrl(bucket, key, expires);
}
export const getSignedUrl = (bucket, key, expires = 604800) => {
    return s3.getSignedUrl('getObject', {
        Bucket: bucket,
        Key: key,
        Expires: expires
    });
}


export const getHeadObject = async (bucket, key) => {
    console.log('s3.service:getHeadObject', bucket, key);
    const params = {
        Bucket: bucket,
        Key: key,
    }
    return await s3.headObject(params).promise()
        .then(result => {
            return result;
        }).catch(err => {
            console.error(err);
            return null;
        })
}

export const copyObject = async (source, destBucket, destKey, metadata) => {
    console.log('s3.service:copyObject', source, destBucket, destKey, metadata);

    const params = {
        Bucket: destBucket,
        Key: destKey,
        CopySource: source,
        MetadataDirective: "REPLACE",
        Metadata: metadata
    }

    console.log(metadata)
    const result = await s3.copyObject(params).promise()
        .catch(err => {
            console.error(err);
            return null;
        });
    return result;
}