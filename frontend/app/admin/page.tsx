'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminApi, type Course } from '@/lib/api';

export default function AdminDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [purchases, setPurchases] = useState<any[]>([]);
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [showCustomersModal, setShowCustomersModal] = useState(false);
  const [selectedCourseCustomers, setSelectedCourseCustomers] = useState<any>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'courses' | 'purchases'>('courses');

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      router.push('/admin/login');
      return;
    }
    loadData();
  }, [router]);

  const loadData = async () => {
    try {
      const [coursesData, statsData, purchasesData] = await Promise.all([
        adminApi.getCourses(),
        adminApi.getStats(),
        adminApi.getPurchases(),
      ]);
      setCourses(coursesData);
      setStats(statsData);
      setPurchases(purchasesData.data || []);
    } catch (error) {
      console.error('Failed to load data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    router.push('/admin/login');
  };

  const handleCreateCourse = () => {
    setEditingCourse(null);
    setShowCourseModal(true);
  };

  const handleEditCourse = (course: Course) => {
    setEditingCourse(course);
    setShowCourseModal(true);
  };

  const handleDeleteCourse = async (id: number) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      await adminApi.deleteCourse(id);
      await loadData();
    } catch (error) {
      alert('Failed to delete course');
    }
  };

  const handleViewCustomers = async (course: Course) => {
    try {
      const data = await adminApi.getCourseCustomers(course.id);
      setSelectedCourseCustomers(data);
      setShowCustomersModal(true);
    } catch (error) {
      alert('Failed to load customers');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
          <button onClick={handleLogout} className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900">Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard title="Total Courses" value={stats.totalCourses} icon="📚" />
            <StatCard title="Active Courses" value={stats.activeCourses} icon="✅" />
            <StatCard title="Total Purchases" value={stats.totalPurchases} icon="🛒" />
            <StatCard title="Total Revenue" value={`$${stats.totalRevenue.toFixed(2)}`} icon="💰" />
          </div>
        )}

        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button onClick={() => setActiveTab('courses')} className={`${activeTab === 'courses' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Courses</button>
              <button onClick={() => setActiveTab('purchases')} className={`${activeTab === 'purchases' ? 'border-indigo-500 text-indigo-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Purchases ({purchases.length})</button>
            </nav>
          </div>
        </div>

        {activeTab === 'courses' && <CoursesTable courses={courses} onEdit={handleEditCourse} onDelete={handleDeleteCourse} onCreate={handleCreateCourse} onViewCustomers={handleViewCustomers} />}
        {activeTab === 'purchases' && <PurchasesTable purchases={purchases} />}
      </main>

      {showCourseModal && <CourseModal course={editingCourse} onClose={() => { setShowCourseModal(false); setEditingCourse(null); }} onSave={async () => { await loadData(); setShowCourseModal(false); setEditingCourse(null); }} />}
      {showCustomersModal && <CustomersModal data={selectedCourseCustomers} onClose={() => { setShowCustomersModal(false); setSelectedCourseCustomers(null); }} />}
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: string | number; icon: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-4xl">{icon}</div>
      </div>
    </div>
  );
}

