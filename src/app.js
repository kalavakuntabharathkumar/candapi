const express=require('express'); const cors=require('cors'); const helmet=require('helmet'); const rateLimit=require('express-rate-limit'); const swaggerUi=require('swagger-ui-express'); const routes=require('./routes');
const app=express();app.use(helmet());app.use(cors());app.use(express.json({limit:'1mb'}));app.use(rateLimit({windowMs:60_000,limit:240,standardHeaders:true,legacyHeaders:false}));
app.get('/',(req,res)=>res.json({service:'Candidate Application API',docs:'/docs',health:'/api/health'}));
app.use('/api',routes);app.use('/docs',swaggerUi.serve,swaggerUi.setup(require('./openapi.json')));
app.use((req,res)=>res.status(404).json({error:'Route not found'}));
app.use((err,req,res,next)=>{if(err.code==='23505')return res.status(409).json({error:'A record with these unique fields already exists'});if(err.code==='23503')return res.status(400).json({error:'Referenced record does not exist'});console.error(err);res.status(500).json({error:'Internal server error'});});
module.exports=app;
