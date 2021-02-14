const DIGIT = /^(?=.*[0-9])+$/;
const LOWERCASE = /^(?=.*[a-z])+$/;

const EMAIL = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
export const checkIsEmail = str => {
    return EMAIL.test(str);
}

const ALPHABET = /^[A-Za-z]+$/;
export const checkAlphabet = str => {
    return ALPHABET.test(str);
}

const UPPERCASE_ALPHABET = /^[A-Z]+$/;
export const checkUpperCaseAlphabet = str => {
    return UPPERCASE_ALPHABET.test(str);
}

const LOWERCASE_ALPHABET = /^[a-z]+$/;
export const checkLowerCaseAlphabet = str => {
    return LOWERCASE_ALPHABET.test(str);
}

const DIGIT_LOWERCASE_UPPERCASE_SPECIAL_8_16 = `^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}[]:;<>,.?/~_+-=|\]).{8,16}$`;
const DIGIT_ALPHABET_8_20 = /^(?=.*[a-zA-Z])(?=.*[0-9]).{8,20}$/;
export const checkPassword = str => {
    console.log("reg.helper::checkPassword", str);
    if (process.env.STAGE !== 'prod') {
        return true;
    }
    return DIGIT_ALPHABET_8_20.test(str);
}