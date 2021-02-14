import * as appModel from '../models/app/app.model';

import * as commonCodeModel from '../models/commonCode.model';

export const getCodeList = async () => {
    console.log('app.service:getInfo');

    const commonCodeList = await commonCodeModel.getList();
    return { commonCodeList };
}