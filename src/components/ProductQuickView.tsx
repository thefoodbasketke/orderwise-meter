import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, MessageCircle, ArrowRight, FileText, Tag } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  stock: number;
  category: string | null;
  specifications?: string | null;
  catalogue_pdf_url?: string | null;
  label?: string | null;
}

interface ProductQuickViewProps {
  product: Product | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProductQuickView({ product, open, onOpenChange }: ProductQuickViewProps) {
  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6">
          {/* Product Image */}
          <div className="aspect-square bg-muted rounded-lg overflow-hidden">
            {product.image_url ? (
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="h-20 w-20 text-muted-foreground/30" />
              </div>
            )}
          </div>
          
          {/* Product Details */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              {product.label && (
                <Badge className="bg-accent text-accent-foreground">
                  <Tag className="h-3 w-3 mr-1" />
                  {product.label}
                </Badge>
              )}
              {product.category && (
                <Badge variant="secondary">{product.category}</Badge>
              )}
              <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
              </Badge>
            </div>
            
            <p className="text-2xl font-bold text-primary mb-4">
              KSh {product.base_price.toLocaleString()}
            </p>
            
            <p className="text-muted-foreground mb-4 flex-1">
              {product.description || "No description available"}
            </p>
            
            {product.specifications && (
              <div className="mb-4">
                <h4 className="font-semibold text-sm mb-2">Specifications</h4>
                <p className="text-sm text-muted-foreground whitespace-pre-line">
                  {product.specifications}
                </p>
              </div>
            )}
            
            {product.catalogue_pdf_url && (
              <a
                href={product.catalogue_pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-primary hover:underline mb-4"
              >
                <FileText className="h-4 w-4" />
                View Product Catalogue
              </a>
            )}
            
            <div className="space-y-2 mt-auto">
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/254700444448?text=${encodeURIComponent(`Hi, I'd like to order: ${product.name} (KSh ${product.base_price.toLocaleString()})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button className="w-full bg-green-600 hover:bg-green-700" disabled={product.stock === 0}>
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Order via WhatsApp
                  </Button>
                </a>
              </div>
              
              <Link to={`/products/${product.id}`} className="block" onClick={() => onOpenChange(false)}>
                <Button variant="outline" className="w-full">
                  View Full Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
