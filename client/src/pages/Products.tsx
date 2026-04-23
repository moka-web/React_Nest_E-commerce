import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import type { Product } from '../types';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    productService
      .getAll()
      .then(setProducts)
      .catch(() => setError('Error al cargar productos'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

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
