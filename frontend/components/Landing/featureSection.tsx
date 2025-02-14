
function FeaturesSection() {
    const features = [
      {
        icon: "💼",
        title: "Components",
        description: "Fully customizable component library"
      },
      {
        icon: "🎨",
        title: "Color Styles",
        description: "Professional color schemes included"
      },
      {
        icon: "📱",
        title: "Mobile Responsive",
        description: "Optimized for all screen sizes"
      }
    ]
  
    return (
      <section className="py-20 px-4 md:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-7xl">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="p-6 rounded-xl bg-white shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-[#1e3a8a] mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )
  }
  export default FeaturesSection;