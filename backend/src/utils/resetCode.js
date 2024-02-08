function getResetCode(){
    const numbers = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
    let code = '';
    for(let i = 0; i < 6; i++){
        code += Math.floor(Math.random() * numbers.length);
    }
    return code;
}

module.exports = { getResetCode };