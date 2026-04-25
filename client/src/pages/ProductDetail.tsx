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
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();

  useEffect(() => {
    if (!id) {
      setError('Producto no encontrado');
      setLoading(false);
      return;
    }
    productService
      .getById(Number(id))
      .then(setProduct)
      .catch(() => setError('Error al cargar producto'))
      .finally(() => setLoading(false));
      
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    }
  };

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>{error}</div>;
  if (!product) return <div>Producto no encontrado</div>;

  return (
    <div className="page">
      <Link to="/products">← Volver</Link>
      <h1>{product.name || product.title}</h1>
      <p>{product.description}</p>
      <p>Categoría: {product.categoryId}</p>
      <p>Estado: {product.isActive ? 'Activo' : 'Inactivo'}</p>
      <p>Variación: {product.variationType}</p>

      <div className="add-to-cart">
        <label>Cantidad:</label>
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
        <button onClick={handleAddToCart} disabled={added}>
          {added ? 'Agregado!' : 'Agregar al Carrito'}
        </button>
      </div>
    </div>
  );
}