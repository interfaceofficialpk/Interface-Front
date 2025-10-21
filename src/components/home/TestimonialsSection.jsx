import { useState, useEffect, useRef } from "react";
import { useSwipeable } from "react-swipeable"; // Import the hook

const testimonials = [
  {
    name: "Harira Butt",
    university: "University of Regina, Canada",
    image: "harira.png",
    quote:
      "Hi, I’m Harira. When I decided to pursue my Master’s, I felt overwhelmed but Interface made the entire process so much easier. From shortlisting universities to finalizing my visa, their team supported me every step of the way. They were patient, responsive, even on weekends, and truly cared about getting everything just right. I highly recommend Interface, especially if you’re planning to study in Canada!",
  },
  {
    name: "AbuBakar",
    university: "University of Calgary, Canada",
    image: "/AbuBakar.png",
    quote:
      "Interface made my study visa journey smooth and stress free. Their professional and supportive team guided me through every step, from documents to unexpected challenges. Thanks to them, I secured admission to the Master of Civil Engineering program at the University of Calgary and received my Canadian visa without hassle. Highly recommended!",
  },
  {
    name: "Moeez Bakhsh",
    university: "Trinity Western University, Canada",
    image: "/Moeez.png",
    quote:
      "Interface played a key role in my journey to Canada. Their team supported me at every step, from admission to visa approval. I’m truly grateful for their guidance and professionalism throughout the process.",
  },
  {
    name: "Imtinan Butt",
    university: "Birmingham City University, UK",
    image: "Imtinan Butt.png",
    quote:
      "Interface guided me through every step of the visa process, even during the challenging moments. Their support never wavered, and thanks to them, I’m now pursuing my dream in the UK. I highly recommend Interface to anyone planning to study abroad!",
  },
  {
    name: "Hassan Nisar",
    university: "Trinity Western University, Canada",
    image: "Hassan Nisar.png",
    quote:
      "Interface supported me throughout the entire process of securing my Canadian student visa. From document preparation to visa filing and biometrics, their team handled everything with professionalism and efficiency. I highly recommend Interface for anyone planning to study abroad!",
  },
  {
    name: "Talal Khalid",
    university: "Trinity Western University, Canada",
    image: "Talal Khalid.png",
    quote:
      "Assalamualaikum, my name is Talal Khalid, and I’m pursuing a Master’s in Healthcare at Trinity Western University. I want to express my sincere gratitude to the entire team at Interface for their continuous support throughout my visa process. If you’re planning to study abroad, I highly recommend Interface for their exceptional service!",
  },
  {
    name: "Haris Khan",
    university: "University of New Brunswick, Canada",
    image: "Haris Khan.jpg",
    quote:
      "Hello, my name is Haris Khan and I’m currently pursuing my MBA in Data Analytics at the prestigious University of New Brunswick. I’m incredibly thankful to Interface for their support and guidance throughout my process. Their contribution made it possible for me to get here, and I highly recommend them to anyone planning their study abroad journey!",
  },
  {
    name: "Mohammad Haris",
    university: "Lakehead University, Canada",
    image: "Hairs!.png",
    quote:
      "Hello everyone, this is Mohammad Haris. I’m currently in my second semester at Lakehead University, and I just wanted to share how smooth my journey has been thanks to Interface. From documentation to final arrangements, everything was handled professionally. If you’re looking for a reliable and dedicated team, I definitely recommend them!",
  },
  {
    name: "Muhammad Usama Majeed",
    university: "University of Windsor, Canada",
    image: "Muhammad Usama Majeed.jpg",
    quote:
      "With 72%, I wasn’t sure I’d get into a top Canadian university, but Interface made it happen. Their guidance throughout the application process helped me secure admission to the Master’s in Biotechnology at Windsor. Highly recommended!",
  },
  {
    name: "Mehru Nisa",
    university: "Trent University, Canada",
    image: "https://ui-avatars.com/api/?name=Mehru+Nisa",
    quote:
      "I got into Trent University’s Master of Management program with a 2.8 CGPA and no English test — all thanks to Interface. Their support and expertise gave me the confidence to pursue my dream.",
  },
  {
    name: "Saud Khan",
    university: "Ontario Tech University, Canada",
    image: "https://ui-avatars.com/api/?name=Saud+Khan",
    quote:
      "With a 2.8 CGPA and 14 backlogs, I thought studying in Canada wasn’t possible. But Interface helped me get into Ontario Tech University’s MEng program and I didn’t even need an English test. Grateful for their help!",
  },
  {
    name: "Zain Ahmed",
    university: "Trinity Western University, Canada",
    image: "Zain Ahmed.jpg",
    quote:
      "Despite graduating in 2019 with a 3.1 CGPA, Interface helped me get into the MBA program at Trinity Western University. Their process was smooth and professional. Thank you, Interface!",
  },
];

