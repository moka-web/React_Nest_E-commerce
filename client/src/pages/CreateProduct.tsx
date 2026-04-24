import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { productService } from '../services/productService';
import { useAuth } from '../context/AuthContext';
import type { CreateProductDto } from '../types';

export function CreateProduct() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState<CreateProductDto>({
    categoryId: 1,
    name: '',
    description: '',
    variationType: 'NONE',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Debes iniciar sesión');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await productService.create(form);
      navigate('/products');
    } catch (err: unknown) {
      setError('Error al crear producto');
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.roleId === 1) {
    return (
      <div className="page">
        <h1>No tienes acceso</h1>
        <p>Solo merchants pueden crear productos</p>
        <Link to="/products" className="back-link">← Volver</Link>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>Crear Producto</h1>
      <Link to="/products" className="back-link">← Volver</Link>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Nombre:</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Nombre del producto"
            required
          />
        </div>

        <div className="form-group">
          <label>Categoría:</label>
          <select
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: Number(e.target.value) })}
          >
            <option value={1}>Computers</option>
            <option value={2}>Fashion</option>
          </select>
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Descripción del producto"
          />
        </div>

        <div className="form-group">
          <label>Tipo de Variación:</label>
          <select
            value={form.variationType}
            onChange={(e) => setForm({ ...form, variationType: e.target.value })}
          >
            <option value="NONE">Ninguno</option>
            <option value="OnlyOneSize">Solo Talla</option>
            <option value="OnlyColor">Solo Color</option>
            <option value="SizeAndColor">Talla y Color</option>
          </select>
        </div>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? 'Creando...' : 'Crear Producto'}
        </button>
      </form>
    </div>
  );
}