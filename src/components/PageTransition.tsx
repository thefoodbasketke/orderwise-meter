 import { motion } from "framer-motion";
 import { ReactNode } from "react";
 
 interface PageTransitionProps {
   children: ReactNode;
 }
 
 const pageVariants = {
   initial: {
     opacity: 0,
     y: 20,
     scale: 0.98,
   },
   animate: {
     opacity: 1,
     y: 0,
     scale: 1,
   },
   exit: {
     opacity: 0,
     y: -20,
     scale: 0.98,
   },
 };
 
 export const PageTransition = ({ children }: PageTransitionProps) => {
   return (
     <motion.div
       initial="initial"
       animate="animate"
       exit="exit"
       variants={pageVariants}
      transition={{
        type: "tween",
        ease: [0.25, 0.1, 0.25, 1],
        duration: 0.4,
      }}
     >
       {children}
     </motion.div>
   );
 };
 
 // Simpler fade transition for modals and overlays
 export const FadeTransition = ({ children }: PageTransitionProps) => {
   return (
     <motion.div
       initial={{ opacity: 0 }}
       animate={{ opacity: 1 }}
       exit={{ opacity: 0 }}
       transition={{ duration: 0.2 }}
     >
       {children}
     </motion.div>
   );
 };
 
 // Slide up transition for bottom sheets
 export const SlideUpTransition = ({ children }: PageTransitionProps) => {
   return (
     <motion.div
       initial={{ opacity: 0, y: 100 }}
       animate={{ opacity: 1, y: 0 }}
       exit={{ opacity: 0, y: 100 }}
       transition={{ type: "spring", damping: 25, stiffness: 300 }}
     >
       {children}
     </motion.div>
   );
 };