import { useState, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { z } from "zod";
import { Card, CardContent } from "@/components/ui/card";
import StepIndicator from "@/components/step-indicator";
import PersonalInfoStep from "@/components/steps/personal-info-step";
import ContactInfoStep from "@/components/steps/contact-info-step";
import CategoriesStep from "@/components/steps/categories-step";
import ReviewStep from "@/components/steps/review-step";
import SuccessStep from "@/components/steps/success-step";
import { formSchema } from "@/lib/schema";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

export type FormData = z.infer<typeof formSchema>;

const STEPS = [
  { id: 1, label: "Personal Info" },
  { id: 2, label: "Contact Info" },
  { id: 3, label: "Categories" },
  { id: 4, label: "Review" },
];

const FORM_STORAGE_KEY = "multi-step-form-data";
const CURRENT_STEP_KEY = "multi-step-form-current-step";
const SUBMISSIONS_KEY = "form-submissions";

export default function MultiStepForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [submissions, setSubmissions] = useState<FormData[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  const methods = useForm<FormData>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      email: "",
      address: "",
      phone: "",
      categories: [],
    },
  });

  const { handleSubmit, reset, formState, getValues, trigger } = methods;

  // Load saved form data, current step, and submissions from localStorage on initial render
  useEffect(() => {
    const savedFormData = localStorage.getItem(FORM_STORAGE_KEY);
    const savedStep = localStorage.getItem(CURRENT_STEP_KEY);
    const savedSubmissions = localStorage.getItem(SUBMISSIONS_KEY);

    if (savedFormData) {
      const parsedData = JSON.parse(savedFormData);
      Object.keys(parsedData).forEach((key) => {
        methods.setValue(key as keyof FormData, parsedData[key]);
      });
    }

    if (savedStep) {
      const parsedStep = parseInt(savedStep, 10);
      // Validate the saved step is within valid range
      if (parsedStep >= 1 && parsedStep <= STEPS.length) {
        setCurrentStep(parsedStep);
      }
    }

    if (savedSubmissions) {
      setSubmissions(JSON.parse(savedSubmissions));
    }

    setIsLoaded(true);
  }, [methods]);

  // Save form data and current step to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded && !isSubmitted) {
      const currentValues = getValues();
      localStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(currentValues));
      localStorage.setItem(CURRENT_STEP_KEY, currentStep.toString());
    }
  }, [getValues, currentStep, formState, isSubmitted, isLoaded]);

  const onSubmit = (data: FormData) => {
    const newSubmissions = [...submissions, data];
    setSubmissions(newSubmissions);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(newSubmissions));
    // Clear form data and current step from localStorage after successful submission
    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem(CURRENT_STEP_KEY);
    setIsSubmitted(true);
    reset();
  };

  const handleNext = async () => {
    const fieldsToValidate = getFieldsToValidate(currentStep);
    const isValid = await trigger(fieldsToValidate);

    if (isValid) {
      if (currentStep < STEPS.length) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit(onSubmit)();
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleReset = () => {
    reset();
    setCurrentStep(1);
    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem(CURRENT_STEP_KEY);
  };

  const startNewForm = () => {
    setIsSubmitted(false);
    setCurrentStep(1);
    // Ensure localStorage is cleared when starting a new form
    localStorage.removeItem(FORM_STORAGE_KEY);
    localStorage.removeItem(CURRENT_STEP_KEY);
  };

  const getFieldsToValidate = (step: number): Array<keyof FormData> => {
    switch (step) {
      case 1:
        return ["name", "email"];
      case 2:
        return ["address", "phone"];
      case 3:
        return ["categories"];
      default:
        return [];
    }
  };

  const renderStepContent = () => {
    if (isSubmitted) {
      return <SuccessStep onStartNew={startNewForm} />;
    }

    switch (currentStep) {
      case 1:
        return <PersonalInfoStep />;
      case 2:
        return <ContactInfoStep />;
      case 3:
        return <CategoriesStep />;
      case 4:
        return <ReviewStep formData={getValues()} />;
      default:
        return null;
    }
  };

  const handleDeleteSubmission = (indexToDelete: number) => {
    const updatedSubmissions = submissions.filter(
      (_, index) => index !== indexToDelete
    );
    setSubmissions(updatedSubmissions);
    localStorage.setItem(SUBMISSIONS_KEY, JSON.stringify(updatedSubmissions));
  };

  return (
    <div className="container max-w-4xl mx-auto px-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">
          Multi-Step Form
        </h1>
        <p className="text-slate-600">
          Complete all steps to submit your information
        </p>
      </div>

      <FormProvider {...methods}>
        <Card className="shadow-md">
          <CardContent className="p-6">
            {!isSubmitted && (
              <div className="mb-8">
                <StepIndicator steps={STEPS} currentStep={currentStep} />
              </div>
            )}

            {renderStepContent()}

            {!isSubmitted && (
              <div className="flex justify-between mt-8">
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    onClick={handleReset}
                    type="button"
                    className="cursor-pointer hover:cursor-pointer"
                  >
                    Reset
                  </Button>
                </div>
                <div className="space-x-2">
                  {currentStep > 1 && (
                    <Button
                      variant="outline"
                      onClick={handlePrevious}
                      type="button"
                      className="cursor-pointer hover:cursor-pointer"
                    >
                      Previous
                    </Button>
                  )}
                  <Button
                    onClick={handleNext}
                    type="button"
                    className="cursor-pointer hover:cursor-pointer"
                  >
                    {currentStep < STEPS.length ? "Next" : "Submit"}
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </FormProvider>

      {submissions.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Previous Submissions</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {submissions.map((submission, index) => (
              <Card key={index} className="shadow-sm relative">
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-medium mb-2">Submission {index + 1}</h3>
                    <button
                      onClick={() => handleDeleteSubmission(index)}
                      className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer hover:cursor-pointer"
                      aria-label="Delete submission"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="text-sm space-y-1">
                    {Object.entries(submission).map(([key, value]) => (
                      <div key={key} className="flex items-start space-x-2">
                        <span className="font-medium text-slate-700">
                          {key.charAt(0).toUpperCase() + key.slice(1)}:
                        </span>
                        <span className="text-slate-600">
                          {Array.isArray(value) ? value.join(", ") : value}
                        </span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
