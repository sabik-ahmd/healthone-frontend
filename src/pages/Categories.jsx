import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Pill, 
  Syringe, 
  Stethoscope, 
  Heart, 
  Baby, 
  Eye, 
  Brain, 
  Bandage,
  Search,
  Filter,
  ChevronRight,
  Plus,
  Edit,
  Trash2,
  Check
} from 'lucide-react';
import { toast } from 'react-toastify';

const Categories = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [newCategory, setNewCategory] = useState({
    name: '',
    description: '',
    icon: 'pill',
    color: '#3B82F6'
  });
  const [showAddForm, setShowAddForm] = useState(false);

  // Sample icons mapping
  const iconMap = {
    pill: Pill,
    syringe: Syringe,
    stethoscope: Stethoscope,
    heart: Heart,
    baby: Baby,
    eye: Eye,
    brain: Brain,
    bandage: Bandage
  };

  // Color options for categories
  const colorOptions = [
    { name: 'Blue', value: '#3B82F6' },
    { name: 'Green', value: '#10B981' },
    { name: 'Red', value: '#EF4444' },
    { name: 'Purple', value: '#8B5CF6' },
    { name: 'Yellow', value: '#F59E0B' },
    { name: 'Pink', value: '#EC4899' },
    { name: 'Indigo', value: '#6366F1' },
    { name: 'Teal', value: '#14B8A6' }
  ];

  // Initial categories data
  const initialCategories = [
    {
      id: 1,
      name: 'Prescription Medicines',
      description: 'Medicines that require a doctor\'s prescription',
      productCount: 245,
      icon: 'pill',
      color: '#3B82F6',
      createdAt: '2024-01-15'
    },
    {
      id: 2,
      name: 'Over-the-Counter',
      description: 'Medicines available without prescription',
      productCount: 156,
      icon: 'stethoscope',
      color: '#10B981',
      createdAt: '2024-01-10'
    },
    {
      id: 3,
      name: 'Vitamins & Supplements',
      description: 'Vitamins, minerals and dietary supplements',
      productCount: 189,
      icon: 'heart',
      color: '#EF4444',
      createdAt: '2024-01-05'
    },
    {
      id: 4,
      name: 'Baby Care',
      description: 'Products for infant and child care',
      productCount: 78,
      icon: 'baby',
      color: '#8B5CF6',
      createdAt: '2024-01-20'
    },
    {
      id: 5,
      name: 'Personal Care',
      description: 'Skincare, haircare and personal hygiene',
      productCount: 203,
      icon: 'bandage',
      color: '#F59E0B',
      createdAt: '2024-01-12'
    },
    {
      id: 6,
      name: 'Medical Devices',
      description: 'Medical equipment and devices',
      productCount: 92,
      icon: 'syringe',
      color: '#EC4899',
      createdAt: '2024-01-08'
    },
    {
      id: 7,
      name: 'Eye Care',
      description: 'Contact lenses, solutions and eye drops',
      productCount: 67,
      icon: 'eye',
      color: '#6366F1',
      createdAt: '2024-01-18'
    },
    {
      id: 8,
      name: 'Diabetes Care',
      description: 'Diabetes testing and management products',
      productCount: 54,
      icon: 'brain',
      color: '#14B8A6',
      createdAt: '2024-01-03'
    }
  ];

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setCategories(initialCategories);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (category) => {
    setEditingCategory(category);
    setNewCategory({
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color
    });
    setShowAddForm(true);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      setCategories(categories.filter(cat => cat.id !== id));
      toast.success('Category deleted successfully');
    }
  };

  const handleSave = () => {
    if (!newCategory.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    if (editingCategory) {
      // Update existing category
      setCategories(categories.map(cat =>
        cat.id === editingCategory.id
          ? { ...cat, ...newCategory }
          : cat
      ));
      toast.success('Category updated successfully');
      setEditingCategory(null);
    } else {
      // Add new category
      const newCat = {
        id: categories.length + 1,
        ...newCategory,
        productCount: 0,
        createdAt: new Date().toISOString().split('T')[0]
      };
      setCategories([...categories, newCat]);
      toast.success('Category added successfully');
    }

    setNewCategory({
      name: '',
      description: '',
      icon: 'pill',
      color: '#3B82F6'
    });
    setShowAddForm(false);
  };

  const handleCancel = () => {
    setShowAddForm(false);
    setEditingCategory(null);
    setNewCategory({
      name: '',
      description: '',
      icon: 'pill',
      color: '#3B82F6'
    });
  };

  const handleViewProducts = (category) => {
    navigate(`/admin/products?category=${encodeURIComponent(category.name)}`);
  };

  const getIconComponent = (iconName) => {
    const IconComponent = iconMap[iconName] || Pill;
    return <IconComponent size={24} />;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-6 shadow-sm">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Product Categories</h1>
              <p className="text-gray-600 mt-2">Manage and organize your product categories</p>
            </div>
            <button
              onClick={() => setShowAddForm(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
            >
              <Plus size={20} />
              Add New Category
            </button>
          </div>

          {/* Search and Stats */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                <span className="text-gray-700">Total Categories: {categories.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-gray-700">Total Products: {categories.reduce((sum, cat) => sum + cat.productCount, 0)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Add/Edit Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg mb-8"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-4">
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name *
                </label>
                <input
                  type="text"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {Object.keys(iconMap).map(icon => (
                    <button
                      key={icon}
                      onClick={() => setNewCategory({...newCategory, icon})}
                      className={`flex items-center justify-center p-3 rounded-lg border-2 ${newCategory.icon === icon ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                    >
                      {getIconComponent(icon)}
                    </button>
                  ))}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {colorOptions.map(color => (
                    <button
                      key={color.value}
                      onClick={() => setNewCategory({...newCategory, color: color.value})}
                      className={`w-8 h-8 rounded-full border-2 ${newCategory.color === color.value ? 'border-gray-800' : 'border-gray-300'}`}
                      style={{ backgroundColor: color.value }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={handleCancel}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Check size={20} />
                {editingCategory ? 'Update Category' : 'Add Category'}
              </button>
            </div>
          </motion.div>
        )}

        {/* Categories Grid */}
        {filteredCategories.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No categories found</h3>
            <p className="text-gray-600">Try adjusting your search or add a new category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCategories.map((category) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
              >
                <div 
                  className="h-2"
                  style={{ backgroundColor: category.color }}
                />
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div 
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: category.color + '20' }}
                      >
                        {getIconComponent(category.icon)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{category.name}</h3>
                        <p className="text-sm text-gray-500 mt-1">{category.productCount} products</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {category.description}
                  </p>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Created: {category.createdAt}</span>
                    <button
                      onClick={() => handleViewProducts(category)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium"
                    >
                      View Products
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Statistics */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Category Statistics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Categories</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{categories.length}</p>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Filter className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="text-green-600 font-medium">+3</span> this month
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Products</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {categories.reduce((sum, cat) => sum + cat.productCount, 0)}
                  </p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <Pill className="text-green-600" size={24} />
                </div>
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  <span className="text-green-600 font-medium">+156</span> products across all categories
                </p>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Most Products</p>
                  <p className="text-xl font-bold text-gray-900 mt-2 truncate">
                    {categories.reduce((max, cat) => cat.productCount > max.productCount ? cat : max, categories[0])?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {categories.reduce((max, cat) => cat.productCount > max.productCount ? cat : max, categories[0])?.productCount} products
                  </p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Heart className="text-purple-600" size={24} />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Least Products</p>
                  <p className="text-xl font-bold text-gray-900 mt-2 truncate">
                    {categories.reduce((min, cat) => cat.productCount < min.productCount ? cat : min, categories[0])?.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {categories.reduce((min, cat) => cat.productCount < min.productCount ? cat : min, categories[0])?.productCount} products
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <Baby className="text-yellow-600" size={24} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;