const TestimonialsSection = () => {
  const [centerItem, setCenterItem] = useState(1); // Start with the middle item
  const intervalRef = useRef(null);
  const testimonialsCount = testimonials.length; // Store length for easier use

  const startAutoRotation = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    // Only start rotation if there's more than one item
    if (testimonialsCount > 1) {
      intervalRef.current = setInterval(() => {
        setCenterItem((prev) => (prev + 1) % testimonialsCount);
      }, 3000); // Change every 3 seconds
    }
  };

  useEffect(() => {
    startAutoRotation();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
    // Re-run effect if testimonialsCount changes (though unlikely in this example)
  }, [testimonialsCount]);

  const getItemStyles = (index) => {
    const isCenter = centerItem === index;
    const prevItem = (centerItem - 1 + testimonialsCount) % testimonialsCount;
    const nextItem = (centerItem + 1) % testimonialsCount;

    let position = "";
    if (isCenter) {
      position = "transform-none z-10"; // Center item is on top
    } else if (index === nextItem) {
      position = "translate-x-full scale-75 opacity-50 -z-10"; // Item to the right
    } else if (index === prevItem) {
      position = "-translate-x-full scale-75 opacity-50 -z-10"; // Item to the left
    } else {
      // Handle items further away if more than 3 testimonials exist
      // For 3 items, this case might not be strictly needed with the current logic,
      // but good practice for scalability. Let's hide them further away.
      // Determine if it should be far right or far left relative to the center
      const diff = index - centerItem;
      const distance = Math.min(
        Math.abs(diff),
        Math.abs(diff - testimonialsCount),
        Math.abs(diff + testimonialsCount)
      );
      // This simple logic might need refinement for > 3 items for smooth visual stacking
      if (
        (diff > 0 && distance < testimonialsCount / 2) ||
        (diff < 0 && distance > testimonialsCount / 2)
      ) {
        position = "translate-x-[200%] scale-50 opacity-0 -z-20"; // Far right
      } else {
        position = "-translate-x-[200%] scale-50 opacity-0 -z-20"; // Far left
      }
    }

    const size = isCenter ? "scale-110" : ""; // Center is scaled up slightly more

    // Combine position, base scale/opacity (applied if not center), and center-specific scale
    return `absolute w-full cursor-pointer transition-all duration-1000 px-2 md:px-4 ${position} ${size}`;
  };

  const handleTestimonialClick = (index) => {
    if (index === centerItem) return; // Do nothing if clicking the center item
    setCenterItem(index);
    startAutoRotation(); // Reset timer on manual change
  };

  // --- Swipe Handlers ---
  const handleSwipe = (direction) => {
    if (testimonialsCount <= 1) return; // No swipe if only one item

    let newCenterItem;
    if (direction === "left") {
      newCenterItem = (centerItem + 1) % testimonialsCount;
    } else {
      // direction === "right"
      newCenterItem = (centerItem - 1 + testimonialsCount) % testimonialsCount;
    }
    setCenterItem(newCenterItem);
    startAutoRotation(); // Reset timer on swipe
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => handleSwipe("left"),
    onSwipedRight: () => handleSwipe("right"),
    preventDefaultTouchmoveEvent: true, // Prevents page scrolling while swiping component
    trackMouse: true, // Optional: Allows dragging with mouse to trigger swipes
    trackTouch: true, // Enable touch tracking
  });
  // --- End Swipe Handlers ---

  return (
    <div
      id="testimonials"
      className="w-full min-h-screen flex flex-col items-center justify-center text-base-content px-4 py-12 overflow-hidden"
    >
      <div className="text-center mb-8 md:mb-12">
        <h2 className="text-2xl md:text-3xl font-bold text-primary">
          What Our Students Say
        </h2>
        <p className="text-gray-500 mt-2 text-xs md:text-sm max-w-md mx-auto">
          Hear from successful students who used our platform to get into top
          universities.
        </p>
      </div>

      {/* --- Apply swipe handlers here --- */}
      <div
        {...swipeHandlers} // Spread the handlers from useSwipeable
        className="relative w-full max-w-sm md:max-w-lg h-[350px] md:h-[400px] flex items-center justify-center transform-gpu" // Added flex centering
      >
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            // Only allow clicking non-center items to bring them to center
            onClick={() =>
              index !== centerItem && handleTestimonialClick(index)
            }
            className={getItemStyles(index)} // Apply dynamic styles
            style={{ willChange: "transform, opacity, scale" }} // Optimize animation performance
          >
            <div className="flex flex-col items-center gap-2 md:gap-4">
              <div className="avatar">
                <div className="w-16 md:w-24 rounded-full ring ring-primary ring-offset-base-100 ring-offset-2">
                  <img src={testimonial.image} alt={testimonial.name} />
                </div>
              </div>
              <h3 className="text-primary text-base md:text-lg font-bold">
                {testimonial.name}
              </h3>
              <p className="text-gray-500 text-xs md:text-sm font-semibold mb-1">
                {testimonial.university}
              </p>
              <p className="prose prose-xs md:prose-sm text-center text-base-content italic max-w-xs md:max-w-md">
                "{testimonial.quote}"
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Optional: Add Navigation Dots */}
      {/* <div className="flex justify-center gap-2 mt-8">
        {testimonials.map((_, index) => (
          <button
            key={index}
            onClick={() => handleTestimonialClick(index)}
            aria-label={`Go to testimonial ${index + 1}`}
            className={`w-3 h-3 rounded-full transition-colors duration-300 ${
              centerItem === index
                ? "bg-primary"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
          />
        ))}
      </div> */}
    </div>
  );
};

export default TestimonialsSection;
