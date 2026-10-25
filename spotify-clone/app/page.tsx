"use client";

import React, { useState, useRef, useEffect } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Search, 
  Library, 
  Plus, 
  Shuffle,
  Repeat,
  Heart,
  Share2,
  Tv,
  ChevronDown,
  Crown,
  Home
} from "lucide-react";

interface Track {
  id: number;
  title: string;
  artist: string;
  album: string;
  duration: string;
  audioUrl: string;
  cover: string;
}

const TRACKS: Track[] = [
  { id: 1, title: "Badtameez Dil", artist: "Pritam", album: "Yeh Jawaani Hai Deewani", duration: "4:30", audioUrl: "/songs/1.mp3", cover: "https://img.youtube.com/vi/II2EO3Nw4m0/hqdefault.jpg" },
  { id: 2, title: "Blinding Lights", artist: "The Weeknd", album: "After Hours", duration: "5:00", audioUrl: "/songs/5.mp3", cover: "https://img.youtube.com/vi/4NRXx6U8ABQ/hqdefault.jpg" },
  { id: 3, title: "Chunnari Chunnari", artist: "Anu Malik", album: "Biwi No. 1", duration: "3:19", audioUrl: "/songs/2.mp3", cover: "https://img.youtube.com/vi/g6cO4tpM_1U/hqdefault.jpg" },
  { id: 4, title: "Heeriye", artist: "Jasleen Royal & Arijit Singh", album: "Heeriye", duration: "3:28", audioUrl: "/songs/3.mp3", cover: "https://img.youtube.com/vi/RLzC55ai0eo/hqdefault.jpg" },
  { id: 5, title: "Jhoome Jo Pathaan", artist: "Vishal-Shekhar", album: "Pathaan", duration: "4:22", audioUrl: "/songs/5.mp3", cover: "https://img.youtube.com/vi/vqu4z34wENw/hqdefault.jpg" },
  { id: 6, title: "Pehli Baar Mile Hain", artist: "S. P. Balasubrahmanyam", album: "Saajan", duration: "6:20", audioUrl: "/songs/6.mp3", cover: "https://img.youtube.com/vi/WPCfg5pksVY/hqdefault.jpg" },
  { id: 7, title: "Shape of You", artist: "Ed Sheeran", album: "Divide", duration: "4:23", audioUrl: "/songs/7.mp3", cover: "https://img.youtube.com/vi/JGwWNGJdvx8/hqdefault.jpg" },
  { id: 8, title: "Sunflower", artist: "Post Malone", album: "Spider-Man: Into the Spider-Verse", duration: "2:41", audioUrl: "/songs/8.mp3", cover: "https://img.youtube.com/vi/ApXoWvfEYVU/hqdefault.jpg" },
  { id: 9, title: "Tum Hi Aana (Happy Version)", artist: "Jubin Nautiyal", album: "Marjaavaan", duration: "4:27", audioUrl: "/songs/9.mp3", cover: "https://img.youtube.com/vi/LmrPJSupjgY/hqdefault.jpg" },
  { id: 10, title: "Coca Cola", artist: "Tony Kakkar", album: "Luka Chuppi", duration: "3:23", audioUrl: "/songs/10.mp3", cover: "https://img.youtube.com/vi/Y8GQoKy3tRI/hqdefault.jpg" }
];

// Helper to convert "4:13" into total seconds (253)
const parseDurationToSeconds = (durationStr: string) => {
  const parts = durationStr.split(":");
  if (parts.length === 2) {
    return parseInt(parts[0]) * 60 + parseInt(parts[1]);
  }
  return 200;
};

