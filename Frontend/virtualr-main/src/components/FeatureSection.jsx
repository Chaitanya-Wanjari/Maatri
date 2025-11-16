// FeatureSection.jsx
import { features } from "../constants";

const FeatureSection = () => {
  return (
    <section id="features" className="bg-warm-bg py-14 md:py-16">
      <div className="text-center">
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-serif text-warm-primary">
          How Maatri Helps You
        </h2>
        <p className="mt-4 text-lg text-warm-soft max-w-2xl mx-auto">
          Personalized maternal health support through intelligent conversation and trusted resources.
        </p>
      </div>

      <div className="flex flex-wrap justify-center mt-12 gap-6">
        {features.map((feature, index) => (
          <div
            key={index}
            className="w-full sm:w-1/2 lg:w-1/4 bg-warm-cardbg border border-warm-border rounded-lg p-6 text-center"
          >
            <div className="text-warm-primary text-3xl mb-4">{feature.icon}</div>
            <h5 className="text-xl font-semibold text-warm-primary">
              {feature.text}
            </h5>
            <p className="text-md mt-2 text-warm-soft">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;

