import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AppLayout from "../components/layout/AppLayout";

function Home() {
  const navigate = useNavigate();

  const [enrollments, setEnrollments] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        const [enrollmentRes, progressRes] = await Promise.all([
          api.get("/enrollments/me"),
          api.get("/progress/overview")
        ]);

        setEnrollments(enrollmentRes.data);
        setProgressMap(progressRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getButtonLabel = (percentage) => {
    if (!percentage || percentage === 0) return "Start Course";
    if (percentage === 100) return "Review Course";
    return "Resume Course";
  };

  return (
    <AppLayout title="Dashboard">
      <div className="max-w-[1200px] mx-auto px-6">

        <div className="bg-[#111827] rounded-2xl p-12 md:p-16 border border-[#1f2937]">

          <div className="mb-14">
            <h1 className="text-4xl font-bold mb-3 text-[#e2e8f0]">
              Dashboard
            </h1>
            <p className="text-sm text-[#94a3b8]">
              Track your learning journey and monitor your progress.
            </p>
          </div>

          {error && (
            <div className="bg-[#1f2937] border border-[#ef4444] rounded-lg p-4 mb-8">
              <p className="text-[#ef4444] text-sm">{error}</p>
            </div>
          )}

          {loading && (
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-[#1f2937] rounded-xl p-8 border border-[#263043] animate-pulse"
                >
                  <div className="h-6 w-2/3 bg-[#263043] rounded mb-5" />

                  <div className="space-y-2.5 mb-10">
                    <div className="h-3 bg-[#263043] rounded w-full" />
                    <div className="h-3 bg-[#263043] rounded w-5/6" />
                  </div>

                  <div className="mb-8">
                    <div className="flex justify-between mb-2.5">
                      <div className="h-3 w-16 bg-[#263043] rounded" />
                      <div className="h-3 w-10 bg-[#263043] rounded" />
                    </div>

                    <div className="h-2.5 bg-[#0b1220] rounded-full overflow-hidden">
                      <div className="h-2.5 bg-[#263043] w-1/2 rounded-full" />
                    </div>
                  </div>

                  <div className="h-11 w-32 bg-[#263043] rounded-lg" />
                </div>
              ))}
            </div>
          )}

          {!loading && enrollments.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#1f2937] border border-[#263043] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#e2e8f0]">
                No Courses Yet
              </h3>
              <p className="text-sm text-[#94a3b8] mb-8 max-w-md mx-auto">
                You haven't enrolled in any courses yet. Start your learning journey today.
              </p>
              <button
                onClick={() => navigate("/courses")}
                className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 ease-out hover:-translate-y-0.5"
              >
                Browse Courses
              </button>
            </div>
          )}

          {!loading && enrollments.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {enrollments.map((enrollment) => {
                const subject = enrollment.Subject;
                const progress = progressMap[subject.id] || {};
                const percentage = progress.percentage || 0;

                return (
                  <div
                    key={enrollment.id}
                    className="bg-[#1f2937] rounded-xl p-8 border border-[#263043] transition-all duration-200 ease-out hover:-translate-y-1 hover:border-[#374151] flex flex-col"
                  >
                    {percentage === 100 && (
                      <div className="mb-4 px-4 py-2 bg-[#1e293b] border border-[#3b82f6] rounded-lg">
                        <p className="text-xs font-medium text-[#3b82f6] text-center">
                          Course Completed
                        </p>
                      </div>
                    )}

                    <h3 className="text-xl font-semibold mb-3 text-[#e2e8f0]">
                      {subject.title}
                    </h3>

                    <p className="text-sm text-[#94a3b8] mb-10 leading-relaxed flex-grow">
                      {subject.description}
                    </p>

                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xs uppercase tracking-wide text-[#94a3b8] font-medium">
                          Progress
                        </span>
                        <span className="text-sm font-semibold text-[#3b82f6]">
                          {percentage}%
                        </span>
                      </div>

                      <div className="h-2.5 bg-[#0b1220] rounded-full overflow-hidden">
                        <div
                          className="h-2.5 bg-[#3b82f6] transition-all duration-200 ease-out"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>

                    <button
                      onClick={() => navigate(`/course/${subject.id}?resume=1`)}
                      className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 w-fit"
                    >
                      {getButtonLabel(percentage)}
                    </button>
                  </div>
                );
              })}
            </div>
          )}

        </div>
      </div>
    </AppLayout>
  );
}

export default Home;