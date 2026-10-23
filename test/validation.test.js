const {candidateSchema,jobSchema,applicationSchema}=require('../src/validation');
describe('request validation',()=>{
 it('accepts a valid candidate',()=>{if(!candidateSchema.safeParse({full_name:'Asha Rao',email:'asha@example.com'}).success)throw new Error('valid candidate rejected');});
 it('rejects an invalid email',()=>{if(candidateSchema.safeParse({full_name:'Asha Rao',email:'not-an-email'}).success)throw new Error('invalid email accepted');});
 it('requires a job title',()=>{if(jobSchema.safeParse({description:'No title'}).success)throw new Error('missing title accepted');});
 it('requires positive application identifiers',()=>{if(applicationSchema.safeParse({candidate_id:0,job_id:1}).success)throw new Error('invalid IDs accepted');});
});
