const crypto = require('crypto');

const generateRandomToken = async () => {
    // const randomBytes = crypto.randomBytes(4); // Generate 4 random bytes  
    // const hexValue = randomBytes.toString('hex'); // Convert the bytes to a hex string  
    // const intValue = parseInt(hexValue, 16); // Convert the hex string to an integer  
    // console.log(intValue)
    return crypto.randomBytes(48).toString('hex');
     
}

module.exports = { generateRandomToken }