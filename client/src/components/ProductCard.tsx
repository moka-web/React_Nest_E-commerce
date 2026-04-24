import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  const productName = product.name || product.title || 'Sin nombre';

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem(product, 1);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-info">
        <h2>{productName}</h2>
        <p>{product.description || 'Sin descripción'}</p>
        <span className={product.isActive ? 'status-active' : 'status-inactive'}>
          {product.isActive ? 'Activo' : 'Inactivo'}
        </span>
      </div>
      <button onClick={handleAddToCart} className="btn-add-cart">
        Agregar al Carrito
      </button>
    </Link>
  );
}