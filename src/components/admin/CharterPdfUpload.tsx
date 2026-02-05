 import { useState, useRef } from "react";
 import { supabase } from "@/integrations/supabase/client";
 import { Button } from "@/components/ui/button";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { useToast } from "@/hooks/use-toast";
 import { Upload, FileText, Trash2, ExternalLink, Loader2 } from "lucide-react";
 import { motion, AnimatePresence } from "framer-motion";
 
 interface CharterPdfUploadProps {
   currentPdfUrl: string | null;
   onPdfChange: (url: string | null) => void;
 }
 
 export const CharterPdfUpload = ({ currentPdfUrl, onPdfChange }: CharterPdfUploadProps) => {
   const [uploading, setUploading] = useState(false);
   const fileInputRef = useRef<HTMLInputElement>(null);
   const { toast } = useToast();
 
   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
     const file = e.target.files?.[0];
     if (!file) return;
 
     if (file.type !== "application/pdf") {
       toast({
         variant: "destructive",
         title: "Invalid file type",
         description: "Please upload a PDF file",
       });
       return;
     }
 
     if (file.size > 10 * 1024 * 1024) {
       toast({
         variant: "destructive",
         title: "File too large",
         description: "Maximum file size is 10MB",
       });
       return;
     }
 
     setUploading(true);
 
     try {
       const fileName = `customer-service-charter-${Date.now()}.pdf`;
       
       const { error: uploadError } = await supabase.storage
         .from("charter-documents")
         .upload(fileName, file, { upsert: true });
 
       if (uploadError) throw uploadError;
 
       const { data: urlData } = supabase.storage
         .from("charter-documents")
         .getPublicUrl(fileName);
 
       onPdfChange(urlData.publicUrl);
       
       toast({
         title: "Success",
         description: "Charter document uploaded successfully",
       });
     } catch (error: any) {
       toast({
         variant: "destructive",
         title: "Upload failed",
         description: error.message,
       });
     } finally {
       setUploading(false);
       if (fileInputRef.current) {
         fileInputRef.current.value = "";
       }
     }
   };
 
   const handleRemove = () => {
     onPdfChange(null);
   };
 
   return (
     <div className="space-y-3">
       <Label>Customer Service Charter PDF</Label>
       
       <AnimatePresence mode="wait">
         {currentPdfUrl ? (
           <motion.div
             key="preview"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
             className="flex items-center gap-3 p-3 border rounded-lg bg-muted/30"
           >
             <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
               <FileText className="h-5 w-5 text-primary" />
             </div>
             <div className="flex-1 min-w-0">
               <p className="text-sm font-medium truncate">Customer Service Charter</p>
               <p className="text-xs text-muted-foreground">PDF Document</p>
             </div>
             <div className="flex gap-2">
               <Button
                 type="button"
                 variant="outline"
                 size="sm"
                 onClick={() => window.open(currentPdfUrl, "_blank")}
               >
                 <ExternalLink className="h-4 w-4" />
               </Button>
               <Button
                 type="button"
                 variant="destructive"
                 size="sm"
                 onClick={handleRemove}
               >
                 <Trash2 className="h-4 w-4" />
               </Button>
             </div>
           </motion.div>
         ) : (
           <motion.div
             key="upload"
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, y: -10 }}
           >
             <Input
               ref={fileInputRef}
               type="file"
               accept=".pdf"
               onChange={handleFileSelect}
               disabled={uploading}
               className="hidden"
               id="charter-pdf-input"
             />
             <label
               htmlFor="charter-pdf-input"
               className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
                 uploading 
                   ? "bg-muted/50 border-muted cursor-not-allowed" 
                   : "hover:bg-muted/30 hover:border-primary/50"
               }`}
             >
               {uploading ? (
                 <>
                   <Loader2 className="h-8 w-8 text-muted-foreground animate-spin" />
                   <span className="text-sm text-muted-foreground">Uploading...</span>
                 </>
               ) : (
                 <>
                   <Upload className="h-8 w-8 text-muted-foreground" />
                   <span className="text-sm text-muted-foreground">
                     Click to upload PDF (max 10MB)
                   </span>
                 </>
               )}
             </label>
           </motion.div>
         )}
       </AnimatePresence>
     </div>
   );
 };