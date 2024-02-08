import { z } from 'zod';

export const numberEnum = <Num extends number, T extends Readonly<Num[]>>(
  args: T,
): z.ZodSchema<T[number]> => {
  return z.custom<T[number]>((val: unknown) => {
    if (typeof val !== 'number') {
      return false;
    }
    if (!args.includes(val as T[number])) {
      return false;
    }
    return true;
  });
};

export const participantIdentifierSchema = z
  .string()
  .min(1, { message: 'Identifier cannot be empty' })
  .max(255, { message: 'Identifier too long. Maxiumum of 255 characters.' });

export const participantIdSchema = z
  .string()
  .min(1, { message: 'Identifier cannot be empty' })
  .max(255, { message: 'Identifier too long. Maxiumum of 255 characters.' });

export const participantListInputSchema = z.array(participantIdentifierSchema);

export const updateSchema = z.object({
  identifier: participantIdentifierSchema,
  newIdentifier: participantIdentifierSchema,
});
