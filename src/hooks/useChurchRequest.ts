import { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRef } from "react";
import { submitChurchRequest } from "../services/churchRequestService";
import { z } from "zod";
import { router } from "expo-router";

export function useChurchRequest() {
  // Define the schema locally
  const ChurchRequestFormSchema = z.object({
    churchName: z.string().trim().min(1, 'Church name is required').max(150),
    city: z.string().trim().min(1, 'City is required').max(100),
    leaderName: z.string().trim().min(1, 'Leader name is required').max(100),
    phoneContact: z.string().trim().min(1, 'Phone contact is required').max(20),
    email: z.string().email('Invalid email address').max(255),
  });

  interface FormValues {
    churchName: string;
    city: string;
    leaderName: string;
    phoneContact: string;
    email: string;
  }

  interface FormErrors {
    churchName?: string;
    city?: string;
    leaderName?: string;
    phoneContact?: string;
    email?: string;
  }

  const defaultValues: FormValues = {
    churchName: "",
    city: "",
    leaderName: "",
    phoneContact: "",
    email: "",
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty, isSubmitSuccessful },
  } = useForm<FormValues>({
    resolver: zodResolver(ChurchRequestFormSchema),
    mode: "onBlur",
    defaultValues,
  });

  const onSubmit = useCallback(
    async (data: FormValues) => {
      setIsSubmitting(true);
      setSubmitError(null);
      setFormErrors({});

      try {
        await submitChurchRequest({
          churchName: data.churchName,
          city: data.city,
          leaderName: data.leaderName,
          phoneContact: data.phoneContact,
          email: data.email,
        });
        // On success, navigate to confirmation screen
        router.push("/church-request-confirmation");
      } catch (error: any) {
        // Handle backend validation errors mapped to formErrors state
        if (error?.code && error?.details) {
          const details = error.details as Record<string, string[]>;
          // Map backend errors to formErrors state
          if (details.churchName) {
            setFormErrors((prev) => ({ ...prev, churchName: details.churchName[0] }));
          }
          if (details.city) {
            setFormErrors((prev) => ({ ...prev, city: details.city[0] }));
          }
          if (details.leaderName) {
            setFormErrors((prev) => ({ ...prev, leaderName: details.leaderName[0] }));
          }
          if (details.phoneContact) {
            setFormErrors((prev) => ({ ...prev, phoneContact: details.phoneContact[0] }));
          }
          if (details.email) {
            setFormErrors((prev) => ({ ...prev, email: details.email[0] }));
          }
        }
        setSubmitError(
          error?.message || "Failed to submit church request. Please try again."
        );
      } finally {
        setIsSubmitting(false);
      }
    },
    []
  );

  return {
    register,
    handleSubmit,
    control,
    errors,
    formErrors,
    isSubmitting,
    submitError,
    isDirty,
    isSubmitSuccessful,
    onSubmit,
  };
}