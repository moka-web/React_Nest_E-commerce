import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Product } from '../types';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: fetch products from API when endpoint exists
    // For now, mock data
    setProducts([]);
    setLoading(false);
  }, []);

  if (loading) return <div>Cargando...</div>;

  return (
    <div className="page">
      <h1>Productos</h1>
      <Link to="/products/new" className="btn">
        Agregar Producto
      </Link>

      {products.length === 0 ? (
        <p>No hay productos</p>
      ) : (
        <div className="products-grid">
          {products.map((product) => (
            <Link
              key={product.id}
              to={`/products/${product.id}`}
              className="product-card"
            >
              <h2>{product.name}</h2>
              <p>{product.description}</p>
              <span>{product.isActive ? 'Activo' : 'Inactivo'}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
