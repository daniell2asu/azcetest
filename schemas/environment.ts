import { z } from 'zod';
import { zfd } from 'zod-form-data';

export const createEnvironmentSchema = z.object({
  UPLOADTHING_SECRET: z.string().min(10, { message: 'Must be 10 characters' }),
  UPLOADTHING_APP_ID: z.string().min(10, { message: 'Must be 10 characters' }),
  PUBLIC_URL: z.string().optional(),
  INSTALLATION_ID: z.string().optional(),
});

export const createEnvironmentFormSchema = zfd.formData(
  createEnvironmentSchema,
);
