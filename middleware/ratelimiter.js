const rateLimit = require('express-rate-limit')



const apiLimiter = (maxNum) => {return rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: maxNum, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  lookup:'headers.x-forwarded-for',
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})}

module.exports = apiLimiter





/*
 //CORS error solution 
    router.use((req,res,next)=>{
        res.setHeader('Access-Control-Allow-Origin','http://localhost:3000');//your frontend origin 
        res.setHeader('Access-Control-Allow-Credentials', true);
        res.setHeader('Access-Control-Allow-Methods','GET,POST,PUT,DELETE,PATCH');
        res.setHeader('Access-Control-Allow-Headers','Content-Type ,Origin, X-Requested-With, Accept, Authorization');
        next();
    })
*/