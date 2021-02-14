// const s3ImageUrl = process
const imageCdnUrl = process.env.AWS_URL_IMAGE_CDN;
const imageS3Url = process.env.AWS_URL_IMAGE_S3;

export const makeImageS3Url = (uri) => {
    console.log('url.helper:makeImageS3Url', uri);
    console.log('imageS3Url', imageS3Url);
    try {
        if (uri.indexOf('/') === 0) {
            return imageS3Url + uri;
        } else {
            return imageS3Url + "/" + uri;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
}

export const makeImageCdnUrl = (uri) => {
    try {
        if (uri.indexOf('/') === 0) {
            return imageCdnUrl + uri;
        } else {
            return imageCdnUrl + "/" + uri;
        }
    } catch (err) {
        console.error(err);
        return null;
    }
};