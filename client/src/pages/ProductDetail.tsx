import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useCart } from '../context/CartContext';
import type { Product } from '../types';

export function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    productService
      .getById(Number(id))
      .then(setProduct)
      .catch(() => setError('Error al cargar producto'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div className="page">
      <Link to="/products">← Volver</Link>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <span>Estado: {product.isActive ? 'Activo' : 'Inactivo'}</span>
      <button onClick={() => addItem(product)}>Agregar al Carrito</button>
    </div>
  );
}