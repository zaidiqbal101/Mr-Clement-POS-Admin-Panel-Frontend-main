import React, { useState, useEffect } from 'react';
import { ChevronDown, Plus, Eye, Edit, Trash2, RefreshCw } from 'lucide-react';
import withAdminLayout from '../AdminPanel/withAdminLayout';
import { posOrderService } from '../../services/posOrderService';

import printer from '../../assets/Images/admin/Pos/printer.png';
import system from '../../assets/Images/admin/Pos/system.png';
import global from '../../assets/Images/admin/client/global-user.png';

import HardwareChart from '../../Components/PosDevice/HardwareChart';
import HardwareSold from '../../Components/PosDevice/HardwareSold';

const PosDevice = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('Today');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    items: [{
      item_id: '',
      item_Quentry: 1,
      item_Addons_id: '',
      item_Variants_id: ''
    }],
    Tax: 0,
    Customer_id: '',
    Dining_Option: 'Dine in',
    Table_id: '',
    Kitchen_id: '',
    Status: true
  });

  const metrics = [
    {
      title: 'Total Orders',
      value: orders.length.toString(),
      imageSrc: global,
      bgColor: 'bg-green-100',
    },
    {
      title: 'Active Orders',
      value: orders.filter(order => order.Status).length.toString(),
      imageSrc: printer,
      bgColor: 'bg-pink-100',
      valueColor: 'text-green-500',
      trend: 'up',
    },
    {
      title: 'Completed Orders',
      value: orders.filter(order => !order.Status).length.toString(),
      imageSrc: system,
      bgColor: 'bg-blue-100',
      trend: 'up',
    }
  ];

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await posOrderService.getAllOrders();
      
      // Handle different response structures
      if (response.success && response.data) {
        setOrders(Array.isArray(response.data) ? response.data : []);
      } else if (Array.isArray(response)) {
        setOrders(response);
      } else if (response.orders) {
        setOrders(Array.isArray(response.orders) ? response.orders : []);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      // Convert string values to numbers
      const processedData = {
        ...formData,
        items: formData.items.map(item => ({
          item_id: Number(item.item_id),
          item_Quentry: Number(item.item_Quentry),
          item_Addons_id: item.item_Addons_id ? Number(item.item_Addons_id) : null,
          item_Variants_id: item.item_Variants_id ? Number(item.item_Variants_id) : null
        })),
        Tax: Number(formData.Tax),
        Customer_id: Number(formData.Customer_id),
        Table_id: Number(formData.Table_id),
        Kitchen_id: Number(formData.Kitchen_id)
      };
      
      const response = await posOrderService.createOrder(processedData);
      
      if (response.success || response.message === 'Order created successfully') {
        alert('Order created successfully!');
        setShowCreateModal(false);
        resetForm();
        fetchOrders();
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      setError(error.message);
      alert(`Failed to create order: ${error.message}`);
    }
  };

  const handleUpdateOrder = async (e) => {
    e.preventDefault();
    try {
      setError('');
      
      // Convert string values to numbers
      const processedData = {
        id: Number(selectedOrder.id),
        items: formData.items.map(item => ({
          item_id: Number(item.item_id),
          item_Quentry: Number(item.item_Quentry),
          item_Addons_id: item.item_Addons_id ? Number(item.item_Addons_id) : null,
          item_Variants_id: item.item_Variants_id ? Number(item.item_Variants_id) : null
        })),
        Tax: Number(formData.Tax),
        Customer_id: Number(formData.Customer_id),
        Dining_Option: formData.Dining_Option,
        Table_id: Number(formData.Table_id),
        Kitchen_id: Number(formData.Kitchen_id),
        Status: formData.Status
      };
      
      const response = await posOrderService.updateOrder(processedData);
      
      if (response.success || response.message === 'Order updated successfully') {
        alert('Order updated successfully!');
        setShowEditModal(false);
        resetForm();
        fetchOrders();
      } else {
        throw new Error(response.message || 'Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      setError(error.message);
      alert(`Failed to update order: ${error.message}`);
    }
  };

  const handleEditClick = (order) => {
    setSelectedOrder(order);
    setFormData({
      items: order.items || [{
        item_id: '',
        item_Quentry: 1,
        item_Addons_id: '',
        item_Variants_id: ''
      }],
      Tax: order.Tax || 0,
      Customer_id: order.Customer_id || '',
      Dining_Option: order.Dining_Option || 'Dine in',
      Table_id: order.Table_id || '',
      Kitchen_id: order.Kitchen_id || '',
      Status: order.Status !== undefined ? order.Status : true
    });
    setShowEditModal(true);
  };

  const resetForm = () => {
    setFormData({
      items: [{
        item_id: '',
        item_Quentry: 1,
        item_Addons_id: '',
        item_Variants_id: ''
      }],
      Tax: 0,
      Customer_id: '',
      Dining_Option: 'Dine in',
      Table_id: '',
      Kitchen_id: '',
      Status: true
    });
    setSelectedOrder(null);
    setError('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData(prev => ({ ...prev, items: newItems }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, {
        item_id: '',
        item_Quentry: 1,
        item_Addons_id: '',
        item_Variants_id: ''
      }]
    }));
  };

  const removeItem = (index) => {
    if (formData.items.length > 1) {
      const newItems = formData.items.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, items: newItems }));
    }
  };

  const OrderModal = ({ show, onClose, onSubmit, title }) => {
    if (!show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={onSubmit}>
              {/* Items Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Order Items</label>
                {formData.items.map((item, index) => (
                  <div key={index} className="border p-4 rounded mb-2">
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        type="number"
                        placeholder="Item ID *"
                        value={item.item_id}
                        onChange={(e) => handleItemChange(index, 'item_id', e.target.value)}
                        className="border p-2 rounded"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Quantity *"
                        value={item.item_Quentry}
                        onChange={(e) => handleItemChange(index, 'item_Quentry', e.target.value)}
                        className="border p-2 rounded"
                        min="1"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Addon ID (Optional)"
                        value={item.item_Addons_id}
                        onChange={(e) => handleItemChange(index, 'item_Addons_id', e.target.value)}
                        className="border p-2 rounded"
                      />
                      <input
                        type="number"
                        placeholder="Variant ID (Optional)"
                        value={item.item_Variants_id}
                        onChange={(e) => handleItemChange(index, 'item_Variants_id', e.target.value)}
                        className="border p-2 rounded"
                      />
                    </div>
                    {formData.items.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeItem(index)}
                        className="text-red-500 text-sm mt-2 hover:text-red-700"
                      >
                        Remove Item
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={addItem}
                  className="text-blue-500 text-sm flex items-center gap-1 hover:text-blue-700"
                >
                  <Plus size={16} /> Add Item
                </button>
              </div>

              {/* Other Fields */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Tax *</label>
                  <input
                    type="number"
                    step="0.01"
                    name="Tax"
                    value={formData.Tax}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    min="0"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Customer ID *</label>
                  <input
                    type="number"
                    name="Customer_id"
                    value={formData.Customer_id}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Dining Option *</label>
                  <select
                    name="Dining_Option"
                    value={formData.Dining_Option}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  >
                    <option value="Dine in">Dine in</option>
                    <option value="Takeaway">Takeaway</option>
                    <option value="Delivery">Delivery</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Table ID *</label>
                  <input
                    type="number"
                    name="Table_id"
                    value={formData.Table_id}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Kitchen ID *</label>
                  <input
                    type="number"
                    name="Kitchen_id"
                    value={formData.Kitchen_id}
                    onChange={handleInputChange}
                    className="w-full border p-2 rounded"
                    required
                  />
                </div>
                <div className="flex items-center">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      name="Status"
                      checked={formData.Status}
                      onChange={handleInputChange}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium">Active Status</span>
                  </label>
                </div>
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    resetForm();
                  }}
                  className="px-4 py-2 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  {title === 'Create Order' ? 'Create' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-6 w-full">
      {/* Topbar */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">POS Orders Management</h1>
        <div className="flex gap-2 mt-4 sm:mt-0">
          <button
            onClick={fetchOrders}
            className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
            disabled={loading}
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            <Plus size={20} />
            Create Order
          </button>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
          <p className="font-semibold">Error:</p>
          <p>{error}</p>
          {error.includes('Authentication') && (
            <p className="mt-2 text-sm">Redirecting to login...</p>
          )}
        </div>
      )}

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 poppins-text">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="relative w-full bg-white rounded-[25px] shadow-[0px_0px_1px_rgba(0,0,0,0.25),0px_4px_4px_rgba(0,0,0,0.25)] flex items-center px-6 py-5 gap-6"
          >
            <div className={`w-[60px] h-[60px] sm:w-[70px] sm:h-[70px] rounded-full ${metric.bgColor} flex items-center justify-center`}>
              <img src={metric.imageSrc} alt="icon" className="w-[28px] h-[28px] sm:w-[32px] sm:h-[32px]" />
            </div>

            <div className="flex flex-col justify-center gap-1">
              <p className="text-[16px] sm:text-[18px] text-[#00000099] font-medium">{metric.title}</p>
              <div className="flex items-center gap-2">
                {metric.trend === 'up' && (
                  <span className="text-[#34C759] font-bold text-lg sm:text-xl">↑</span>
                )}
                {metric.trend === 'down' && (
                  <span className="text-[#FF3B30] font-bold text-lg sm:text-xl">↓</span>
                )}
                <span
                  className={`text-[20px] sm:text-[24px] font-bold leading-[30px] sm:leading-[36px] ${
                    metric.valueColor || (metric.trend === 'up'
                      ? 'text-[#34C759]'
                      : metric.trend === 'down'
                      ? 'text-[#FF3B30]'
                      : 'text-[#232323]')
                  }`}
                >
                  {metric.value}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Recent Orders</h2>
          {loading ? (
            <div className="text-center py-8">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-600">Loading orders...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="text-lg mb-2">No orders found</p>
              <p className="text-sm">Create your first order to get started</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dining</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Table</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tax</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.Customer_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.Dining_Option}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{order.Table_id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">${order.Tax}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 text-xs rounded-full ${order.Status ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          {order.Status ? 'Active' : 'Completed'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <button
                          onClick={() => handleEditClick(order)}
                          className="text-blue-600 hover:text-blue-800 mr-3"
                          title="Edit Order"
                        >
                          <Edit size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="flex flex-col lg:flex-row w-full gap-6 mt-10">
        <div className="w-full lg:w-[40%]">
          <HardwareChart />
        </div>
        <div className="w-full lg:w-[60%]">
          <HardwareSold />
        </div>
      </div>

      {/* Modals */}
      <OrderModal
        show={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          resetForm();
        }}
        onSubmit={handleCreateOrder}
        title="Create Order"
      />
      <OrderModal
        show={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          resetForm();
        }}
        onSubmit={handleUpdateOrder}
        title="Edit Order"
      />
    </div>
  );
};

export default withAdminLayout(PosDevice);