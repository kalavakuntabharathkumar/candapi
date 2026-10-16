require('dotenv').config();const {Worker}=require('bullmq');const IORedis=require('ioredis');const {query,pool}=require('./db/pool');
const connection=new IORedis(process.env.REDIS_URL||'redis://127.0.0.1:6379',{maxRetriesPerRequest:null});
const worker=new Worker('resume-processing',async job=>{const id=Number(job.data.resumeId);await query("UPDATE resumes SET status='processing' WHERE id=$1",[id]);try{
// Demo parser placeholder: replace with a real parser that reads the private object_key from S3 or secure storage.
const r=await query('SELECT id,candidate_id,object_key FROM resumes WHERE id=$1',[id]);if(!r.rowCount)throw new Error('Resume record not found');
const parsed={parser:'demo',source_key:r.rows[0].object_key,extracted_at:new Date().toISOString(),skills:[],experience_years:null,notice:'Connect a real resume parser for extracted fields.'};
await query("UPDATE resumes SET status='completed',parsed_data=$1,error_message=NULL WHERE id=$2",[JSON.stringify(parsed),id]);await query("UPDATE resume_jobs SET state='completed',attempts=$1,completed_at=NOW() WHERE resume_id=$2",[job.attemptsMade+1,id]);return {resumeId:id,status:'completed'};
}catch(e){await query("UPDATE resumes SET status='failed',error_message=$1 WHERE id=$2",[e.message,id]);await query("UPDATE resume_jobs SET state='failed',attempts=$1 WHERE resume_id=$2",[job.attemptsMade+1,id]);throw e;}},{connection,concurrency:5});
worker.on('completed',job=>console.log(`Resume job ${job.id} completed`));worker.on('failed',(job,err)=>console.error(`Resume job ${job?.id} failed: ${err.message}`));
const shutdown=async()=>{await worker.close();await connection.quit();await pool.end();process.exit(0)};process.on('SIGTERM',shutdown);process.on('SIGINT',shutdown);
