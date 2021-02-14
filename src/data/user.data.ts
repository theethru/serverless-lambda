interface IUserData {
    user: object,
    languageCode: string,
    uuid: string,
    deviceCode: string,
}

export default class UserData implements IUserData {
    user: object;
    languageCode: string;
    uuid: string;
    deviceCode: string;

    constructor() {
        this.user = null;
    }

    setLanguageCode(languageCode) {
        this.languageCode = languageCode;
    }
    getLanguageCode() {
        return this.languageCode;
    }
    setDeviceUuid(uuid) {
        this.uuid = uuid;
    }
    getDeviceUuid() {
        return this.uuid;
    }

    setDeviceCode(deviceCode) {
        this.deviceCode = deviceCode;
    }
    getDeviceCode() {
        return this.deviceCode;
    }

    setUser(user) {
        this.user = user;
    }
    getUser() {
        return this.user;
    }

    getValueByAttribute(attr) {
        if (!this.getUser()) {
            return null;
        } else if (this.getUser()[attr] == null) {
            return null;
        } else {
            return this.getUser()[attr];
        }
    }
    getId() {
        return this.getValueByAttribute('id');
    }
    getName() {
        return this.getValueByAttribute('name');
    }
    getEmail() {
        return this.getValueByAttribute('email');
    }
    getGenderCode() {
        return this.getValueByAttribute('genderCode');
    }
    getGenreCodeList() {
        return this.getValueByAttribute('genreCodeList');
    }
}