import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface SuccessStepProps {
  onStartNew: () => void;
}

export default function SuccessStep({ onStartNew }: SuccessStepProps) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <div className="mb-6 text-emerald-500">
        <CheckCircle className="h-16 w-16 mx-auto" />
      </div>
      <h2 className="text-2xl font-bold text-slate-800 mb-2">
        Form Has Been Submitted
      </h2>
      <p className="text-slate-600 mb-6 max-w-md">
        Thank you for completing the form. Your information has been
        successfully submitted.
      </p>
      <Button onClick={onStartNew}>Submit Another Response</Button>
    </div>
  );
}
