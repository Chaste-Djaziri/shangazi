"use client";

import { useState } from "react";
import { Star, CheckCircle2 } from "lucide-react";

export default function TestimonialForm() {
  const [formData, setFormData] = useState({
    name: "",
    content: "",
    rating: 5,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsSuccess(true);
        setFormData({ name: "", content: "", rating: 5 });
      } else {
        const data = await res.json();
        setError(data.error || "Failed to submit testimonial");
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white rounded-[40px] p-10 text-center shadow-xl shadow-primary/5 border border-primary/10 max-w-2xl mx-auto">
        <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6 text-[#1d5c19]">
          <CheckCircle2 size={40} />
        </div>
        <h3 className="text-2xl font-serif text-gray-900 mb-2">Murakoze!</h3>
        <p className="text-gray-500 font-marcellus mb-8">
          Your testimonial has been submitted and will be visible after a quick review.
        </p>
        <button 
          onClick={() => setIsSuccess(false)}
          className="text-primary font-bold uppercase tracking-widest text-xs hover:underline"
        >
          Submit another one
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center">
        {/* Left Side: Inspiration Content */}
        <div className="lg:col-span-5 text-left">
          <h2 className="text-4xl lg:text-5xl font-serif text-gray-900 mb-6 leading-tight">
            Your Story Can <span className="text-[#1d5c19] italic">Inspire</span> Others.
          </h2>
          <p className="text-lg text-gray-500 font-marcellus leading-relaxed mb-10">
            Has Shangazi Emma Claudine helped you find your path? Whether it was a piece of guidance, a course, or an honest conversation, we&apos;d love to hear about your experience. 
          </p>
          
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1d5c19]/5 flex items-center justify-center text-[#1d5c19]">
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h4 className="font-serif font-bold text-gray-900 text-lg">Community Impact</h4>
                <p className="text-sm text-gray-400 font-marcellus">Join thousands who have shared their growth.</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#1d5c19]/5 flex items-center justify-center text-[#1d5c19]">
                <Star size={24} fill="#1d5c19" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-gray-900 text-lg">Trusted Guidance</h4>
                <p className="text-sm text-gray-400 font-marcellus">Authentic reviews from real portal members.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="lg:col-span-7">
          <div className="bg-white rounded-[48px] p-8 lg:p-12 shadow-2xl shadow-primary/5 border border-gray-100">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-4">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="How should we call you?"
                  className="w-full bg-gray-50 border border-transparent rounded-3xl px-6 py-5 outline-none focus:bg-white focus:border-primary/20 transition-all font-marcellus text-gray-900"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-4">
                  Rating
                </label>
                <div className="flex gap-2 ml-4 bg-[#1d5c19]/5 p-3 rounded-2xl w-fit">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className="transition-all hover:scale-125"
                    >
                      <Star 
                        size={28} 
                        fill={star <= formData.rating ? "#1d5c19" : "#ffffff"} 
                        className={star <= formData.rating ? "text-[#1d5c19]" : "text-white drop-shadow-sm"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="content" className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-4">
                  Your Message
                </label>
                <textarea
                  id="content"
                  required
                  rows={4}
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Tell us about your experience..."
                  className="w-full bg-gray-50 border border-transparent rounded-[32px] px-6 py-5 outline-none focus:bg-white focus:border-primary/20 transition-all font-marcellus text-gray-900 resize-none"
                />
              </div>

              {error && (
                <p className="text-red-500 text-sm ml-4 font-marcellus">{error}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#1d5c19] text-white py-6 rounded-3xl font-bold uppercase tracking-widest text-[11px] hover:opacity-95 transition-all shadow-xl shadow-[#1d5c19]/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
              >
                {isSubmitting ? "Submitting..." : "Share My Story"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
