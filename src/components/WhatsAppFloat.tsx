import { MessageCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useState, useRef } from "react";

export function WhatsAppFloat() {
  const phoneNumber = "254700444448";
  const message = encodeURIComponent("Hi, I'd like to enquire about your products and services.");
  const constraintsRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  return (
    <>
      {/* Invisible constraints container */}
      <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40" />
      
      <motion.a
        href={`https://wa.me/${phoneNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 cursor-grab active:cursor-grabbing"
        aria-label="Contact us on WhatsApp"
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.1}
        dragMomentum={false}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        whileDrag={{ scale: 1.15 }}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setTimeout(() => setIsDragging(false), 100)}
        onClick={(e) => {
          if (isDragging) {
            e.preventDefault();
          }
        }}
      >
        <MessageCircle className="h-6 w-6" />
      </motion.a>
    </>
  );
}
