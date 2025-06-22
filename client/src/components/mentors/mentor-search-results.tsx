import { Mentor } from "@shared/schema";
import MentorSearchCard from "./mentor-search-card";
import { motion, AnimatePresence } from "framer-motion";

interface MentorSearchResultsProps {
  mentors: Mentor[];
  searchTerm: string;
  isLoading?: boolean;
}

export default function MentorSearchResults({ mentors, searchTerm, isLoading = false }: MentorSearchResultsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-gray-100 dark:bg-gray-800 animate-pulse rounded-lg h-64"></div>
        ))}
      </div>
    );
  }

  if (mentors.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium">No mentors found</h3>
        <p className="text-gray-500 dark:text-gray-400 mt-2">
          Try adjusting your search or explore different keywords
        </p>
      </div>
    );
  }

  return (
    <AnimatePresence>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
          >
            <MentorSearchCard mentor={mentor} searchTerm={searchTerm} />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
}