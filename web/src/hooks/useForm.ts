/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

export type FormChangeEvent =
  | React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  | { target: { name?: string; value: any } };

interface UseFormOptions<T> {
  numberFields?: (keyof T | string)[];
  customHandlers?: Partial<
    Record<keyof T | string, (value: any, prev: T) => Partial<T>>
  >;
}

export default function useForm<T extends Record<string, any>>(
  initialState: T,
  options: UseFormOptions<T> = {},
) {
  const [formData, setFormData] = useState<T>(initialState);

  const handleChange = (e: FormChangeEvent) => {
    const { name, value } = e.target;
    if (!name) return;

    // 1. Kiểm tra nếu có Custom Handler (Ví dụ: chọn icon tự động set color)
    if (options.customHandlers && options.customHandlers[name]) {
      const customEffect = options.customHandlers[name]!(value, formData);
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        ...customEffect,
      }));
      return;
    }

    // 2. Kiểm tra nếu là Number field
    const isNumberField = options.numberFields?.includes(name);

    // 3. Set state thông thường
    setFormData((prev) => ({
      ...prev,
      [name]: isNumberField ? Number(value) || 0 : value,
    }));
  };

  const resetForm = () => setFormData(initialState);

  return {
    formData,
    setFormData,
    handleChange,
    resetForm,
  };
}
