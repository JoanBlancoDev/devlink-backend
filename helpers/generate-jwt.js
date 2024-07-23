const jwt = require("jsonwebtoken");

const generateJWT = async ({ username, uid } ) => {
    return new Promise( (resolve, reject) => {
        const payload = { uid, username };

        jwt.sign( payload, process.env.PRIVATE_KEY, {
            expiresIn: '1d'
        }, ( err, token ) => {
            if (err) {
                console.log(err);
                reject('Error generating token!');
            }

            resolve( token );
        } );

    } );
    
}

module.exports = { generateJWT }