import { useState, useEffect } from "react";
import { addProduct, updateProduct } from "../../services/api";

interface ProductFormProps {
  productToEdit?: {
    id: number;
    name: string;
    description: string;
    price: number;
    image?: string;
  };
  onRefresh: () => void;
  onClose: () => void;
}

const ProductForm: React.FC<ProductFormProps> = ({ productToEdit, onRefresh, onClose }) => {
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    image: ""
  });

  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (productToEdit) {
      setProduct({
        name: productToEdit.name,
        description: productToEdit.description,
        price: productToEdit.price.toString(),
        image: productToEdit.image || ""
      });
      if (productToEdit.image) {
        setPreviewUrl(productToEdit.image);
      }
    }
  }, [productToEdit]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError("Rasm hajmi 5MB dan oshmasligi kerak");
        return;
      }
      
      setPreviewFile(file);
      const newPreviewUrl = URL.createObjectURL(file);
      setPreviewUrl(newPreviewUrl);
      
      return () => {
        URL.revokeObjectURL(newPreviewUrl);
      };
    }
  };

  const validateForm = () => {
    if (!product.name.trim()) {
      setError("Mahsulot nomi kiritilmagan");
      return false;
    }
    if (!product.description.trim()) {
      setError("Mahsulot tavsifi kiritilmagan");
      return false;
    }
    const price = parseFloat(product.price);
    if (isNaN(price) || price <= 0) {
      setError("Mahsulot narxi noto'g'ri");
      return false;
    }
    if (!productToEdit && !previewFile && !previewUrl) {
      setError("Mahsulot rasmi tanlanmagan");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("name", product.name.trim());
      formData.append("description", product.description.trim());
      formData.append("price", parseFloat(product.price).toString());

      // Handle image file
      if (previewFile) {
        formData.append("image", previewFile);
      } else if (productToEdit?.image && !previewUrl) {
        // If editing and the image wasn't changed, pass the existing URL
        formData.append("imageUrl", productToEdit.image);
      }

      if (productToEdit) {
        await updateProduct(productToEdit.id, formData);
      } else {
        await addProduct(formData);
      }

      onRefresh();
      onClose();
    } catch (err: any) {
      console.error("Xatolik:", err);
      setError(err?.message || "Noma'lum xatolik yuz berdi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 overflow-hidden z-50">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-md relative pointer-events-auto max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white z-10">
            <div className="h-2 bg-gradient-to-r from-red-500 to-red-600"></div>
            <div className="flex justify-between items-center px-6 py-4">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-blue-600 transition-colors flex items-center gap-1"
                title="Orqaga"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
              </button>

              <h2 className="text-xl font-bold text-gray-800">
                {productToEdit ? "✏️ Mahsulotni tahrirlash" : "➕ Yangi mahsulot qo'shish"}
              </h2>

              <button
                onClick={onClose}
                className="text-gray-400 hover:text-red-600 transition-colors"
                title="Yopish"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 pt-0">
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex gap-2 text-red-700">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-sm">{error}</span>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Nomi</label>
                <input
                  type="text"
                  name="name"
                  value={product.name}
                  onChange={handleChange}
                  placeholder="Mahsulot nomi"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Tavsifi</label>
                <textarea
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  placeholder="Mahsulot haqida to'liqroq ma'lumot"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  rows={3}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Narxi ($)</label>
                <input
                  type="number"
                  name="price"
                  value={product.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Rasm</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100"
                />
                {previewUrl && (
                  <div className="relative mt-2 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={previewUrl}
                      alt="Mahsulot rasmi"
                      className="w-full h-48 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(null);
                        setPreviewFile(null);
                      }}
                      className="absolute top-2 right-2 bg-white/80 p-1 rounded-full hover:bg-white transition-colors"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 111.414 1.414L11.414 10l4.293 4.293a1 1 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 01-1.414-1.414L8.586 10 4.293 5.707a1 1 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="sticky bottom-0 bg-white pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-3 px-4 rounded-lg font-medium text-white transition-all ${
                    loading 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-red-600 hover:bg-red-700 active:transform active:scale-[0.98]'
                  }`}
                >
                  {loading ? (
                    <div className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saqlanmoqda...</span>
                    </div>
                  ) : productToEdit ? (
                    "💾 Saqlash"
                  ) : (
                    "➕ Qo'shish"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductForm;
