// No react-bootstrap imports needed anymore
import React from 'react'

interface CheckoutStepsProps {
  step1?: boolean
  step2?: boolean
  step3?: boolean
  step4?: boolean
}

export default function CheckoutSteps({
  step1 = false,
  step2 = false,
  step3 = false,
  step4 = false,
}: CheckoutStepsProps) {
  const steps = [
    { name: 'Sign-In', completed: step1 },
    { name: 'Shipping', completed: step2 },
    { name: 'Payment', completed: step3 },
    { name: 'Place Order', completed: step4 },
  ]

  return (
    <div className="flex flex-wrap justify-center gap-4 md:gap-8 my-4">
      {steps.map((step, idx) => (
        <React.Fragment key={step.name}>
          <div
            className={`
              text-sm md:text-base font-medium px-2 py-1
              ${step.completed
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-400 border-b-2 border-transparent'
              }
            `}
          >
            {step.name}
          </div>
          {idx < steps.length - 1 && (
            <div className="text-gray-300 hidden md:block">→</div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}