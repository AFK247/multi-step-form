import type { FormData } from "@/components/multi-step-form";

interface ReviewStepProps {
  formData: FormData;
}

export default function ReviewStep({ formData }: ReviewStepProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-800">
          Review Your Information
        </h2>
        <p className="text-slate-600 mt-1">
          Please review your information before submitting.
        </p>
      </div>

      <div className="space-y-4 bg-slate-50 p-4 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-slate-700 mb-2">
              Personal Information
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-slate-600">
                  Full Name:
                </span>
                <p className="text-slate-800">{formData.name}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">
                  Email Address:
                </span>
                <p className="text-slate-800">{formData.email}</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium text-slate-700 mb-2">
              Contact Information
            </h3>
            <div className="space-y-2">
              <div>
                <span className="text-sm font-medium text-slate-600">
                  Address:
                </span>
                <p className="text-slate-800">{formData.address}</p>
              </div>
              <div>
                <span className="text-sm font-medium text-slate-600">
                  Phone Number:
                </span>
                <p className="text-slate-800">{formData.phone}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-medium text-slate-700 mb-2">
            Selected Categories
          </h3>
          {formData.categories.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {formData.categories.map((category) => (
                <span
                  key={category}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800"
                >
                  {category}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-slate-500">No categories selected</p>
          )}
        </div>
      </div>
    </div>
  );
}
