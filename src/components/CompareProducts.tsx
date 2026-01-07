import { useState, useEffect, createContext, useContext } from "react";
import { Link } from "react-router-dom";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Scale, X, Package, ArrowRight, Trash2 } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string | null;
  base_price: number;
  image_url: string | null;
  stock: number;
  category: string | null;
  specifications?: string | null;
}

interface CompareContextType {
  compareList: Product[];
  addToCompare: (product: Product) => void;
  removeFromCompare: (productId: string) => void;
  clearCompare: () => void;
  isInCompare: (productId: string) => boolean;
}

const CompareContext = createContext<CompareContextType | undefined>(undefined);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareList, setCompareList] = useState<Product[]>([]);

  const addToCompare = (product: Product) => {
    if (compareList.length >= 4) {
      return; // Max 4 products
    }
    if (!compareList.find((p) => p.id === product.id)) {
      setCompareList((prev) => [...prev, product]);
    }
  };

  const removeFromCompare = (productId: string) => {
    setCompareList((prev) => prev.filter((p) => p.id !== productId));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const isInCompare = (productId: string) => {
    return compareList.some((p) => p.id === productId);
  };

  return (
    <CompareContext.Provider
      value={{ compareList, addToCompare, removeFromCompare, clearCompare, isInCompare }}
    >
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error("useCompare must be used within a CompareProvider");
  }
  return context;
}

export function CompareButton({ product }: { product: Product }) {
  const { addToCompare, removeFromCompare, isInCompare, compareList } = useCompare();
  const inCompare = isInCompare(product.id);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inCompare) {
      removeFromCompare(product.id);
    } else {
      addToCompare(product);
    }
  };

  return (
    <Button
      size="sm"
      variant={inCompare ? "default" : "outline"}
      onClick={handleClick}
      disabled={!inCompare && compareList.length >= 4}
      title={inCompare ? "Remove from compare" : "Add to compare"}
    >
      <Scale className="h-4 w-4" />
    </Button>
  );
}

export function CompareDrawer() {
  const { compareList, removeFromCompare, clearCompare } = useCompare();
  const [open, setOpen] = useState(false);

  if (compareList.length === 0) return null;

  // Parse specifications into key-value pairs for comparison
  const parseSpecs = (specs: string | null | undefined): Record<string, string> => {
    if (!specs) return {};
    const result: Record<string, string> = {};
    specs.split("\n").forEach((line) => {
      const [key, ...valueParts] = line.split(":");
      if (key && valueParts.length > 0) {
        result[key.trim()] = valueParts.join(":").trim();
      }
    });
    return result;
  };

  // Get all unique spec keys from all products
  const allSpecKeys = Array.from(
    new Set(
      compareList.flatMap((p) => Object.keys(parseSpecs(p.specifications)))
    )
  );

  return (
    <>
      {/* Floating Compare Bar */}
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50">
        <div className="bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-lg flex items-center gap-3">
          <Scale className="h-5 w-5" />
          <span className="font-medium">{compareList.length} product(s) selected</span>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setOpen(true)}
          >
            Compare Now
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="text-primary-foreground hover:text-primary-foreground/80"
            onClick={clearCompare}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Compare Sheet */}
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="h-[85vh]">
          <SheetHeader className="pb-4">
            <SheetTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              Compare Products ({compareList.length})
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(85vh-100px)]">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px]">
                <thead>
                  <tr>
                    <th className="text-left p-3 bg-muted/50 font-medium w-40">Product</th>
                    {compareList.map((product) => (
                      <th key={product.id} className="p-3 bg-muted/50 min-w-[200px]">
                        <div className="relative">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="absolute -top-1 -right-1 h-6 w-6"
                            onClick={() => removeFromCompare(product.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="aspect-square w-32 mx-auto mb-2 bg-muted rounded-lg overflow-hidden">
                            {product.image_url ? (
                              <img
                                src={product.image_url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="h-8 w-8 text-muted-foreground/30" />
                              </div>
                            )}
                          </div>
                          <p className="font-semibold text-sm line-clamp-2">{product.name}</p>
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Price Row */}
                  <tr className="border-t">
                    <td className="p-3 font-medium text-muted-foreground">Price</td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-3 text-center">
                        <span className="text-lg font-bold text-primary">
                          KSh {product.base_price.toLocaleString()}
                        </span>
                      </td>
                    ))}
                  </tr>

                  {/* Category Row */}
                  <tr className="border-t">
                    <td className="p-3 font-medium text-muted-foreground">Category</td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-3 text-center">
                        {product.category ? (
                          <Badge variant="secondary">{product.category}</Badge>
                        ) : (
                          <span className="text-muted-foreground">-</span>
                        )}
                      </td>
                    ))}
                  </tr>

                  {/* Stock Row */}
                  <tr className="border-t">
                    <td className="p-3 font-medium text-muted-foreground">Availability</td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-3 text-center">
                        <Badge variant={product.stock > 0 ? "default" : "destructive"}>
                          {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
                        </Badge>
                      </td>
                    ))}
                  </tr>

                  {/* Description Row */}
                  <tr className="border-t">
                    <td className="p-3 font-medium text-muted-foreground">Description</td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-3 text-center text-sm">
                        <p className="line-clamp-4">{product.description || "-"}</p>
                      </td>
                    ))}
                  </tr>

                  {/* Specification Rows */}
                  {allSpecKeys.length > 0 && (
                    <>
                      <tr className="border-t bg-muted/30">
                        <td colSpan={compareList.length + 1} className="p-3 font-semibold">
                          Specifications
                        </td>
                      </tr>
                      {allSpecKeys.map((specKey) => (
                        <tr key={specKey} className="border-t">
                          <td className="p-3 font-medium text-muted-foreground text-sm">
                            {specKey}
                          </td>
                          {compareList.map((product) => {
                            const specs = parseSpecs(product.specifications);
                            return (
                              <td key={product.id} className="p-3 text-center text-sm">
                                {specs[specKey] || "-"}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </>
                  )}

                  {/* Action Row */}
                  <tr className="border-t">
                    <td className="p-3 font-medium text-muted-foreground">Actions</td>
                    {compareList.map((product) => (
                      <td key={product.id} className="p-3 text-center">
                        <Link to={`/product/${product.id}`} onClick={() => setOpen(false)}>
                          <Button size="sm">
                            View Details
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </Button>
                        </Link>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </ScrollArea>
        </SheetContent>
      </Sheet>
    </>
  );
}
