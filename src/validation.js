const { z } = require('zod');
const candidateSchema=z.object({full_name:z.string().trim().min(2).max(160),email:z.string().trim().email().max(254),phone:z.string().trim().max(40).optional().nullable()});
const jobSchema=z.object({title:z.string().trim().min(2).max(180),department:z.string().max(120).optional(),location:z.string().max(120).optional(),employment_type:z.enum(['full-time','part-time','contract','internship']).optional(),description:z.string().max(10000).optional()});
const applicationSchema=z.object({candidate_id:z.coerce.number().int().positive(),job_id:z.coerce.number().int().positive(),source:z.string().max(80).optional()});
module.exports={candidateSchema,jobSchema,applicationSchema};
