import { Check } from "lucide-react"

interface Step {
  id: number
  label: string
}

interface StepIndicatorProps {
  steps: Step[]
  currentStep: number
}

export default function StepIndicator({ steps, currentStep }: StepIndicatorProps) {
  return (
    <div className="relative">
      {/* Horizontal line */}
      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 z-0" />

      {/* Steps */}
      <div className="relative z-10 flex justify-between">
        {steps.map((step) => {
          const isActive = currentStep === step.id
          const isCompleted = currentStep > step.id

          return (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                  isActive
                    ? "border-emerald-500 bg-emerald-500 text-white"
                    : isCompleted
                      ? "border-emerald-500 bg-emerald-500 text-white"
                      : "border-gray-300 bg-white text-gray-500"
                }`}
              >
                {isCompleted ? <Check className="h-5 w-5" /> : <span>{step.id}</span>}
              </div>
              <span
                className={`mt-2 text-sm ${
                  isActive ? "text-emerald-600 font-medium" : isCompleted ? "text-emerald-600" : "text-gray-500"
                }`}
              >
                {step.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
