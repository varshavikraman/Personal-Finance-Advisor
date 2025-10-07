import jwt from 'jsonwebtoken';

function authenticate(req,res,next) {
    const cookie = req.headers.cookie;
    console.log(`Cookie : ${cookie}`);
    if (cookie) {
        const [name, token] = cookie.trim().split('=')
        console.log(`Token name: ${name}`);
        console.log(`Token : ${token}`);
        if (name == 'authToken') {
            const decode = jwt.verify(token,process.env.SECRET_KEY);
            console.log(decode);
            req.email = decode.Email;
            req.name = decode.Name;
            next()
        } else {
            res.status(401).json({msg:'Unauthorized access'});
        }
    } else {
        res.status(404).json({msg:'Cookie not found'});
    }
}

export {authenticate}