/* eslint-disable @typescript-eslint/no-explicit-any */
import { z } from "zod";

export type ActionState = {
  error?: string;
  success?: string;
  [key: string]: any;
};

type ValidatedActionFunction<S extends z.ZodType<any, any>, T> = (data: z.infer<S>, formData: FormData) => Promise<T>;

export function validatedAction<S extends z.ZodType<any, any>, T>(schema: S, action: ValidatedActionFunction<S, T>) {
  return async (prevState: ActionState, formData: FormData): Promise<T> => {
    const result = schema.safeParse(Object.fromEntries(formData));
    if (!result.success) {
      return {
        error: result.error.errors[0].message,
        validationErrors: result.error.errors,
        success: false,
      } as T;
    }

    try {
      return await action(result.data, formData);
    } catch (error) {
      console.error(error);
      return {
        error: error instanceof Error ? error.message : "An unexpected error occurred",
        success: false,
      } as T;
    }
  };
}
