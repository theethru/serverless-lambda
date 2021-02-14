import { BadRequestException } from '../exceptions/common.exception';
import * as urlHelper from '../helpers/url.helper';
import * as commonHelper from '../helpers/common.helper';

export const getContentTypeByFileName = (filename) => {
    const filenames = filename.split('.')[1];
    if (filenames.length <= 1) {
        throw new BadRequestException('Wrong image file name');
    }
    const ext = filenames.toLowerCase();
    switch (ext) {
        case 'jpg':
        case 'jpeg':
            return 'image/jpeg';
        case 'png':
            return 'image/png';
        case 'gif':
            return 'image/gif';
        default:
            return null;
    };
}

export const makeImageInfo = (imageInfo: any) => {
    console.log('image.helper:makeImageInfo', imageInfo);

    if ('string' === typeof imageInfo) {
        imageInfo = commonHelper.jsonParse(imageInfo);
    }

    if (!imageInfo) {
        return null;
    } else if (!imageInfo.uri) {
        return null;
    }

    imageInfo['url'] = urlHelper.makeImageS3Url(imageInfo.uri);

    console.log('imageInfo', imageInfo);
    return imageInfo;
}