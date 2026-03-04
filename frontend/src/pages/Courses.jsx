import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import AppLayout from "../components/layout/AppLayout";
import { useToast } from "../context/ToastContext";

function Courses() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [subjects, setSubjects] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(null);
  const [justEnrolled, setJustEnrolled] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [subjectsRes, enrollmentsRes] = await Promise.all([
          api.get("/subjects"),
          api.get("/enrollments/me")
        ]);

        setSubjects(subjectsRes.data);
        setEnrolledIds(
          new Set(enrollmentsRes.data.map(e => e.Subject.id))
        );
      } catch (error) {
        showToast("Failed to load courses", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleEnroll = async (subjectId) => {
    try {
      setEnrolling(subjectId);

      await api.post("/enrollments", { subjectId });

      setJustEnrolled(subjectId);
      showToast("Enrolled successfully", "success");

      setTimeout(() => {
        navigate(`/course/${subjectId}?resume=1`);
      }, 500);
    } catch (error) {
      showToast(
        error.response?.data?.message || "Enrollment failed",
        "error"
      );
      setEnrolling(null);
    }
  };

  const handleContinue = (subjectId) => {
    navigate(`/course/${subjectId}?resume=1`);
  };

  return (
    <AppLayout title="Browse Courses">
      <div className="max-w-[1200px] mx-auto px-6">

        <div className="bg-[#111827] rounded-2xl p-12 md:p-16 border border-[#1f2937]">

          <div className="mb-14">
            <h1 className="text-4xl font-bold tracking-tight mb-3 text-[#e2e8f0]">
              Browse Courses
            </h1>
            <p className="text-sm text-[#94a3b8]">
              Discover and enroll in new subjects.
            </p>
          </div>

          {loading && (
            <div className="grid md:grid-cols-2 gap-8">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-[#1f2937] rounded-xl p-8 border border-[#263043] animate-[pulse_1.5s_ease-in-out_infinite]"
                >
                  <div className="h-6 w-2/3 bg-[#263043] rounded mb-5" />
                  <div className="space-y-2.5 mb-10">
                    <div className="h-3 bg-[#263043] rounded w-full" />
                    <div className="h-3 bg-[#263043] rounded w-5/6" />
                  </div>
                  <div className="h-11 w-32 bg-[#263043] rounded-lg" />
                </div>
              ))}
            </div>
          )}

          {!loading && subjects.length === 0 && (
            <div className="text-center py-20">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-[#1f2937] border border-[#263043] flex items-center justify-center">
                <svg className="w-8 h-8 text-[#94a3b8]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3 text-[#e2e8f0]">
                No Courses Available
              </h3>
              <p className="text-sm text-[#94a3b8]">
                Check back later for new courses.
              </p>
            </div>
          )}

          {!loading && subjects.length > 0 && (
            <div className="grid md:grid-cols-2 gap-8">
              {subjects.map((subject) => {
                const isEnrolled = enrolledIds.has(subject.id);
                const isEnrolling = enrolling === subject.id;
                const isJustEnrolled = justEnrolled === subject.id;

                return (
                  <div
                    key={subject.id}
                    className="bg-[#1f2937] rounded-xl p-8 border border-[#263043] transition-all duration-200 ease-out hover:-translate-y-1 hover:shadow-xl hover:border-[#374151] flex flex-col relative cursor-pointer"
                  >
                    {isEnrolled && (
                      <div className="absolute top-6 right-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#1e293b] text-[#3b82f6] border border-[#334155]">
                          Enrolled
                        </span>
                      </div>
                    )}

                    <h3 className="text-xl font-semibold tracking-tight mb-3 text-[#e2e8f0] pr-24">
                      {subject.title}
                    </h3>

                    <p className="text-sm text-[#94a3b8] mb-10 leading-relaxed flex-grow">
                      {subject.description}
                    </p>

                    {isEnrolled ? (
                      <button
                        onClick={() => handleContinue(subject.id)}
                        className="bg-[#1e293b] hover:bg-[#334155] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg w-fit cursor-pointer"
                      >
                        Continue
                      </button>
                    ) : (
                      <button
                        onClick={() => handleEnroll(subject.id)}
                        disabled={isEnrolling || isJustEnrolled}
                        className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg w-fit disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                      >
                        {isEnrolling && (
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                        )}
                        {isEnrolling ? "Enrolling..." : isJustEnrolled ? "Enrolled" : "Enroll"}
                      </button>
                    )}
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

export default Courses;
