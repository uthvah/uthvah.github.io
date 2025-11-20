import React, { useState, useRef, useEffect } from 'react';
import { MUSIC_TRACKS } from '../constants';
import { Play, Pause, SkipForward, SkipBack, Volume2 } from 'lucide-react';

type PlaybackState = 'STOPPED' | 'CUEING' | 'PLAYING' | 'RETURNING';

const Phonograph: React.FC = () => {
  const [playbackState, setPlaybackState] = useState<PlaybackState>('STOPPED');
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  // Vinyl Physics
  const discRef = useRef<HTMLDivElement>(null);
  const [discStyle, setDiscStyle] = useState<React.CSSProperties>({});
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const timerRef = useRef<number | null>(null);

  const currentTrack = MUSIC_TRACKS[currentTrackIndex];

  // Mechanical Constants
  // Angles calibrated for top-right pivot: 
  // 0 is vertical (down), + is clockwise (left/inwards), - is counter-clockwise (right/outwards).
  const ARM_REST_ANGLE = -25; 
  const ARM_START_ANGLE = -3;  // Adjusted outwards to hit the very edge/lead-in
  const ARM_END_ANGLE = 22;   // End at the run-out groove (center)
  
  const CUE_DURATION = 1000;  // Time to move arm to record
  const RETURN_DURATION = 1500; // Time to return arm to rest

  const clearMechanics = () => {
    if (timerRef.current) {
      window.clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  // --- Mechanical Operations ---

  const stopSpinning = (): number => {
    if (!discRef.current) return 0;
    
    // 1. Capture current rotation from the computed style
    const computedStyle = window.getComputedStyle(discRef.current);
    const matrix = new DOMMatrix(computedStyle.transform);
    
    // Calculate angle in degrees (0-360)
    let currentAngle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
    if (currentAngle < 0) currentAngle += 360;
    
    // 2. Freeze the vinyl momentarily at current angle
    setDiscStyle({
        transform: `rotate(${currentAngle}deg)`,
        transition: 'none'
    });

    // 3. Calculate natural physics-based spin down
    // Current Play Speed: 1 rotation per 3 seconds = 360deg / 3000ms = 0.12 deg/ms
    const v0 = 360 / 3000; 

    // Determine target angle (must stop upright, i.e., multiple of 360)
    // Ensure minimal travel distance for natural look (at least 120 degrees)
    let targetAngle = Math.ceil(currentAngle / 360) * 360;
    if (targetAngle - currentAngle < 120) {
        targetAngle += 360;
    }
    const distance = targetAngle - currentAngle;

    // Calculate Duration based on constant deceleration
    // t = 2 * d / v0. This ensures the initial velocity of the ease-out matches the play speed.
    const duration = (2 * distance) / v0;

    // 4. Animate to halt
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            setDiscStyle({
                transform: `rotate(${targetAngle}deg)`, 
                transition: `transform ${duration}ms cubic-bezier(0.33, 1, 0.68, 1)` // Custom ease-out to match physics
            });
        });
    });

    return duration;
  };

  const handlePlay = () => {
    clearMechanics();
    
    // 1. Calculate offset to ensure seamless spin start (no snapping)
    let startOffset = 0;
    if (discRef.current) {
         const computedStyle = window.getComputedStyle(discRef.current);
         const matrix = new DOMMatrix(computedStyle.transform);
         let currentAngle = Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
         if (currentAngle < 0) currentAngle += 360;
         
         // Cycle duration is 3000ms.
         // We set negative delay to start animation at the correct frame.
         startOffset = -1 * ((currentAngle % 360) / 360) * 3000;
    }

    // 2. Vinyl begins spinning
    setDiscStyle({
        animationDelay: `${startOffset}ms`
        // 'transform' is deliberately omitted/removed here so CSS animation takes over
    });

    // 3. Arm begins moving to start position
    setPlaybackState('CUEING');
    
    // 4. Wait for arm to reach the record before playing audio
    timerRef.current = window.setTimeout(() => {
      if (audioRef.current) {
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(console.error);
        }
        setPlaybackState('PLAYING');
      }
    }, CUE_DURATION);
  };

  const handleStop = (resetTrack = false) => {
    clearMechanics();
    
    // 1. Stop audio immediately
    if (audioRef.current) {
      audioRef.current.pause();
      if (resetTrack) audioRef.current.currentTime = 0;
    }

    // 2. Vinyl begins inertia spin-down (calculates its own duration)
    const spinDownDuration = stopSpinning();

    // 3. Arm begins returning to rest
    setPlaybackState('RETURNING');

    // 4. Wait for mechanics (both arm return and spin down) to finish
    const mechDuration = Math.max(RETURN_DURATION, spinDownDuration);
    
    timerRef.current = window.setTimeout(() => {
      setPlaybackState('STOPPED');
      if (resetTrack) setProgress(0);
    }, mechDuration);
  };

  const togglePlayback = () => {
    if (playbackState === 'STOPPED' || playbackState === 'RETURNING') {
      handlePlay();
    } else {
      handleStop();
    }
  };

  const changeTrack = (newIndex: number) => {
    const wasPlaying = playbackState === 'PLAYING' || playbackState === 'CUEING';
    
    if (audioRef.current) audioRef.current.pause();
    clearMechanics();

    setCurrentTrackIndex(newIndex);
    setProgress(0);
    if (audioRef.current) audioRef.current.currentTime = 0;

    if (wasPlaying) {
        // Re-trigger cueing sequence for new track
        handlePlay();
    } else {
        setPlaybackState('STOPPED');
        // Ensure vinyl is upright if we skip while stopped
        setDiscStyle({ transform: 'rotate(0deg)' });
    }
  };

  const handleNext = () => {
    const newIndex = (currentTrackIndex + 1) % MUSIC_TRACKS.length;
    changeTrack(newIndex);
  };

  const handlePrev = () => {
    const newIndex = (currentTrackIndex - 1 + MUSIC_TRACKS.length) % MUSIC_TRACKS.length;
    changeTrack(newIndex);
  };

  const onTrackEnded = () => {
    handleStop(true);
  };

  // Update Progress Bar
  useEffect(() => {
    const audio = audioRef.current;
    const updateProgress = () => {
      if (audio && playbackState === 'PLAYING') {
        const val = (audio.currentTime / audio.duration) * 100;
        setProgress(isNaN(val) ? 0 : val);
      }
    };
    audio?.addEventListener('timeupdate', updateProgress);
    return () => audio?.removeEventListener('timeupdate', updateProgress);
  }, [playbackState]);

  // --- Animation Calculations ---

  let armRotation = ARM_REST_ANGLE;
  let armTransitionClass = 'duration-[1500ms] ease-in-out';

  switch (playbackState) {
    case 'STOPPED':
        armRotation = ARM_REST_ANGLE;
        break;
    case 'CUEING':
        armRotation = ARM_START_ANGLE;
        armTransitionClass = `duration-[${CUE_DURATION}ms] ease-out`;
        break;
    case 'PLAYING':
        // Interpolate across the record surface
        armRotation = ARM_START_ANGLE + (progress / 100) * (ARM_END_ANGLE - ARM_START_ANGLE);
        armTransitionClass = 'duration-100 linear'; // Tracking movement
        break;
    case 'RETURNING':
        armRotation = ARM_REST_ANGLE;
        armTransitionClass = `duration-[${RETURN_DURATION}ms] ease-in-out`;
        break;
  }

  // Apply spinning animation class only if we are playing/cueing AND not manually overriding transform (spin down)
  const isMechanicallySpinning = (playbackState === 'CUEING' || playbackState === 'PLAYING') && !discStyle.transform;

  return (
    <section id="phonograph" className="py-32 px-4 md:px-20 bg-stone-950 border-t border-stone-900 relative overflow-hidden">
       {/* Background Ambience */}
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-stone-900 via-stone-950 to-black opacity-50" />

      {/* Header */}
      <div className="relative z-10 text-center mb-16 md:mb-24">
        <span className="font-mono text-academy-gold text-xs tracking-[0.4em] block mb-6">THE LISTENING ROOM</span>
        <h2 className="font-display text-4xl md:text-7xl text-academy-paper opacity-90">Original Works</h2>
      </div>

      <div className="max-w-6xl mx-auto relative z-10 flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
        
        {/* The Player (Visual) */}
        <div className="relative w-full max-w-[500px] aspect-square bg-[#1c1917] rounded-lg p-4 md:p-8 shadow-2xl border border-stone-800 group">
            {/* Wood texture overlay */}
            <div className="absolute inset-0 bg-[#2a2522] opacity-20 mix-blend-overlay pointer-events-none rounded-lg" />
            
            {/* Platter */}
            <div className="relative w-full h-full rounded-full bg-[#111] border-4 md:border-8 border-[#222] shadow-inner flex items-center justify-center overflow-hidden">
                {/* Rotating Vinyl */}
                <div 
                     ref={discRef}
                     className={`w-[92%] md:w-[96%] h-[92%] md:h-[96%] rounded-full bg-stone-950 relative shadow-2xl flex items-center justify-center 
                     ${isMechanicallySpinning ? 'animate-spin-slow' : ''}
                     `}
                     style={{ 
                        animationDuration: '3s',
                        ...discStyle 
                     }}
                >
                    {/* Grooves */}
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="absolute rounded-full border border-stone-800/30" 
                             style={{ inset: `${(i + 1) * 7}%` }} 
                        />
                    ))}

                    {/* Reflection */}
                    <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/5 via-transparent to-white/5 pointer-events-none opacity-50" />
                    
                    {/* Label */}
                    <div className="w-[35%] h-[35%] rounded-full bg-academy-accent flex items-center justify-center border-4 border-stone-900/80 z-10 relative overflow-hidden shadow-md">
                        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent pointer-events-none" />
                        <div className={`text-center transition-opacity duration-500 ${playbackState === 'CUEING' ? 'opacity-80' : 'opacity-90'}`}>
                             <span className="font-display text-academy-paper text-[8px] md:text-[10px] tracking-widest leading-tight block">
                                UTHVAH
                            </span>
                            <div className="w-6 md:w-8 h-px bg-academy-paper/50 mx-auto my-1"></div>
                            <span className="font-mono text-academy-gold text-[6px] md:text-[8px] tracking-wider block">
                                45 RPM
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tone Arm Assembly - Minimalist & Hidden on Mobile */}
            <div className="hidden md:block absolute top-[8%] right-[8%] w-[12%] h-[12%] z-20 pointer-events-none">
                 {/* Pivot Base - Minimal Circle */}
                <div className="absolute inset-0 rounded-full bg-[#1a1a1a] border border-stone-800 z-10 flex items-center justify-center shadow-lg">
                     <div className="w-2 h-2 rounded-full bg-stone-600" />
                </div>

                {/* The Arm - Thin Line */}
                <div 
                    className={`absolute top-1/2 left-1/2 w-[2px] h-[380%] z-0 origin-top transition-transform ${armTransitionClass}`}
                    style={{ transform: `rotate(${armRotation}deg)` }}
                >
                    {/* Main rod */}
                    <div className="w-full h-full bg-stone-500 relative opacity-90">
                        {/* Head shell - sleek rectangle */}
                        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-5 bg-[#1a1a1a] border border-stone-800 rounded-[1px] shadow-sm" />
                        
                        {/* Counterweight - simple block */}
                        <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-3 h-4 bg-stone-700 rounded-[1px]"></div>
                    </div>
                </div>
            </div>
        </div>

        {/* Controls & Tracklist */}
        <div className="flex-1 w-full max-w-md">
            {/* Status Indicator */}
            <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
                 <div className={`w-2 h-2 rounded-full transition-colors duration-500 ${playbackState === 'PLAYING' ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : playbackState === 'CUEING' || playbackState === 'RETURNING' ? 'bg-yellow-600 animate-pulse' : 'bg-red-900'}`}></div>
                 <div className="text-academy-gold font-mono text-xs tracking-[0.4em]">
                    {playbackState === 'STOPPED' ? 'STOPPED' : playbackState === 'PLAYING' ? 'PLAYING' : 'MECHANISM ACTIVE'}
                 </div>
            </div>
            
            {/* Track Info */}
            <div className="h-20 flex flex-col items-center lg:items-start justify-center mb-6 transition-all duration-500 text-center lg:text-left">
                <h2 className={`text-3xl md:text-5xl font-display text-academy-paper mb-2 transition-all duration-500`}>
                    {currentTrack.title}
                </h2>
                <p className={`text-stone-500 font-serif italic transition-all duration-500 delay-100`}>
                    Vol. 1 • {currentTrack.duration}
                </p>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-1 bg-stone-800 mb-12 relative overflow-hidden rounded-full group cursor-pointer">
                <div 
                    className="h-full bg-academy-gold transition-all duration-200 ease-linear relative"
                    style={{ width: `${progress}%` }}
                >
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-academy-paper rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
            </div>

            {/* Tactile Controls - Centered on Mobile */}
            <div className="flex items-center justify-center lg:justify-start gap-8 mb-12">
                <button onClick={handlePrev} className="group p-4 rounded-full border border-stone-800 hover:border-academy-gold hover:bg-stone-900 transition-all">
                    <SkipBack className="w-6 h-6 text-stone-500 group-hover:text-academy-gold transition-colors" />
                </button>
                
                <button 
                    onClick={togglePlayback}
                    className="relative p-6 rounded-full bg-academy-gold text-academy-ink hover:bg-white hover:scale-105 transition-all shadow-[0_0_30px_rgba(157,140,112,0.2)] group overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/40 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
                    {playbackState === 'PLAYING' || playbackState === 'CUEING' ? <Pause className="w-8 h-8 fill-current relative z-10" /> : <Play className="w-8 h-8 fill-current ml-1 relative z-10" />}
                </button>

                <button onClick={handleNext} className="group p-4 rounded-full border border-stone-800 hover:border-academy-gold hover:bg-stone-900 transition-all">
                    <SkipForward className="w-6 h-6 text-stone-500 group-hover:text-academy-gold transition-colors" />
                </button>
            </div>

            {/* Playlist */}
            <div className="border-t border-stone-800 pt-8">
                <div className="flex justify-between items-end mb-6 px-2">
                    <h3 className="text-xs font-bold text-stone-600 tracking-widest">TRACK LIST</h3>
                    <span className="text-[10px] font-mono text-stone-700">SIDE A</span>
                </div>
                <ul className="space-y-2">
                    {MUSIC_TRACKS.map((track, idx) => (
                        <li 
                            key={track.id} 
                            onClick={() => changeTrack(idx)}
                            className={`
                                relative flex justify-between items-center cursor-pointer p-3 rounded-md transition-all duration-300
                                ${currentTrackIndex === idx ? 'bg-stone-900 border border-stone-800' : 'hover:bg-stone-900/50 border border-transparent'}
                            `}
                        >
                            <div className="flex items-center gap-4">
                                <span className={`font-mono text-xs w-4 ${currentTrackIndex === idx ? 'text-academy-gold' : 'text-stone-600'}`}>
                                    0{idx + 1}
                                </span>
                                <span className={`font-serif text-lg ${currentTrackIndex === idx ? 'text-academy-paper' : 'text-stone-400'}`}>
                                    {track.title}
                                </span>
                            </div>
                            {currentTrackIndex === idx && playbackState === 'PLAYING' && (
                                <Volume2 className="w-4 h-4 text-academy-gold animate-pulse" />
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={currentTrack.src} 
        onEnded={onTrackEnded} 
        loop={false}
      />
    </section>
  );
};

export default Phonograph;