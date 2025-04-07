// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMenu, deleteProduct } from '../../services/api';
import { MenuItem } from '../../types/types';
import CustomAlert from '../../components/CustomAlert';
import ProductForm from './ProductForm';

const AdminDashboard: React.FC = () => {
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alertOpen, setAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertType, setAlertType] = useState<'success' | 'error'>('success');
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<MenuItem | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);
  
  const navigate = useNavigate();

  const refreshProducts = async () => {
    try {
      setIsLoading(true);
      const data = await getMenu();
      setProducts(data);
      setError(null);
    } catch (err) {
      setError('Mahsulot ma\'lumotlarini yuklashda xatolik yuz berdi');
      console.error('Failed to fetch products:', err);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Get admin data from sessionStorage
  const getAdminData = () => {
    const adminData = sessionStorage.getItem('adminData');
    if (!adminData) {
      navigate('/admin/login');
      return null;
    }
    return JSON.parse(adminData);
  };
  
  // Load products
  useEffect(() => {
    const adminData = getAdminData();
    if (!adminData) return;
    refreshProducts();
  }, [navigate]);

  const handleAddNew = () => {
    setSelectedProduct(null);
    setShowProductForm(true);
  };
  
  const handleEdit = (product: MenuItem) => {
    setSelectedProduct(product);
    setShowProductForm(true);
  };
  
  const handleCloseForm = () => {
    setShowProductForm(false);
    setSelectedProduct(null);
  };
  
  const openDeleteModal = (id: number) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      setShowDeleteModal(false);
      const result = await deleteProduct(deleteId);
      if (result.success) {
        setProducts(products.filter(p => p.id !== deleteId));
        setAlertType('success');
        setAlertMessage('Mahsulot muvaffaqiyatli o\'chirildi');
      } else {
        setAlertType('error');
        setAlertMessage(result.message || 'Mahsulotni o\'chirishda xatolik yuz berdi');
      }
    } catch (error) {
      setAlertType('error');
      setAlertMessage('Mahsulotni o\'chirishda xatolik yuz berdi');
    }
    setAlertOpen(true);
  };

  const closeAlert = () => setAlertOpen(false);

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 py-6 flex flex-col">
      <div className="px-6 py-4 bg-white shadow-sm rounded-lg mx-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Mahsulotlar</h1>
          <button
            onClick={handleAddNew}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            + Yangi mahsulot
          </button>
        </div>
        
        <div className="mb-6">
          <input
            type="text"
            placeholder="Mahsulotlarni qidirish..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-transparent"
          />
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-red-600 font-bold">{error}</p>
              <button 
                onClick={refreshProducts}
                className="mt-4 text-red-600 hover:text-red-700 font-medium"
              >
                Qayta urinish
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              <p className="text-gray-500 text-lg">Mahsulotlar mavjud emas.</p>
              <button
                onClick={handleAddNew}
                className="mt-4 text-red-600 hover:text-red-700 font-medium"
              >
                Yangi mahsulot qo'shing
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rasm</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mahsulot</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Narxi</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amallar</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProducts.map(product => (
                    <tr key={product.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{product.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-16 w-16 object-cover rounded-lg border border-gray-200"
                          onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/150?text=Rasm+topilmadi')}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-2 max-w-xs">{product.description}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">${product.price.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleEdit(product)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                          >
                            Tahrirlash
                          </button>
                          <button 
                            onClick={() => openDeleteModal(product.id)}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg transition-colors shadow-sm"
                          >
                            O'chirish
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductForm
          productToEdit={selectedProduct || undefined}
          onRefresh={refreshProducts}
          onClose={handleCloseForm}
        />
      )}

      {/* Delete confirmation modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Mahsulotni o'chirish</h3>
              <p className="text-gray-500">Rostdan ham ushbu mahsulotni o'chirmoqchimisiz?</p>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-700 font-medium"
              >
                Bekor qilish
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                O'chirish
              </button>
            </div>
          </div>
        </div>
      )}

      <CustomAlert 
        isOpen={alertOpen}
        onClose={closeAlert}
        message={alertMessage}
        type={alertType}
      />
    </div>
  );
};

export default AdminDashboard;