export default function AudionixApp() {
  const [tracks] = useState<Track[]>(TRACKS);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  
  const [activeTab, setActiveTab] = useState("home");
  const [isMaximized, setIsMaximized] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const currentTrack = tracks[currentTrackIndex];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.play().catch((err) => {
        console.error("Audio playback failed:", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const togglePlay = (index?: number) => {
    if (index !== undefined && index !== currentTrackIndex) {
      setCurrentTrackIndex(index);
      setCurrentTime(0);
      setDuration(0);
      setIsPlaying(true);
      return;
    }
    setIsPlaying((prev) => !prev);
  };

  const handleNext = () => {
    setCurrentTime(0);
    setDuration(0);
    setCurrentTrackIndex((prev) => (prev + 1) % tracks.length);
    setIsPlaying(true);
  };

  const handlePrev = () => {
    setCurrentTime(0);
    setDuration(0);
    setCurrentTrackIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setIsPlaying(true);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return null;
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const totalDuration = duration && !isNaN(duration) ? duration : parseDurationToSeconds(currentTrack.duration);

  return (
    <div className="flex flex-col h-screen w-screen bg-[#050508] text-zinc-100 font-sans select-none overflow-hidden relative">
      
      {/* BACKGROUND GLOW BLOBS */}
      <div className="absolute top-[-10%] left-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-fuchsia-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* HTML5 Audio Element */}
      <audio
        ref={audioRef}
        src={currentTrack.audioUrl}
        onTimeUpdate={() => audioRef.current && setCurrentTime(audioRef.current.currentTime)}
        onLoadedMetadata={() => audioRef.current && setDuration(audioRef.current.duration)}
        onEnded={handleNext}
        onError={(e) => console.error("HTML5 Audio Error Loading File:", e)}
      />

      {/* ================= MAIN CONTENT VIEW ================= */}
      <main className="flex-1 overflow-y-auto pb-36 px-4 pt-4 z-10 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        
        {/* Top Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center font-bold text-sm text-white shadow-lg shadow-violet-600/30">
              D
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">Audionix</span>
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-medium transition">All</button>
            <button className="px-3 py-1 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-xs font-medium transition">Music</button>
          </div>
        </div>

        {activeTab === "home" && (
          <div>
            <h2 className="text-xl font-bold mb-3 tracking-tight text-white">Jump into a session</h2>
            
            {/* Quick Pick Cards */}
            <div className="grid grid-cols-1 gap-2 mb-6">
              {tracks.slice(0, 3).map((track, idx) => (
                <div 
                  key={track.id}
                  onClick={() => togglePlay(idx)}
                  className="flex items-center bg-white/5 hover:bg-white/10 backdrop-blur-md rounded-xl overflow-hidden cursor-pointer transition border border-white/10 pointer-events-auto"
                >
                  <img src={track.cover} className="w-12 h-12 object-cover pointer-events-none" />
                  <span className="px-3 text-sm font-semibold truncate flex-1 text-white">{track.title}</span>
                </div>
              ))}
            </div>

            <h3 className="text-lg font-bold mb-3 text-white">Your Playlist ({tracks.length} Songs)</h3>
            <div className="flex flex-col gap-2">
              {tracks.map((track, idx) => (
                <div 
                  key={track.id}
                  onClick={() => togglePlay(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl hover:bg-white/5 border border-transparent hover:border-white/5 transition cursor-pointer pointer-events-auto ${currentTrackIndex === idx ? "bg-white/10 border-violet-500/50" : ""}`}
                >
                  <div className="flex items-center gap-3 overflow-hidden pointer-events-none">
                    <img src={track.cover} className="w-10 h-10 rounded-lg object-cover shrink-0 shadow" />
                    <div className="overflow-hidden">
                      <p className={`text-sm font-semibold truncate ${currentTrackIndex === idx ? "text-violet-400" : "text-white"}`}>{track.title}</p>
                      <p className="text-xs text-zinc-400 truncate">{track.artist}</p>
                    </div>
                  </div>
                  <span className="text-xs text-zinc-400 shrink-0 font-mono">{track.duration}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "search" && (
          <div className="pt-2">
            <h2 className="text-2xl font-bold mb-4 text-white">Search</h2>
            <div className="relative">
              <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-zinc-400" />
              <input 
                type="text" 
                placeholder="What do you want to listen to?" 
                className="w-full bg-white/5 backdrop-blur-md border border-white/10 text-white placeholder-zinc-400 rounded-xl pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-violet-500 pointer-events-auto"
              />
            </div>
          </div>
        )}

        {activeTab === "library" && (
          <div className="pt-2">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-white">Your Library</h2>
              <Plus className="w-6 h-6 cursor-pointer text-zinc-300 hover:text-white" />
            </div>
            <div className="flex flex-col gap-3">
              <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10">
                <p className="font-bold text-sm text-white">Favorite Songs</p>
                <p className="text-xs text-zinc-400 mt-1">{tracks.length} songs • Playlist</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === "premium" && (
          <div className="pt-4 text-center pb-10">
            <Crown className="w-12 h-12 text-violet-400 mx-auto mb-2" />
            <h2 className="text-2xl font-bold mb-2 text-white">Upgrade to Audionix Pro</h2>
            <p className="text-xs text-zinc-400 mb-6">Ad-free streaming, highest fidelity sound, and offline mode.</p>
            <button className="bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-white font-bold py-3 px-8 rounded-full text-sm shadow-lg shadow-violet-600/30 pointer-events-auto">Get Started</button>
          </div>
        )}

        {activeTab === "create" && (
          <div className="pt-4 flex flex-col gap-4">
            <h2 className="text-xl font-bold text-white">Create</h2>
            <div className="p-4 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl flex items-center gap-4 cursor-pointer hover:bg-white/10 transition pointer-events-auto">
              <div className="w-10 h-10 rounded-full bg-violet-600/30 flex items-center justify-center text-violet-400"><Plus className="w-5 h-5" /></div>
              <div>
                <p className="font-bold text-sm text-white">New Playlist</p>
                <p className="text-xs text-zinc-400">Build a custom collection</p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ================= MINIMIZED PLAYER BAR ================= */}
      <div 
        onClick={() => setIsMaximized(true)}
        className="fixed bottom-20 left-3 right-3 backdrop-blur-2xl bg-zinc-900/80 border border-white/20 rounded-2xl p-2.5 flex items-center justify-between cursor-pointer shadow-2xl z-50 pointer-events-auto"
      >
        <div className="flex items-center gap-3 overflow-hidden flex-1 pointer-events-none">
          <img src={currentTrack.cover} className="w-11 h-11 rounded-xl object-cover shadow-lg shrink-0" />
          <div className="overflow-hidden">
            <p className="text-xs font-semibold text-white truncate">{currentTrack.title}</p>
            <p className="text-[11px] text-zinc-400 truncate">{currentTrack.artist}</p>
          </div>
        </div>

        <div className="flex items-center gap-4 pr-2" onClick={(e) => e.stopPropagation()}>
          <div title="Connect to device">
            <Tv className="w-5 h-5 text-zinc-300 hover:text-white transition cursor-pointer" />
          </div>
          <button 
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              togglePlay();
            }}
            className="w-9 h-9 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center text-white shadow-lg shadow-violet-600/40 cursor-pointer pointer-events-auto hover:scale-105 transition"
          >
            {isPlaying ? <Pause className="w-4 h-4 fill-white" /> : <Play className="w-4 h-4 fill-white ml-0.5" />}
          </button>
        </div>
      </div>

      {/* ================= FULL SCREEN MAXIMIZED PLAYER ================= */}
      {isMaximized && (
        <div className="fixed inset-0 bg-gradient-to-b from-[#1a102f] via-[#0b0b14] to-[#050508] z-50 flex flex-col justify-between p-6 animate-in fade-in duration-200 pointer-events-auto">
          
          {/* Top Bar */}
          <div className="flex items-center justify-between">
            <ChevronDown className="w-6 h-6 cursor-pointer text-zinc-300 hover:text-white" onClick={() => setIsMaximized(false)} />
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-wider text-violet-400 font-semibold">PLAYING FROM PLAYLIST</p>
              <p className="text-xs font-bold text-white">Audionix Mix</p>
            </div>
            <Share2 className="w-5 h-5 text-zinc-300 cursor-pointer hover:text-white" />
          </div>

          {/* Album Artwork */}
          <div className="my-auto flex flex-col items-center">
            <div className="w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden shadow-2xl border border-white/10 mb-8">
              <img src={currentTrack.cover} className="w-full h-full object-cover" />
            </div>

            <div className="w-full flex items-center justify-between px-2">
              <div className="overflow-hidden">
                <h2 className="text-xl font-bold truncate text-white">{currentTrack.title}</h2>
                <p className="text-sm text-zinc-400 truncate mt-0.5">{currentTrack.artist}</p>
              </div>
              <Heart 
                className={`w-6 h-6 cursor-pointer transition ${isLiked ? "text-violet-500 fill-violet-500" : "text-zinc-400 hover:text-white"}`} 
                onClick={() => setIsLiked(!isLiked)} 
              />
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full flex flex-col gap-1 mb-4">
            <input
              type="range"
              min="0"
              max={totalDuration}
              value={currentTime}
              onChange={(e) => {
                const time = parseFloat(e.target.value);
                setCurrentTime(time);
                if (audioRef.current) {
                  audioRef.current.currentTime = time;
                }
              }}
              className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-violet-500 pointer-events-auto"
            />
            <div className="flex justify-between text-[11px] text-zinc-400 font-mono">
              <span>{formatTime(currentTime) || "0:00"}</span>
              <span>{formatTime(duration) || currentTrack.duration}</span>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex items-center justify-between px-4 mb-6">
            <Shuffle className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer" />
            <SkipBack className="w-7 h-7 text-white cursor-pointer hover:text-violet-400 transition" onClick={handlePrev} />
            <button 
              type="button"
              onClick={() => togglePlay()}
              className="w-16 h-16 rounded-full bg-gradient-to-tr from-violet-600 to-fuchsia-500 flex items-center justify-center text-white hover:scale-105 transition shadow-lg shadow-violet-600/40 cursor-pointer pointer-events-auto"
            >
              {isPlaying ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
            </button>
            <SkipForward className="w-7 h-7 text-white cursor-pointer hover:text-violet-400 transition" onClick={handleNext} />
            <Repeat className="w-5 h-5 text-zinc-400 hover:text-white cursor-pointer" />
          </div>

          {/* Bottom Device & Lyrics preview bar */}
          <div className="flex items-center justify-between text-zinc-400 pt-2 border-t border-white/10">
            <div className="flex items-center gap-2 cursor-pointer hover:text-white">
              <Tv className="w-4 h-4 text-violet-400" />
              <span className="text-xs text-violet-400 font-medium">Connected Speaker</span>
            </div>
            <span className="text-xs font-semibold bg-white/10 px-3 py-1 rounded-full text-white">Lyrics preview</span>
          </div>

        </div>
      )}

      {/* ================= BOTTOM NAVIGATION BAR ================= */}
      <nav className="fixed bottom-0 left-0 right-0 h-16 backdrop-blur-2xl bg-zinc-900/40 border-t border-white/10 flex items-center justify-around px-2 z-30 text-[10px] pointer-events-auto">
        <button 
          onClick={() => setActiveTab("home")} 
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeTab === "home" ? "text-violet-400 font-bold" : "text-zinc-400 hover:text-white"}`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </button>

        <button 
          onClick={() => setActiveTab("search")} 
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeTab === "search" ? "text-violet-400 font-bold" : "text-zinc-400 hover:text-white"}`}
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </button>

        <button 
          onClick={() => setActiveTab("library")} 
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeTab === "library" ? "text-violet-400 font-bold" : "text-zinc-400 hover:text-white"}`}
        >
          <Library className="w-5 h-5" />
          <span>Your Library</span>
        </button>

        <button 
          onClick={() => setActiveTab("premium")} 
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeTab === "premium" ? "text-violet-400 font-bold" : "text-zinc-400 hover:text-white"}`}
        >
          <Crown className="w-5 h-5" />
          <span>Premium</span>
        </button>

        <button 
          onClick={() => setActiveTab("create")} 
          className={`flex flex-col items-center gap-1 transition cursor-pointer ${activeTab === "create" ? "text-violet-400 font-bold" : "text-zinc-400 hover:text-white"}`}
        >
          <Plus className="w-5 h-5" />
          <span>Create</span>
        </button>
      </nav>

    </div>
  );
}