function CoursesTable({ courses, onEdit, onDelete, onCreate, onViewCustomers }: any) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">Courses</h2>
        <button onClick={onCreate} className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">+ New Course</button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Discount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Start Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {courses.map((course: Course) => (
              <tr key={course.id}>
                <td className="px-6 py-4"><div className="flex items-center"><img src={course.imageUrl} alt={course.name} className="w-12 h-12 rounded object-cover mr-3" /><div><div className="font-medium text-gray-900">{course.name}</div><div className="text-sm text-gray-500">{course.title}</div></div></div></td>
                <td className="px-6 py-4 text-sm text-gray-900">${course.finalPrice.toFixed(2)}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{course.discountPercentage}%</td>
                <td className="px-6 py-4 text-sm text-gray-500">{course.startDate ? new Date(course.startDate).toLocaleDateString() : '-'}</td>
                <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>{course.isActive ? 'Active' : 'Inactive'}</span></td>
                <td className="px-6 py-4 text-right text-sm font-medium">
                  <button onClick={() => onViewCustomers(course)} className="text-green-600 hover:text-green-900 mr-3">Customers</button>
                  <button onClick={() => onEdit(course)} className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                  <button onClick={() => onDelete(course.id)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PurchasesTable({ purchases }: any) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="px-6 py-4 border-b border-gray-200"><h2 className="text-xl font-semibold text-gray-900">All Purchases</h2></div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchase Code</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Course</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {purchases.length === 0 ? (
              <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">No purchases yet</td></tr>
            ) : (
              purchases.map((purchase: any) => (
                <tr key={purchase.purchaseCode}>
                  <td className="px-6 py-4"><div className="font-mono text-sm font-semibold text-indigo-600">{purchase.purchaseCode}</div></td>
                  <td className="px-6 py-4"><div className="text-sm text-gray-900">{purchase.customer.email}</div>{purchase.customer.fullName && <div className="text-sm text-gray-500">{purchase.customer.fullName}</div>}</td>
                  <td className="px-6 py-4"><div className="text-sm font-medium text-gray-900">{purchase.course.name}</div></td>
                  <td className="px-6 py-4 text-sm text-gray-900">${purchase.amountPaid.toFixed(2)}</td>
                  <td className="px-6 py-4"><span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${purchase.paymentStatus === 'COMPLETED' ? 'bg-green-100 text-green-800' : purchase.paymentStatus === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{purchase.paymentStatus}</span></td>
                  <td className="px-6 py-4 text-sm text-gray-500">{new Date(purchase.purchasedAt).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function CourseModal({ course, onClose, onSave }: { course: Course | null; onClose: () => void; onSave: () => void }) {
  const [formData, setFormData] = useState({ 
    name: course?.name || '', 
    title: course?.title || '', 
    description: course?.description || '', 
    imageUrl: course?.imageUrl || '', 
    fullPrice: course?.fullPrice || 0, 
    discountPercentage: course?.discountPercentage || 0, 
    isActive: course?.isActive !== undefined ? course.isActive : true,
    startDate: course?.startDate ? course.startDate.split('T')[0] : ''
  });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const submitData: any = { ...formData };
      if (submitData.startDate) {
        submitData.startDate = new Date(submitData.startDate).toISOString();
      } else {
        submitData.startDate = null;
      }
      if (course) { await adminApi.updateCourse(course.id, submitData); } else { await adminApi.createCourse(submitData); }
      onSave();
    } catch (error) {
      alert('Failed to save course');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">{course ? 'Edit Course' : 'Create Course'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Course Name *</label><input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Master React Development" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Subtitle *</label><input type="text" required value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="e.g., Build modern web applications" /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Description *</label><textarea required rows={4} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="Course description..." /></div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label><input type="url" required value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" placeholder="https://example.com/image.jpg" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Full Price (USD) *</label><input type="number" required min="0" step="0.01" value={formData.fullPrice} onChange={(e) => setFormData({ ...formData, fullPrice: parseFloat(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" /></div>
            <div><label className="block text-sm font-medium text-gray-700 mb-1">Discount %</label><input type="number" min="0" max="100" step="1" value={formData.discountPercentage} onChange={(e) => setFormData({ ...formData, discountPercentage: parseFloat(e.target.value) })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" /></div>
          </div>
          <div><label className="block text-sm font-medium text-gray-700 mb-1">Course Start Date</label><input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" /></div>
          {course && <div className="flex items-center"><input type="checkbox" id="isActive" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} className="w-4 h-4 text-indigo-600" /><label htmlFor="isActive" className="ml-2 text-sm text-gray-700">Active (visible to customers)</label></div>}
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={onClose} className="px-6 py-2 border rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={saving} className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50">{saving ? 'Saving...' : course ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function CustomersModal({ data, onClose }: { data: any; onClose: () => void }) {
  if (!data) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Course Customers</h2>
            <p className="text-sm text-gray-500 mt-1">{data.courseName} - {data.totalCustomers} customer{data.totalCustomers !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>
        <div className="p-6">
          {data.customers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No customers have purchased this course yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchase Code</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Purchase Date</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {data.customers.map((customer: any) => (
                    <tr key={customer.id}>
                      <td className="px-4 py-4">
                        <div className="text-sm font-medium text-gray-900">{customer.email}</div>
                        {customer.fullName && <div className="text-sm text-gray-500">{customer.fullName}</div>}
                      </td>
                      <td className="px-4 py-4">
                        <div className="font-mono text-sm text-indigo-600">{customer.purchaseCode}</div>
                      </td>
                      <td className="px-4 py-4 text-sm text-gray-900">${customer.amountPaid.toFixed(2)}</td>
                      <td className="px-4 py-4 text-sm text-gray-500">{new Date(customer.purchasedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
