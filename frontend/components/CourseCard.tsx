import Image from 'next/image';
import { Course } from '@/types';

interface CourseCardProps {
  course: Course;
  onBuy: (course: Course) => void;
}

export default function CourseCard({ course, onBuy }: CourseCardProps) {
  const hasDiscount = course.discountPercentage > 0;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="relative h-48 w-full">
        <Image
          src={course.imageUrl}
          alt={course.name}
          fill
          className="object-cover"
        />
        {hasDiscount && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
            -{course.discountPercentage}%
          </div>
        )}
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          {course.name}
        </h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {course.description}
        </p>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            {hasDiscount ? (
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-primary">
                  ${course.finalPrice.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500 line-through">
                  ${course.fullPrice.toFixed(2)}
                </span>
              </div>
            ) : (
              <span className="text-2xl font-bold text-primary">
                ${course.finalPrice.toFixed(2)}
              </span>
            )}
          </div>
        </div>
        
        <button
          onClick={() => onBuy(course)}
          className="w-full bg-primary hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors duration-200"
        >
          Buy Course
        </button>
      </div>
    </div>
  );
}
