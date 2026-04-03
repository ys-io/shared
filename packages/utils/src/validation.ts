export interface ValidationResult<T> {
  data: T | null;
  errors: Record<string, string>;
}

export async function validate<T>(
  schema: { validate: (value: unknown, opts?: any) => Promise<T> },
  values: unknown,
): Promise<ValidationResult<T>> {
  try {
    const data = await schema.validate(values, { abortEarly: false });
    return { data, errors: {} };
  } catch (err: any) {
    const errors: Record<string, string> = {};
    if (err.inner) {
      for (const e of err.inner) {
        if (e.path && !errors[e.path]) {
          errors[e.path] = e.message;
        }
      }
    }
    return { data: null, errors };
  }
}
