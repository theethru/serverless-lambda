import * as imageModel from '../models/image.model';
import * as urlHelper from '../helpers/url.helper';

import * as s3Helper from '../helpers/s3.helper';
import * as s3Service from '../services/s3.service';
import * as imageHelper from '../helpers/image.helper';

export const createInfo = async (fileName: string, fileSize: number, width: number, height: number, userId: string) => {
    console.log('image.service:createInfo', fileName, fileSize, width, height);

    const contentType = imageHelper.getContentTypeByFileName(fileName);
    const { id, url, bucket, key } = await s3Service.getPutObjectSignatureUrlForImage(width, height, fileSize, contentType);

    const insertedId = await imageModel.createInfo(id, fileName, fileSize, width, height, bucket, key, userId);
    const imageUrl = urlHelper.makeImageS3Url(key);
    return {
        insertedId,
        imageUrl,
        contentType,
        uploadUrl: url,
    }
}