
import { Star, Quote } from "lucide-react";

interface CourseReviewsProps {
  t: (key: string) => string;
}

export function CourseReviews({ t }: CourseReviewsProps) {
  const reviews = [
    {
      id: 1,
      name: "Ahmed Hassan",
      date: "2 weeks ago",
      rating: 5,
      content: "This course went beyond my expectations. The curriculum is perfectly structured and the instructor explains complex concepts with ease.",
      avatar: "https://i.pravatar.cc/150?img=11"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      date: "1 month ago",
      rating: 5,
      content: "Highly recommended for anyone looking to understand practical applications. The materials and resources provided are top-notch.",
      avatar: "https://i.pravatar.cc/150?img=5"
    },
    {
      id: 3,
      name: "Rafiqul Islam",
      date: "2 months ago",
      rating: 4,
      content: "Great content and very interactive. I learned a lot. The only thing is I wish there were more quizzes.",
      avatar: "https://i.pravatar.cc/150?img=8"
    }
  ];

  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-8 md:p-10 shadow-[0_8px_30px_rgb(0,0,0,0.04)]" id="reviews">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4 border-b border-slate-100 pb-6">
        <div>
           <h2 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
             {t("courseDetails.reviews")}
           </h2>
           <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 bg-amber-50 px-3 py-1.5 rounded-full ring-1 ring-amber-100">
                <Star className="w-4 h-4 fill-current text-amber-500" />
                <span className="text-lg font-black text-slate-900">4.8</span>
              </div>
              <span className="text-slate-500 font-medium text-sm">Course Rating &bull; 124 Ratings</span>
           </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {reviews.map((review) => (
          <div key={review.id} className="border border-slate-100 rounded-2xl p-6 bg-slate-50/50 hover:bg-white hover:shadow-lg hover:border-slate-200 transition-all group">
             <div className="flex items-center gap-4 mb-5">
               <div className="relative">
                 <img src={review.avatar} alt={review.name} className="w-12 h-12 rounded-full object-cover ring-2 ring-white shadow-md" />
               </div>
               <div>
                  <h4 className="font-bold text-slate-900 text-[15px]">{review.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-3.5 h-3.5 ${i < review.rating ? "fill-current" : "text-slate-200"}`} />
                      ))}
                    </div>
                    <span className="text-xs text-slate-400 font-medium">{review.date}</span>
                  </div>
               </div>
             </div>
             <div className="relative">
               <Quote className="w-5 h-5 text-slate-200 mb-2 rotate-180" />
               <p className="text-slate-600 text-sm leading-relaxed">{review.content}</p>
             </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center">
         <button className="text-primary font-semibold hover:text-white bg-primary/10 hover:bg-primary px-8 py-3 rounded-xl transition-all shadow-sm text-sm">
            Show more reviews
         </button>
      </div>
    </div>
  );
}
