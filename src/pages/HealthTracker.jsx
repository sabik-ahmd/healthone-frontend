import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  Activity, 
  Weight, 
  Thermometer, 
  Droplets, 
  Pill, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Plus,
  Edit,
  Trash2,
  Clock,
  AlertCircle,
  CheckCircle,
  Download,
  Share2,
  Filter,
  ChevronRight,
  BarChart2,
  LineChart as LineChartIcon,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Create a fallback for recharts if not installed
let RechartsComponents = null;
try {
  const recharts = require('recharts');
  RechartsComponents = {
    LineChart: recharts.LineChart,
    Line: recharts.Line,
    XAxis: recharts.XAxis,
    YAxis: recharts.YAxis,
    CartesianGrid: recharts.CartesianGrid,
    Tooltip: recharts.Tooltip,
    Legend: recharts.Legend,
    ResponsiveContainer: recharts.ResponsiveContainer
  };
} catch (error) {
  console.warn('Recharts not installed, using fallback charts');
  RechartsComponents = null;
}

const HealthTracker = () => {
  const [activeTab, setActiveTab] = useState('bloodPressure');
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newRecord, setNewRecord] = useState({
    type: 'bloodPressure',
    value: '',
    unit: '',
    notes: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  });

  // Health metrics data
  const [healthMetrics, setHealthMetrics] = useState({
    bloodPressure: [],
    heartRate: [],
    weight: [],
    temperature: [],
    bloodSugar: [],
    medication: []
  });

  // Metric types configuration - memoized to prevent unnecessary re-renders
  const metricTypes = useMemo(() => [
    {
      id: 'bloodPressure',
      name: 'Blood Pressure',
      icon: Heart,
      color: '#EF4444',
      unit: 'mmHg',
      normalRange: '120/80',
      description: 'Systolic/Diastolic pressure',
      min: 0,
      max: 200
    },
    {
      id: 'heartRate',
      name: 'Heart Rate',
      icon: Activity,
      color: '#10B981',
      unit: 'bpm',
      normalRange: '60-100',
      description: 'Beats per minute',
      min: 40,
      max: 200
    },
    {
      id: 'weight',
      name: 'Weight',
      icon: Weight,
      color: '#3B82F6',
      unit: 'kg',
      normalRange: 'Based on BMI',
      description: 'Body weight tracking',
      min: 0,
      max: 200
    },
    {
      id: 'temperature',
      name: 'Temperature',
      icon: Thermometer,
      color: '#F59E0B',
      unit: '°C',
      normalRange: '36.5-37.5',
      description: 'Body temperature',
      min: 35,
      max: 42
    },
    {
      id: 'bloodSugar',
      name: 'Blood Sugar',
      icon: Droplets,
      color: '#8B5CF6',
      unit: 'mg/dL',
      normalRange: '70-140',
      description: 'Glucose levels',
      min: 50,
      max: 300
    },
    {
      id: 'medication',
      name: 'Medication',
      icon: Pill,
      color: '#EC4899',
      unit: 'Doses',
      normalRange: 'As prescribed',
      description: 'Medication adherence',
      min: 0,
      max: 10
    }
  ], []);

  // Recent health records - sample data
  const recentRecords = useMemo(() => [
    {
      id: 1,
      type: 'bloodPressure',
      value: '120/80',
      status: 'normal',
      date: new Date().toISOString().split('T')[0],
      time: '09:00',
      notes: 'Morning reading after breakfast'
    },
    {
      id: 2,
      type: 'heartRate',
      value: '72',
      status: 'normal',
      date: new Date().toISOString().split('T')[0],
      time: '09:15',
      notes: 'Resting heart rate'
    },
    {
      id: 3,
      type: 'bloodSugar',
      value: '95',
      status: 'normal',
      date: new Date().toISOString().split('T')[0],
      time: '08:00',
      notes: 'Fasting glucose'
    },
    {
      id: 4,
      type: 'weight',
      value: '74.2',
      status: 'good',
      date: new Date().toISOString().split('T')[0],
      time: '08:30',
      notes: 'Weekly weight check'
    },
    {
      id: 5,
      type: 'medication',
      value: '1',
      status: 'good',
      date: new Date().toISOString().split('T')[0],
      time: '08:00',
      notes: 'Morning medication dose'
    }
  ], []);

  // Health insights
  const healthInsights = useMemo(() => [
    {
      id: 1,
      title: 'Blood Pressure Trend',
      description: 'Your blood pressure has been stable over the past week.',
      status: 'good',
      icon: TrendingDown
    },
    {
      id: 2,
      title: 'Weight Loss Progress',
      description: 'You have lost 1.3kg in the last 7 days. Keep it up!',
      status: 'excellent',
      icon: TrendingDown
    },
    {
      id: 3,
      title: 'Heart Rate Consistency',
      description: 'Your heart rate remains within normal range consistently.',
      status: 'good',
      icon: CheckCircle
    },
    {
      id: 4,
      title: 'Medication Adherence',
      description: 'Perfect medication adherence this week.',
      status: 'excellent',
      icon: CheckCircle
    }
  ], []);

  // Load initial data
  useEffect(() => {
    const loadSampleData = () => {
      try {
        const now = new Date();
        const sampleData = {
          bloodPressure: Array.from({ length: 7 }, (_, i) => {
            const date = new Date(now);
            date.setDate(date.getDate() - (6 - i));
            return {
              date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              systolic: 118 + Math.floor(Math.random() * 6),
              diastolic: 78 + Math.floor(Math.random() * 4)
            };
          }),
          heartRate: Array.from({ length: 7 }, (_, i) => {
            const date = new Date(now);
            date.setDate(date.getDate() - (6 - i));
            return {
              date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              rate: 68 + Math.floor(Math.random() * 8)
            };
          }),
          weight: Array.from({ length: 7 }, (_, i) => {
            const date = new Date(now);
            date.setDate(date.getDate() - (6 - i));
            return {
              date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              weight: 74.2 - (i * 0.2) + (Math.random() * 0.4 - 0.2)
            };
          }),
          temperature: Array.from({ length: 7 }, (_, i) => {
            const date = new Date(now);
            date.setDate(date.getDate() - (6 - i));
            return {
              date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              temp: 36.6 + (Math.random() * 0.4)
            };
          }),
          bloodSugar: Array.from({ length: 7 }, (_, i) => {
            const date = new Date(now);
            date.setDate(date.getDate() - (6 - i));
            return {
              date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
              fasting: 92 + Math.floor(Math.random() * 8),
              postMeal: 138 + Math.floor(Math.random() * 8)
            };
          }),
          medication: Array.from({ length: 7 }, (_, i) => ({
            date: `Day ${i + 1}`,
            taken: true,
            dose: 1
          }))
        };

        setHealthMetrics(sampleData);
      } catch (error) {
        console.error('Error loading sample data:', error);
        toast.error('Failed to load health data');
      } finally {
        setLoading(false);
      }
    };

    // Simulate API call
    setTimeout(loadSampleData, 1000);
  }, []);

  // Get current metric data
  const getCurrentMetric = useCallback((type) => {
    const data = healthMetrics[type];
    if (!data || data.length === 0) return null;
    return data[data.length - 1];
  }, [healthMetrics]);

  // Validate health record
  const validateRecord = useCallback((record) => {
    if (!record.value.trim()) {
      return 'Please enter a value';
    }

    const metric = metricTypes.find(m => m.id === record.type);
    if (!metric) return 'Invalid metric type';

    // Validate based on metric type
    if (record.type === 'bloodPressure') {
      const [systolic, diastolic] = record.value.split('/').map(Number);
      if (isNaN(systolic) || isNaN(diastolic)) {
        return 'Please enter blood pressure in format: systolic/diastolic';
      }
      if (systolic < metric.min || systolic > metric.max || 
          diastolic < metric.min || diastolic > metric.max) {
        return `Blood pressure should be between ${metric.min} and ${metric.max}`;
      }
    } else {
      const value = parseFloat(record.value);
      if (isNaN(value)) {
        return 'Please enter a valid number';
      }
      if (value < metric.min || value > metric.max) {
        return `${metric.name} should be between ${metric.min} and ${metric.max} ${metric.unit}`;
      }
    }

    if (!record.date) return 'Please select a date';
    if (!record.time) return 'Please select a time';

    return null;
  }, [metricTypes]);

  // Add new health record
  const handleAddRecord = useCallback(async () => {
    const validationError = validateRecord(newRecord);
    if (validationError) {
      toast.error(validationError);
      return;
    }

    setSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedMetrics = { ...healthMetrics };
      const type = newRecord.type;
      const [systolic, diastolic] = newRecord.value.split('/').map(Number);
      const numericValue = parseFloat(newRecord.value);
      
      const newEntry = {
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        ...(type === 'bloodPressure' ? { systolic, diastolic } : 
            type === 'bloodSugar' ? { fasting: numericValue, postMeal: numericValue + 45 } :
            { [type === 'heartRate' ? 'rate' : type === 'weight' ? 'weight' : 'temp']: numericValue })
      };

      updatedMetrics[type] = [...(updatedMetrics[type] || []), newEntry];
      
      setHealthMetrics(updatedMetrics);
      setShowAddForm(false);
      setNewRecord({
        type: 'bloodPressure',
        value: '',
        unit: '',
        notes: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
      });
      
      toast.success('Health record added successfully');
    } catch (error) {
      console.error('Error adding record:', error);
      toast.error('Failed to add health record');
    } finally {
      setSubmitting(false);
    }
  }, [newRecord, healthMetrics, validateRecord]);

  // Get status color
  const getStatusColor = useCallback((status) => {
    const colors = {
      excellent: 'bg-green-100 text-green-800 border-green-200',
      good: 'bg-blue-100 text-blue-800 border-blue-200',
      normal: 'bg-gray-100 text-gray-800 border-gray-200',
      warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      danger: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || colors.normal;
  }, []);

  // Get icon for metric type
  const getMetricIcon = useCallback((type) => {
    const metric = metricTypes.find(m => m.id === type);
    return metric ? metric.icon : Activity;
  }, [metricTypes]);

  // Render CSS-based chart as fallback
  const renderFallbackChart = useCallback((data, key, color) => {
    if (!data || data.length === 0) {
      return (
        <div className="h-64 flex items-center justify-center text-gray-400">
          No data available
        </div>
      );
    }

    const values = data.map(d => d[key] || d.systolic || d.rate || d.weight || d.temp || d.fasting);
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    return (
      <div className="h-64 flex flex-col">
        <div className="flex-1 flex items-end gap-1 px-2">
          {data.map((item, index) => {
            const value = item[key] || item.systolic || item.rate || item.weight || item.temp || item.fasting;
            const height = ((value - min) / range) * 80 + 20;
            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-3/4 rounded-t transition-all duration-300 hover:opacity-100"
                  style={{
                    height: `${height}%`,
                    backgroundColor: color,
                    opacity: 0.7
                  }}
                  title={`${value}${key === 'temp' ? '°C' : key === 'weight' ? 'kg' : ''}`}
                ></div>
                <div className="text-xs text-gray-500 mt-1 truncate w-full text-center">
                  {item.date}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }, []);

  // Render chart
  const renderChart = useCallback(() => {
    const metric = metricTypes.find(m => m.id === activeTab);
    const data = healthMetrics[activeTab] || [];

    if (!metric || data.length === 0) {
      return renderFallbackChart(data, 'value', metric?.color || '#3B82F6');
    }

    if (RechartsComponents) {
      const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } = RechartsComponents;
      
      return (
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis 
              dataKey="date" 
              stroke="#6B7280"
              fontSize={12}
            />
            <YAxis 
              stroke="#6B7280"
              fontSize={12}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #E5E7EB',
                borderRadius: '8px',
                padding: '8px'
              }}
            />
            <Legend />
            {activeTab === 'bloodPressure' ? (
              <>
                <Line 
                  type="monotone" 
                  dataKey="systolic" 
                  stroke="#EF4444" 
                  name="Systolic" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="diastolic" 
                  stroke="#3B82F6" 
                  name="Diastolic" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </>
            ) : activeTab === 'bloodSugar' ? (
              <>
                <Line 
                  type="monotone" 
                  dataKey="fasting" 
                  stroke="#8B5CF6" 
                  name="Fasting" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="postMeal" 
                  stroke="#EC4899" 
                  name="Post-Meal" 
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </>
            ) : (
              <Line 
                type="monotone" 
                dataKey={activeTab === 'heartRate' ? 'rate' : activeTab === 'weight' ? 'weight' : 'temp'} 
                stroke={metric.color} 
                name={metric.name}
                strokeWidth={2}
                dot={{ r: 4 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      );
    }

    // Fallback to CSS chart
    const key = activeTab === 'heartRate' ? 'rate' : 
                activeTab === 'weight' ? 'weight' : 
                activeTab === 'temperature' ? 'temp' : 'systolic';
    
    return renderFallbackChart(data, key, metric.color);
  }, [activeTab, healthMetrics, metricTypes, renderFallbackChart]);

  // Format time for display
  const formatTime = useCallback((time) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours, 10);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${period}`;
  }, []);

  // Handle input change
  const handleInputChange = useCallback((field, value) => {
    setNewRecord(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading health tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Health Tracker</h1>
              <p className="text-gray-600 mt-1 md:mt-2">Monitor and track your health metrics</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                className="flex items-center gap-2 px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm md:text-base"
                onClick={() => toast.info('Export feature coming soon')}
              >
                <Download className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden md:inline">Export Data</span>
              </button>
              <button 
                className="flex items-center gap-2 px-3 md:px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm md:text-base"
                onClick={() => toast.info('Share feature coming soon')}
              >
                <Share2 className="w-4 h-4 md:w-5 md:h-5" />
                <span className="hidden md:inline">Share</span>
              </button>
              <button
                onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm md:text-base"
              >
                <Plus className="w-4 h-4 md:w-5 md:h-5" />
                <span>Add Record</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Add Record Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl p-4 md:p-6 shadow-lg mb-6 md:mb-8 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900">Add Health Record</h2>
              <button
                onClick={() => setShowAddForm(false)}
                className="text-gray-500 hover:text-gray-700"
                disabled={submitting}
              >
                ✕
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Metric Type *
                </label>
                <select
                  value={newRecord.type}
                  onChange={(e) => handleInputChange('type', e.target.value)}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  disabled={submitting}
                >
                  {metricTypes.map(metric => (
                    <option key={metric.id} value={metric.id}>{metric.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">
                  Value *
                  <span className="text-xs text-gray-500 ml-1">
                    {newRecord.type === 'bloodPressure' ? '(e.g., 120/80)' : ''}
                  </span>
                </label>
                <input
                  type="text"
                  value={newRecord.value}
                  onChange={(e) => handleInputChange('value', e.target.value)}
                  placeholder={newRecord.type === 'bloodPressure' ? '120/80' : 'Enter value'}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  disabled={submitting}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Date *</label>
                <input
                  type="date"
                  value={newRecord.date}
                  onChange={(e) => handleInputChange('date', e.target.value)}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  disabled={submitting}
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Time *</label>
                <input
                  type="time"
                  value={newRecord.time}
                  onChange={(e) => handleInputChange('time', e.target.value)}
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  disabled={submitting}
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1 md:mb-2">Notes</label>
                <textarea
                  value={newRecord.notes}
                  onChange={(e) => handleInputChange('notes', e.target.value)}
                  rows="2"
                  className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  placeholder="Add any notes or observations..."
                  disabled={submitting}
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 mt-4 md:mt-6">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-3 md:px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm md:text-base"
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                onClick={handleAddRecord}
                disabled={submitting}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Record'
                )}
              </button>
            </div>
          </motion.div>
        )}

        {/* Metric Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4 mb-6 md:mb-8">
          {metricTypes.map((metric, index) => {
            const currentData = getCurrentMetric(metric.id);
            const Icon = metric.icon;
            const isActive = activeTab === metric.id;
            
            return (
              <motion.button
                key={metric.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-lg md:rounded-xl p-3 md:p-4 shadow-sm border transition-all duration-200 ${
                  isActive 
                    ? 'ring-2 ring-blue-500 border-blue-200 transform scale-105' 
                    : 'border-gray-200 hover:border-blue-300 hover:shadow-md'
                }`}
                onClick={() => setActiveTab(metric.id)}
                aria-pressed={isActive}
              >
                <div className="flex items-center justify-between mb-2 md:mb-3">
                  <div 
                    className="p-1.5 md:p-2 rounded-lg"
                    style={{ backgroundColor: `${metric.color}20` }}
                  >
                    <Icon className="w-4 h-4 md:w-5 md:h-5" style={{ color: metric.color }} />
                  </div>
                  <span className="text-xs px-1.5 md:px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {metric.unit}
                  </span>
                </div>
                <h3 className="text-xs md:text-sm font-medium text-gray-700 mb-1 text-left truncate">
                  {metric.name}
                </h3>
                <div className="text-lg md:text-2xl font-bold text-gray-900 mb-1 text-left">
                  {currentData ? (
                    metric.id === 'bloodPressure' ? 
                      `${currentData.systolic}/${currentData.diastolic}` :
                    metric.id === 'bloodSugar' ?
                      `${currentData.fasting}` :
                    metric.id === 'weight' ?
                      `${currentData.weight.toFixed(1)}` :
                    metric.id === 'temperature' ?
                      `${currentData.temp.toFixed(1)}` :
                      `${currentData.rate || currentData}`
                  ) : '--'}
                </div>
                <p className="text-xs text-gray-500 text-left truncate">{metric.normalRange}</p>
              </motion.button>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
          {/* Left Column - Chart and Insights */}
          <div className="lg:col-span-2 space-y-4 md:space-y-6 lg:space-y-8">
            {/* Chart Container */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 md:mb-6">
                <div className="flex items-center gap-2">
                  <BarChart2 className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">
                    {metricTypes.find(m => m.id === activeTab)?.name || 'Health Trends'}
                  </h2>
                </div>
                <div className="flex gap-1 md:gap-2">
                  {['7D', '30D', '90D'].map((period) => (
                    <button
                      key={period}
                      className="px-2 md:px-3 py-1 text-xs md:text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => toast.info(`${period} view coming soon`)}
                    >
                      {period}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-64 md:h-80">
                {renderChart()}
              </div>
            </div>

            {/* Health Insights */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <LineChartIcon className="w-5 h-5 text-gray-600" />
                <h2 className="text-lg md:text-xl font-semibold text-gray-900">Health Insights</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {healthInsights.map((insight, index) => {
                  const Icon = insight.icon;
                  return (
                    <motion.div
                      key={insight.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="p-3 md:p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start gap-3">
                        <div className={`p-2 rounded-lg border ${getStatusColor(insight.status)}`}>
                          <Icon className="w-4 h-4 md:w-5 md:h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 text-sm md:text-base">
                            {insight.title}
                          </h3>
                          <p className="text-xs md:text-sm text-gray-600 mt-1">
                            {insight.description}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Records and Stats */}
          <div className="space-y-4 md:space-y-6 lg:space-y-8">
            {/* Recent Records */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <div className="flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg md:text-xl font-semibold text-gray-900">Recent Records</h2>
                </div>
                <button 
                  className="text-blue-600 hover:text-blue-700 text-sm font-medium transition-colors"
                  onClick={() => toast.info('View all records coming soon')}
                >
                  View All
                </button>
              </div>
              <div className="space-y-3">
                {recentRecords.map((record, index) => {
                  const Icon = getMetricIcon(record.type);
                  const metric = metricTypes.find(m => m.id === record.type);
                  return (
                    <motion.div
                      key={record.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div 
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${metric?.color}20` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: metric?.color }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-gray-900 text-sm truncate">
                            {metric?.name || record.type}
                          </p>
                          <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(record.status)}`}>
                            {record.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {record.value}
                          {record.type !== 'medication' ? metric?.unit : ''}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <Calendar className="w-3 h-3" />
                          <span>{record.date}</span>
                          <Clock className="w-3 h-3" />
                          <span>{formatTime(record.time)}</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Health Statistics */}
            <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg md:text-xl font-semibold text-gray-900 mb-4 md:mb-6">Statistics</h2>
              <div className="space-y-3 md:space-y-4">
                {[
                  { label: 'Records This Week', value: '24', change: '+3' },
                  { label: 'Medication Adherence', value: '100%', change: 'Excellent' },
                  { label: 'Days in Normal Range', value: '7/7', change: 'Perfect' },
                  { label: 'Weight Change', value: '-1.3kg', change: 'Good' }
                ].map((stat, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-gray-600 text-sm md:text-base">{stat.label}</span>
                    <div className="text-right">
                      <div className="font-semibold text-gray-900 text-sm md:text-base">{stat.value}</div>
                      <div className="text-xs text-green-600">{stat.change}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 md:p-6 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-3 md:mb-4">Quick Actions</h3>
              <div className="space-y-2">
                {[
                  { label: 'Schedule Doctor Appointment', icon: ChevronRight },
                  { label: 'Set Medication Reminder', icon: ChevronRight },
                  { label: 'Download Health Report', icon: ChevronRight }
                ].map((action, index) => (
                  <button
                    key={index}
                    className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors group"
                    onClick={() => toast.info(`${action.label} coming soon`)}
                  >
                    <span className="text-blue-700 font-medium text-sm md:text-base">
                      {action.label}
                    </span>
                    <action.icon className="w-4 h-4 md:w-5 md:h-5 text-blue-500 group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HealthTracker;