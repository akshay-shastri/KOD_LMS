import { useEffect, useState, useRef } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Player from "@vimeo/player";
import api from "../services/api";
import AppLayout from "../components/layout/AppLayout";
import { useToast } from "../context/ToastContext";

function CourseDetails() {
  const { subjectId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const playerRef = useRef(null);
  const saveIntervalRef = useRef(null);

  const [subject, setSubject] = useState(null);
  const [sections, setSections] = useState([]);
  const [videos, setVideos] = useState({});
  const [activeVideo, setActiveVideo] = useState(null);
  const [expandedSectionId, setExpandedSectionId] = useState(null);
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [markingComplete, setMarkingComplete] = useState(false);
  const [isVideoTransitioning, setIsVideoTransitioning] = useState(false);
  const [isEnrolled, setIsEnrolled] = useState(null);
  const [justCompleted, setJustCompleted] = useState(false);

  useEffect(() => {
    if (activeVideo) {
      console.log("Active Video URL:", activeVideo.videoUrl);
    }
  }, [activeVideo]);

  useEffect(() => {
    const initializeCourse = async () => {
      try {
        setLoading(true);

        const enrollmentRes = await api.get("/enrollments/me");
        const enrolled = enrollmentRes.data.some(
          (enrollment) =>
            String(enrollment.Subject.id) === String(subjectId)
        );

        if (!enrolled) {
          setIsEnrolled(false);
          setLoading(false);
          return;
        }

        setIsEnrolled(true);

        const enrolledSubject = enrollmentRes.data.find(
          e => String(e.Subject.id) === String(subjectId)
        );
        setSubject(enrolledSubject?.Subject);

        const [sectionRes, progressRes] = await Promise.all([
          api.get(`/sections/${subjectId}`),
          api.get(`/progress/${subjectId}`)
        ]);

        const sectionData = sectionRes.data;
        const progress = progressRes.data;

        setSections(sectionData);
        setProgressData(progress);

        if (!sectionData.length) return;

        if (progress.nextVideo) {
          const next = progress.nextVideo;

          const videoRes = await api.get(`/videos/${next.sectionId}`);

          setVideos(prev => ({
            ...prev,
            [next.sectionId]: videoRes.data
          }));

          const selectedVideo = videoRes.data.find(v => v.id === next.id);

          setActiveVideo(selectedVideo);
          setExpandedSectionId(next.sectionId);
        } else {
          const firstSection = sectionData[0];

          const videoRes = await api.get(`/videos/${firstSection.id}`);

          setVideos(prev => ({
            ...prev,
            [firstSection.id]: videoRes.data
          }));

          if (videoRes.data.length > 0) {
            setActiveVideo(videoRes.data[0]);
            setExpandedSectionId(firstSection.id);
          }
        }
      } catch {
        showToast("Failed to load course", "error");
      } finally {
        setLoading(false);
      }
    };

    initializeCourse();
  }, [subjectId, location.search]);

  /* ---------------- Vimeo Player Setup ---------------- */

  useEffect(() => {
    if (!activeVideo || !videoContainerRef.current) return;

    if (playerRef.current) {
      playerRef.current.destroy();
      playerRef.current = null;
    }

    const extractVimeoId = (url) => {
      const match = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
      return match ? match[1] : null;
    };

    const vimeoId = extractVimeoId(activeVideo.videoUrl);
    if (!vimeoId) return;

    const player = new Player(videoContainerRef.current, {
      id: vimeoId,
      responsive: true
    });

    playerRef.current = player;

    let lastSaved = 0;

    player.on("loaded", async () => {
      const lastWatched =
        progressData?.lastWatchedMap?.[activeVideo.id] || 0;

      if (lastWatched > 0) {
        await player.setCurrentTime(lastWatched);
        lastSaved = lastWatched;
      }
    });

    player.on("timeupdate", async (data) => {
      const currentTime = Math.floor(data.seconds);

      if (
        !progressData?.completedVideoIds?.includes(activeVideo.id) &&
        currentTime - lastSaved >= 5
      ) {
        lastSaved = currentTime;

        await api.post("/progress/timestamp", {
          videoId: activeVideo.id,
          seconds: currentTime
        });
      }
    });

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
        playerRef.current = null;
      }
    };
  }, [activeVideo]);

  const toggleSection = async (sectionId) => {
    if (expandedSectionId === sectionId) {
      setExpandedSectionId(null);
      return;
    }

    setExpandedSectionId(sectionId);

    if (!videos[sectionId]) {
      const res = await api.get(`/videos/${sectionId}`);
      setVideos(prev => ({
        ...prev,
        [sectionId]: res.data
      }));
    }
  };

  const changeVideo = (video, isLocked) => {
    if (!video || activeVideo?.id === video.id) return;
    if (isLocked) return;

    setIsVideoTransitioning(true);

    setTimeout(() => {
      setActiveVideo(video);
      setIsVideoTransitioning(false);

      videoRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    }, 200);
  };

  const getAllVideos = () => {
    const allVideos = [];
    sections.forEach(section => {
      if (videos[section.id]) {
        videos[section.id].forEach(video => {
          allVideos.push(video);
        });
      }
    });
    return allVideos;
  };

  const getCurrentVideoIndex = () => {
    const allVideos = getAllVideos();
    return allVideos.findIndex(v => v.id === activeVideo?.id);
  };

  const navigateToPrevious = () => {
    const allVideos = getAllVideos();
    const currentIndex = getCurrentVideoIndex();
    if (currentIndex > 0) {
      const prevVideo = allVideos[currentIndex - 1];
      changeVideo(prevVideo, false);
    }
  };

  const navigateToNext = () => {
    const allVideos = getAllVideos();
    const currentIndex = getCurrentVideoIndex();
    if (currentIndex < allVideos.length - 1) {
      const nextVideo = allVideos[currentIndex + 1];
      const isCompleted = progressData?.completedVideoIds?.includes(nextVideo.id);
      const isNextVideo = progressData?.nextVideo?.id === nextVideo.id;
      const isLocked = !isCompleted && !isNextVideo;
      if (!isLocked) {
        changeVideo(nextVideo, false);
      }
    }
  };

  const markAsComplete = async (videoId) => {
    try {
      setMarkingComplete(true);

      await api.post("/progress/complete", { videoId });

      setJustCompleted(true);
      showToast("Video marked as complete", "success");

      const updated = await api.get(`/progress/${subjectId}`);
      setProgressData(updated.data);

      setTimeout(() => setJustCompleted(false), 300);
    } catch {
      showToast("Failed to update progress", "error");
    } finally {
      setMarkingComplete(false);
    }
  };

  if (loading) {
    return <AppLayout title="Course"><div className="p-10 text-[#94a3b8]">Loading...</div></AppLayout>;
  }

  const isVideoCompleted =
    progressData?.completedVideoIds?.includes(activeVideo?.id);

  return (
    <AppLayout title={subject?.title || "Course"}>
      <div className="max-w-[1400px] mx-auto px-6">

        <div className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-[#e2e8f0] mb-2">
            {subject?.title}
          </h1>
          
          {progressData && (
            <div className="mb-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#94a3b8]">
                  {progressData.percentage}% Complete
                </span>
                <span className="text-sm text-[#94a3b8]">
                  {progressData.completedVideoIds?.length || 0} of {progressData.totalVideos || 0} lessons
                </span>
              </div>
              <div className="h-1 bg-[#1f2937] rounded-full overflow-hidden">
                <div
                  className="h-1 bg-blue-500 transition-all duration-300 ease-out"
                  style={{ width: `${progressData.percentage || 0}%` }}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <div className="w-full lg:w-[320px] bg-[#111827] border border-[#1f2937] rounded-xl p-8 h-fit lg:sticky lg:top-24">
            <h2 className="text-lg font-semibold mb-8 text-[#e2e8f0]">Course Content</h2>

            <div className="space-y-4">
              {sections.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-sm text-[#94a3b8]">No lessons available yet.</p>
                </div>
              ) : (
                sections.map((section, sectionIndex) => (
                <div key={section.id}>
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="w-full text-left text-sm font-semibold text-[#e2e8f0] hover:text-white transition-colors duration-200 ease-out flex items-center justify-between cursor-pointer"
                  >
                    <span>
                      <span className="text-xs text-blue-400 font-medium">
                        {sectionIndex + 1}.
                      </span>{" "}
                      {section.title}
                    </span>
                  </button>

                  {expandedSectionId === section.id &&
                    videos[section.id] && (
                      videos[section.id].length === 0 ? (
                        <div className="mt-3 ml-4 text-center py-4">
                          <p className="text-xs text-[#94a3b8]">No videos in this section.</p>
                        </div>
                      ) : (
                      <div className="mt-3 ml-4 space-y-1.5">
                        {videos[section.id].map((video, videoIndex) => {
                          const isActive = activeVideo?.id === video.id;
                          const isCompleted =
                            progressData?.completedVideoIds?.includes(video.id);
                          const isNextVideo = progressData?.nextVideo?.id === video.id;
                          const isLocked = !isCompleted && !isNextVideo;

                          return (
                            <button
                              key={video.id}
                              onClick={() => changeVideo(video, isLocked)}
                              disabled={isLocked}
                              className={`block w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 ease-out ${
                                isLocked
                                  ? "opacity-40 cursor-not-allowed"
                                  : isActive
                                  ? "bg-[#1e293b] text-white border-l-2 border-blue-500 cursor-pointer"
                                  : "text-[#94a3b8] hover:bg-[#1e293b] hover:text-white hover:translate-x-1 cursor-pointer"
                              }`}
                            >
                              <span className="text-xs text-blue-400 font-medium">
                                {sectionIndex + 1}.{videoIndex + 1}
                              </span>{" "}
                              {video.title}
                              {isCompleted && (
                                <span className="float-right text-blue-400 animate-[pop_0.2s_ease-out]">
                                  ✓
                                </span>
                              )}
                              {isLocked && (
                                <span className="float-right text-[#94a3b8]">
                                  🔒
                                </span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                      )
                  )}
                </div>
              ))
              )}
            </div>
          </div>

          {/* Main Video Panel */}
          <div className="flex-1" ref={videoRef}>
            {!activeVideo ? (
              <div className="bg-[#111827] border border-[#1f2937] rounded-xl p-20 text-center">
                <p className="text-[#94a3b8]">No lessons available yet.</p>
              </div>
            ) : (
              <div className={`bg-[#111827] border border-[#1f2937] rounded-xl p-10 shadow-[0_10px_30px_rgba(0,0,0,0.6)] transition-all duration-200 ease-out ${isVideoTransitioning ? 'opacity-50' : 'opacity-100'} ${justCompleted ? 'scale-[1.01]' : ''}`}>

                <div className="border-b border-[#1f2937] pb-6 mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-2xl font-semibold tracking-tight text-[#e2e8f0]">
                      {activeVideo.title}
                    </h3>
                    {isVideoCompleted && (
                      <span className="px-4 py-2 bg-[#1e293b] border border-[#3b82f6] rounded-lg text-xs font-medium text-[#3b82f6] animate-[pop_0.2s_ease-out]">
                        Completed
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-[#94a3b8]">
                    Lesson {getCurrentVideoIndex() + 1} of {getAllVideos().length}
                  </p>
                </div>

                {isVideoTransitioning ? (
                  <div className="aspect-video bg-[#1e293b] rounded-xl mb-8 animate-shimmer" />
                ) : (
                  <div className="aspect-video bg-black rounded-xl overflow-hidden mb-8 border border-[#0b1220]">
                    <div ref={videoContainerRef} className="w-full h-full" />
                  </div>
                )}

                {activeVideo.objectives && (
                  <div className="mb-6 border-l-2 border-blue-500 pl-4">
                    <h4 className="text-lg font-semibold text-blue-400 mb-3">
                      Learning Objectives
                    </h4>
                    <div className="text-sm text-[#cbd5e1] italic space-y-2">
                      {activeVideo.objectives.split('\n').map((obj, i) => (
                        obj.trim() && <p key={i}>• {obj.trim()}</p>
                      ))}
                    </div>
                  </div>
                )}

                {activeVideo.outcomes && (
                  <div className="mb-8 border-l-2 border-blue-500 pl-4">
                    <h4 className="text-lg font-semibold text-blue-400 mb-3">
                      Outcomes
                    </h4>
                    <div className="text-sm text-[#cbd5e1] italic space-y-2">
                      {activeVideo.outcomes.split('\n').map((outcome, i) => (
                        outcome.trim() && <p key={i}>• {outcome.trim()}</p>
                      ))}
                    </div>
                  </div>
                )}

                {!isVideoCompleted ? (
                  <button
                    onClick={() => markAsComplete(activeVideo.id)}
                    disabled={markingComplete}
                    className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {markingComplete ? "Saving..." : "Mark as Complete"}
                  </button>
                ) : (
                  <div className="flex items-center gap-4">
                    <button
                      onClick={navigateToPrevious}
                      disabled={getCurrentVideoIndex() === 0}
                      className="bg-[#1e293b] hover:bg-[#334155] text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Back
                    </button>
                    <button
                      onClick={navigateToNext}
                      disabled={getCurrentVideoIndex() === getAllVideos().length - 1}
                      className="bg-[#3b82f6] hover:bg-[#2563eb] text-white px-8 py-3 rounded-lg font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                      Next
                    </button>
                  </div>
                )}

              </div>
            )}
          </div>

        </div>
      </div>
    </AppLayout>
  );
}

export default CourseDetails;