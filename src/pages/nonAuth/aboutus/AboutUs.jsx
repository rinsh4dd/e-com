import React from 'react';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            More Than Just Fashion
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Where style meets purpose - crafting timeless pieces since 2015
          </p>
        </div>

        {/* Mission Section */}
        <div className="mb-20 grid md:grid-cols-2 gap-12 items-center">
          <div className="order-2 md:order-1">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">Redefining Modern Fashion</h2>
            <p className="text-lg text-gray-600 mb-4">
              At StyleHub, we're on a mission to transform the fashion industry. We believe what you wear should reflect 
              your values without compromising on style or quality. That's why every piece in our collection is thoughtfully 
              designed with sustainability, comfort, and versatility in mind.
            </p>
            <p className="text-lg text-gray-600">
              From sourcing eco-friendly materials to ensuring fair wages for our artisans, we're committed to transparency 
              at every step of our supply chain. Fashion shouldn't cost the earth - literally or figuratively.
            </p>
          </div>
          <div className="order-1 md:order-2 rounded-xl overflow-hidden shadow-lg transform hover:scale-[1.02] transition duration-300">
            <img 
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" 
              alt="Sustainable fashion production" 
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        </div>

        {/* Stats Section */}
        <div className="mb-20 bg-white py-12 px-8 rounded-xl shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { number: "10K+", label: "Happy Customers" },
              { number: "100%", label: "Ethically Sourced" },
              { number: "5M+", label: "Trees Planted" },
              { number: "24/7", label: "Customer Support" }
            ].map((stat, index) => (
              <div key={index} className="p-4">
                <p className="text-4xl font-bold text-gray-900 mb-2">{stat.number}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">The StyleHub Difference</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Sustainable Practices",
                description: "Our carbon-neutral production process and biodegradable packaging help protect the planet. We've reduced water usage by 75% compared to conventional fashion brands.",
                icon: "🌍"
              },
              {
                title: "Uncompromising Quality",
                description: "Each garment undergoes 20+ quality checks. Our average product lasts 3x longer than fast fashion alternatives, saving you money in the long run.",
                icon: "🔍"
              },
              {
                title: "Empowering People",
                description: "We invest 10% of profits in artisan communities and provide education programs for workers' families. Fashion with a conscience.",
                icon: "✊"
              }
            ].map((value, index) => (
              <div 
                key={index} 
                className="bg-white p-8 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border-l-4 border-indigo-500"
              >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

       

        {/* Customer Testimonials */}
        <div className="mb-20 bg-indigo-50 p-12 rounded-xl">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">What Our Community Says</h2>
          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                quote: "I've never worn clothes that feel this good and do this much good. StyleHub changed how I think about fashion.",
                author: "Sarah K., Loyal Customer Since 2018",
                stars: "★★★★★"
              },
              {
                quote: "The quality surpasses brands twice the price. Knowing the ethical standards makes each purchase meaningful.",
                author: "Michael T., Eco-Conscious Shopper",
                stars: "★★★★★"
              }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white p-8 rounded-lg shadow-sm">
                <p className="text-gray-600 italic mb-4">"{testimonial.quote}"</p>
                <div className="flex justify-between items-center">
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-yellow-500">{testimonial.stars}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-12 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">Become Part of the Movement</h2>
          <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
            Join 50,000+ conscious shoppers who are changing fashion for good. Get exclusive access to new collections, 
            sustainable living tips, and members-only discounts.
          </p>
          <div className="max-w-md mx-auto flex flex-col sm:flex-row gap-4">
            <input 
              type="email" 
              placeholder="rinshadcontacts@gmail.com" 
              className="flex-grow px-4 py-3 rounded-lg focus:outline-none"
            />
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition shadow-md">
              Join Now
            </button>
          </div>
          <p className="mt-4 text-sm text-indigo-200">
            We respect your privacy. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;