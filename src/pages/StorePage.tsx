import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";

const products = [
  {
    name: "Eco-Friendly Broom (Jhadu)",
    price: "₹120",
    rating: 4.5,
    image: "🧹",
    desc: "Traditional grass broom, perfect for sweeping streets and compounds.",
  },
  {
    name: "Dustbin Set (Wet & Dry)",
    price: "₹350",
    rating: 4.7,
    image: "🗑️",
    desc: "Color-coded twin dustbin set for proper waste segregation at home.",
  },
  {
    name: "Heavy Duty Mop",
    price: "₹250",
    rating: 4.3,
    image: "🧽",
    desc: "Microfiber mop with wringer bucket for deep floor cleaning.",
  },
  {
    name: "Garbage Bags (Pack of 30)",
    price: "₹99",
    rating: 4.6,
    image: "🛍️",
    desc: "Biodegradable garbage bags, strong and leak-proof for daily use.",
  },
  {
    name: "Drain Cleaner Powder",
    price: "₹80",
    rating: 4.2,
    image: "🧴",
    desc: "Powerful drain cleaner to keep nali and pipes blockage-free.",
  },
  {
    name: "Hand Gloves (Pack of 5)",
    price: "₹150",
    rating: 4.4,
    image: "🧤",
    desc: "Reusable rubber gloves for safe and hygienic cleaning work.",
  },
  {
    name: "Toilet Cleaner Liquid",
    price: "₹75",
    rating: 4.5,
    image: "🚽",
    desc: "Disinfectant toilet cleaner for sparkling clean public and home toilets.",
  },
  {
    name: "Phenyl Floor Cleaner (1L)",
    price: "₹65",
    rating: 4.1,
    image: "🧪",
    desc: "White phenyl for mopping floors, kills germs and freshens rooms.",
  },
];

const StorePage = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="container py-12">
        <h1 className="font-heading text-2xl font-bold">🛒 Safai Store</h1>
        <p className="mb-8 text-muted-foreground">
          साफ-सफाई से related सभी ज़रूरी सामान यहाँ मिलेगा। अपने घर और मोहल्ले को साफ रखें!
        </p>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((product) => (
            <div
              key={product.name}
              className="group flex flex-col rounded-xl border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="mb-3 flex h-24 items-center justify-center rounded-lg bg-muted text-5xl">
                {product.image}
              </div>
              <h3 className="font-heading text-sm font-bold">{product.name}</h3>
              <p className="mt-1 flex-1 text-xs text-muted-foreground">{product.desc}</p>
              <div className="mt-3 flex items-center justify-between">
                <span className="font-heading text-lg font-bold text-primary">{product.price}</span>
                <div className="flex items-center gap-1 text-xs text-warning">
                  <Star className="h-3 w-3 fill-current" />
                  {product.rating}
                </div>
              </div>
              <Button size="sm" className="mt-3 w-full">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StorePage;
