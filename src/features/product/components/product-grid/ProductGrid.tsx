import ProductCard, { type ProductCardItem } from './ProductCard';
import product1 from './assets/product-1.webp';
import product2 from './assets/product-2.webp';
import product3 from './assets/product-3.webp';
import product4 from './assets/product-4.webp';
import product5 from './assets/product-5.webp';

// ponytail: static Figma content, becomes props when related products are fetched
const products: ProductCardItem[] = [
  {
    image: product1,
    brand: 'Whistle',
    price: '$26',
    name: 'Wide Leg Cropped Jeans, Denim',
    rating: '4,8',
    sold: '1,238',
  },
  {
    image: product2,
    brand: 'John Lewis ANYDAY',
    price: '$26',
    name: 'Long Sleeve Utility Shirt, Navy, 6',
    rating: '4,8',
    sold: '1,238',
  },
  {
    image: product3,
    brand: 'John Lewis ANYDAY',
    price: '$32',
    name: 'Stripe Curved Hem Shirt, Blue',
    rating: '4,5',
    sold: '620',
  },
  {
    image: product4,
    brand: 'John Lewis ANYDAY',
    price: '$40',
    name: 'Denim Overshirt, Mid Wash',
    rating: '4,6',
    sold: '238',
  },
  { image: product5, brand: 'John Lewis', price: '$79', name: 'Linen Blazer, Navy', rating: '4,8', sold: '1,238' },
  {
    image: product2,
    brand: 'John Lewis ANYDAY',
    price: '$26',
    name: 'Long Sleeve Utility Shirt, Navy, 6',
    rating: '4,8',
    sold: '1,238',
  },
];

// Figma: 6 cards in 2 columns on mobile, 5 in one row on desktop.
function ProductGrid({ title }: { title: string }) {
  return (
    <section className="font-clash">
      <div className="flex items-end justify-between leading-[1.2]">
        <h2 className="text-2xl font-semibold text-[#292929] lg:text-[28px] lg:text-[#141414]">{title}</h2>
        <button type="button" className="text-base font-medium text-[#525252] underline">
          View All
        </button>
      </div>

      <ul className="mt-10 grid grid-cols-2 gap-x-5 gap-y-9 md:grid-cols-3 lg:mt-6 lg:grid-cols-5 lg:gap-x-[35px]">
        {products.map((item, i) => (
          <li key={i} className={i === 5 ? 'lg:hidden' : undefined}>
            <ProductCard item={item} />
          </li>
        ))}
      </ul>
    </section>
  );
}

export default ProductGrid;
