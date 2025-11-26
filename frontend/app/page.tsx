'use client';

import { useEffect, useState } from 'react';
import { courseApi } from '@/lib/api';
import { Course } from '@/types';
import CourseCard from '@/components/CourseCard';
import CheckoutModal from '@/components/CheckoutModal';

export default function Home() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const data = await courseApi.getCourses();
      setCourses(data);
    } catch (error) {
      console.error('Failed to load courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyCourse = (course: Course) => {
    setSelectedCourse(course);
  };

  const handleCloseCheckout = () => {
    setSelectedCourse(null);
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-primary">Course Vendor</h1>
          <p className="mt-2 text-gray-600">Elevate your skills with our premium courses</p>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-indigo-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            Learn From The Best
          </h2>
          <p className="text-xl md:text-2xl mb-8 opacity-90">
            Master new skills with our expert-led online courses
          </p>
          <div className="flex justify-center gap-4 flex-wrap">
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="font-semibold">✓ Lifetime Access</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="font-semibold">✓ Expert Instructors</span>
            </div>
            <div className="bg-white/10 backdrop-blur-sm px-6 py-3 rounded-full">
              <span className="font-semibold">✓ Money-Back Guarantee</span>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Featured Courses</h2>
        
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading courses...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {courses.map((course) => (
              <CourseCard
                key={course.id}
                course={course}
                onBuy={handleBuyCourse}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-400">
              © 2024 Course Vendor. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Checkout Modal */}
      {selectedCourse && (
        <CheckoutModal
          course={selectedCourse}
          onClose={handleCloseCheckout}
        />
      )}
    </main>
  );
}
