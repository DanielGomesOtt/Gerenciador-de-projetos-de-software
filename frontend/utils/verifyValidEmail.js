export const isValidEmail = (email) => {
    let regex =  /\S+@\S+\.\S+/;
    return regex.test(email);
}

