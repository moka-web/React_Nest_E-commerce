import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import { ProductCard } from '../components/ProductCard';
import type { Product } from '../types';

export function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    productService
      .getAll()
      .then(setProducts)
      .catch(() => setError('Error al cargar productos'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;

  const isMerchant = user && user.roleId !== 1;

  return (
    <div className="page">
      <h1>Productos</h1>

      {products.length === 0 ? (
        <p>No hay productos</p>
      ) : (
        <div className="products-grid">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}

      {isMerchant && (
        <div className="page-footer">
          <Link to="/products/new" className="btn">
            Agregar Producto
          </Link>
        </div>
      )}
    </div>
  );
}
