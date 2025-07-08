import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Volume2, VolumeX, Maximize, RotateCcw } from 'lucide-react';

const VideoPage = () => {
  const navigate = useNavigate();
  const [isPlaying, setIsPlaying] = React.useState(false);
  const [isMuted, setIsMuted] = React.useState(false);
  const [showControls, setShowControls] = React.useState(true);
  const videoRef = React.useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleMuteToggle = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (document.fullscreenElement) {
        document.exitFullscreen();
      } else {
        videoRef.current.requestFullscreen();
      }
    }
  };

  const handleRestart = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleVideoClick = () => {
    setShowControls(!showControls);
  };

  const handleVideoEnded = () => {
    setIsPlaying(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#009DDB] to-[#33B9E6] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Schwinsight
            </button>
            <h1 className="text-2xl font-bold text-gray-800">
              Schwinsight Demo Video
            </h1>
            <div className="w-20"></div> {/* Spacer for centering */}
          </div>
        </div>

        {/* Video Player */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="relative group">
            <video
              ref={videoRef}
              className="w-full h-auto max-h-[70vh] object-contain bg-black"
              onClick={handleVideoClick}
              onEnded={handleVideoEnded}
              onPlay={() => setIsPlaying(true)}
              onPause={() => setIsPlaying(false)}
            >
              <source src="/video-demo/schwinsight-demo.mov" type="video/quicktime" />
              <source src="/video-demo/schwinsight-demo.mov" type="video/mp4" />
              Your browser does not support the video tag.
            </video>

            {/* Video Controls Overlay */}
            {showControls && (
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300">
                <div className="flex items-center justify-center gap-4">
                  <button
                    onClick={handlePlayPause}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    title={isPlaying ? 'Pause' : 'Play'}
                  >
                    {isPlaying ? (
                      <Pause className="h-6 w-6 text-white" />
                    ) : (
                      <Play className="h-6 w-6 text-white" />
                    )}
                  </button>

                  <button
                    onClick={handleRestart}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    title="Restart"
                  >
                    <RotateCcw className="h-6 w-6 text-white" />
                  </button>

                  <button
                    onClick={handleMuteToggle}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    title={isMuted ? 'Unmute' : 'Mute'}
                  >
                    {isMuted ? (
                      <VolumeX className="h-6 w-6 text-white" />
                    ) : (
                      <Volume2 className="h-6 w-6 text-white" />
                    )}
                  </button>

                  <button
                    onClick={handleFullscreen}
                    className="p-3 bg-white/20 hover:bg-white/30 rounded-full transition-colors"
                    title="Fullscreen"
                  >
                    <Maximize className="h-6 w-6 text-white" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Video Info */}
          <div className="p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">
              Schwinsight Platform Demo
            </h2>
            <p className="text-gray-600 mb-4">
              Watch a comprehensive demonstration of the Schwinsight platform, showcasing its powerful feedback analysis capabilities, intuitive interface, and advanced filtering features.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                Demo Video
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                Platform Overview
              </span>
              <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
                Feature Walkthrough
              </span>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">About This Demo</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">What You'll See</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Real-time feedback analysis</li>
                <li>• Advanced search and filtering</li>
                <li>• Sentiment analysis features</li>
                <li>• Export and reporting tools</li>
                <li>• User-friendly interface</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Platform Features</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Multi-source data integration</li>
                <li>• Intelligent content moderation</li>
                <li>• Comprehensive analytics</li>
                <li>• Customizable dashboards</li>
                <li>• Team collaboration tools</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPage; 