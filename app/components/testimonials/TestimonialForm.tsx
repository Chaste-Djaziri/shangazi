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
    <div className="bg-white rounded-[40px] p-8 lg:p-12 shadow-2xl shadow-primary/5 border border-gray-100 max-w-2xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-serif text-gray-900 mb-2">Share Your Story</h2>
        <p className="text-gray-500 font-marcellus">How has Shangazi Emma Claudine impacted your life?</p>
      </div>

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
            className="w-full bg-gray-50 border border-transparent rounded-3xl px-6 py-4 outline-none focus:bg-white focus:border-primary/20 transition-all font-marcellus text-gray-900"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 ml-4">
            Rating
          </label>
          <div className="flex gap-2 ml-4">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setFormData({ ...formData, rating: star })}
                className="transition-transform hover:scale-110"
              >
                <Star 
                  size={24} 
                  fill={star <= formData.rating ? "#1d5c19" : "none"} 
                  className={star <= formData.rating ? "text-[#1d5c19]" : "text-gray-300"}
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
            className="w-full bg-gray-50 border border-transparent rounded-[32px] px-6 py-4 outline-none focus:bg-white focus:border-primary/20 transition-all font-marcellus text-gray-900 resize-none"
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm ml-4 font-marcellus">{error}</p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#1d5c19] text-white py-5 rounded-3xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-xl shadow-[#1d5c19]/20 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? "Submitting..." : "Send Testimonial"}
        </button>
      </form>
    </div>
  );
}
