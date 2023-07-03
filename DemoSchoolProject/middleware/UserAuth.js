const jwt = require('jsonwebtoken')

/**
 * Middleware to authenticate if user has a valid Authorization token
 * Authorization: Bearer <token>
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Function} next
 */

 const UserAuth = async(req,res,next)=>{
    try{
        let bearerToken = req.header('Authorization');
        console.log(bearerToken)
    

       if(!bearerToken){
            res.json({
                status: 'failed',
                code: HttpStatus.UNAUTHORIZED,
                error: 'Authorization token or api key is required/invalid'
              });
              }else{
                bearerToken = bearerToken.split(' ')[1];
        
                const { userData } = await jwt.verify(bearerToken, process.env.TOKEN_SECRET);
                res.locals.user = userData;
                req.user = userData
            
                res.locals.token = bearerToken;
                next()
                 
            }

        
    }catch(error){
        console.log(error)
        res.json({
            status: 'failed',
            error: 'you are not authorized'
            
        })
    }
}
module.exports=UserAuth;