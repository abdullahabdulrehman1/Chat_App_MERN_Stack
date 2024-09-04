import {isValidUsername} from "6pp"
export const usernameValidation = (name) => {
    if(!isValidUsername(name)) return {isValid: false,errorMessage: "Username is Invalid"}
}