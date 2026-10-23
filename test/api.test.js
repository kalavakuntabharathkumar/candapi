const request=require('supertest');const app=require('../src/app');
describe('Candidate API HTTP contract',()=>{
 it('returns service metadata',async()=>{const r=await request(app).get('/').expect(200);if(r.body.service!=='Candidate Application API')throw new Error('unexpected service name');});
 it('returns health without touching external services',async()=>{const r=await request(app).get('/api/health').expect(200);if(r.body.status!=='ok')throw new Error('health not ok');});
 it('rejects unknown routes with JSON',async()=>{const r=await request(app).get('/no-such-route').expect(404);if(!r.body.error)throw new Error('missing error body');});
 it('serves the OpenAPI docs UI',async()=>{await request(app).get('/docs/').expect(200);});
});
