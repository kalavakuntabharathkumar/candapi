require('dotenv').config(); const app=require('./app'); const {pool}=require('./db/pool'); const port=process.env.PORT||3000;
const server=app.listen(port,()=>console.log(`Candidate API listening on :${port}`));
if(process.env.RUN_WORKER==='true')require('./worker');
const shutdown=async()=>{server.close(async()=>{await pool.end();process.exit(0);});setTimeout(()=>process.exit(1),10000).unref();};process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);
