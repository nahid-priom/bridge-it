type StageStep = {
  id: string;
  title: string;
  description: string | null;
  duration_days: number | null;
  sort_order: number;
};

type EcommerceDeliveryTimelineProps = {
  steps: StageStep[];
  deliveryTime?: string | null;
};

export function EcommerceDeliveryTimeline({ steps, deliveryTime }: EcommerceDeliveryTimelineProps) {
  if (!steps.length && !deliveryTime) return null;

  return (
    <section>
      <h2 className="text-2xl font-black mb-2">Delivery Timeline</h2>
      {deliveryTime && (
        <p className="text-text-secondary mb-6">Estimated total delivery: <strong>{deliveryTime}</strong></p>
      )}
      {steps.length > 0 && (
        <ol className="space-y-4 max-w-2xl">
          {steps.map((step, i) => (
            <li key={step.id} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white text-sm font-black flex items-center justify-center shrink-0">
                  {i + 1}
                </div>
                {i < steps.length - 1 && <div className="w-0.5 flex-1 bg-emerald-200 dark:bg-emerald-900/40 my-1" />}
              </div>
              <div className="pb-4">
                <p className="font-semibold">{step.title}</p>
                {step.description && <p className="text-sm text-text-secondary mt-1">{step.description}</p>}
                {step.duration_days != null && step.duration_days > 0 && (
                  <p className="text-xs text-emerald-600 mt-1">{step.duration_days} day{step.duration_days !== 1 ? 's' : ''}</p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
