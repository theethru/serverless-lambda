export const makeTotalPage = (totalCount: number, limit: number) => {
    return Math.round((totalCount / limit) + ((totalCount % limit) > 0 ? 1 : 0));
}
export const makeOffset = (page, limit) => {
    return ((page - 1) * limit);
}
export const checkHasNextPage = (totalCount, offset, limit) => {
    console.log('pagination.helper:checkHasNextPage', totalCount, offset, limit);
    return ((totalCount - (offset + limit)) > 0);
}