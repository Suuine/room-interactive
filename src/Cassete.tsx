import React, { Suspense, useEffect, useRef, useState, useCallback } from 'react';
import { Canvas, useThree, useFrame, type ThreeEvent } from '@react-three/fiber';
import { OrbitControls, useGLTF, Center, OrthographicCamera, Box } from '@react-three/drei';
import * as THREE from 'three';
// @ts-ignore: CSS import without type declarations
import './style/Cassete.css';

interface ModelProps {
  url: string;
  onClick?: () => void;
  position?: [number, number, number];
  isPlaying?: boolean;
}

function Model({ url, onClick, position = [0, 0, 0], isPlaying = false }: ModelProps) {
  const { scene, animations } = useGLTF(url);
  const mixerRef = useRef<THREE.AnimationMixer | null>(null);

  useEffect(() => {
    scene.traverse((obj) => {
      if ((obj as THREE.Mesh).isMesh) {
        obj.castShadow = true;
        obj.receiveShadow = true;
      }
    });
  }, [scene, url]);

  useEffect(() => {
    if (animations.length > 0) {
      mixerRef.current = new THREE.AnimationMixer(scene);
      if (isPlaying) {
        animations.forEach((clip) => {
          const action = mixerRef.current!.clipAction(clip);
          action.loop = THREE.LoopRepeat;
          action.play();
        });
      }
    }
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
    };
  }, [scene, animations, isPlaying]);

  useFrame((state, delta) => {
    mixerRef.current?.update(delta);
  });

  return (
    <primitive
      object={scene}
      position={position}
      onClick={(e: ThreeEvent<THREE.Mesh>) => {
        if (onClick) {
          e.stopPropagation();
          onClick();
        }
      }}
    />
  );
}

function AutoScaler({ children, modelKey, zoomFactor = 0.7 }: { children: React.ReactNode; modelKey: string; zoomFactor?: number }) {
  const groupRef = useRef<THREE.Group>(null);
  const camera = useThree((state) => state.camera as THREE.OrthographicCamera);

  useEffect(() => {
    if (groupRef.current && camera.isOrthographicCamera) {
      const box = new THREE.Box3().setFromObject(groupRef.current);
      const size = new THREE.Vector3();
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      camera.zoom = ((camera.top * 2) / maxDim) * zoomFactor;
      camera.updateProjectionMatrix();
    }
  }, [camera, modelKey, zoomFactor]);

  const angleInRadians = Math.PI * (-140 / 180);

  return (
    <group ref={groupRef} rotation-y={angleInRadians}>
      <Center>{children}</Center>
    </group>
  );
}

const SONG_FILES: Record<string, string> = {
  WashingMachine:   '/musics/Washing Machine Heart.mp3',
  RememberThem:     '/musics/Remember Them.mp3',
  PhainonSong:      '/musics/Flares of the Blazing Sun.mp3',
  CoolfortheSummer: '/musics/Cool For The Summer.mp3',
  BloodyMary:       '/musics/Bloody Mary.mp3',
  BlackSorrow:      '/musics/Black Sorrow.mp3',
};

function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export default function Cassete() {
  const [selectedSong, setSelectedSong] = useState<string | null>(null);
  const [shelfIndex, setShelfIndex] = useState<number>(0);
  const [lastActiveSong, setLastActiveSong] = useState<string>('Не обрано');
  const [modelState, setModelState] = useState<'closed' | 'opened' | 'playing'>('closed');
  const [playingSong, setPlayingSong] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const songsOrder = [
    'WashingMachine',
    'RememberThem',
    'PhainonSong',
    'CoolfortheSummer',
    'BloodyMary',
    'BlackSorrow',
  ];

  let currentCassetteUrl: string;
  if (modelState === 'playing') {
    currentCassetteUrl = '/models/casPlaing.glb';
  } else if (modelState === 'opened') {
    currentCassetteUrl = '/models/casOpened.glb';
  } else {
    currentCassetteUrl = '/models/casClosed.glb';
  }

  const currentShelfUrl = `/models/shelfState${shelfIndex}.glb`;

  const startAudio = useCallback((songKey: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    const src = SONG_FILES[songKey];
    if (!src) return;
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.loop = false;
    audio.addEventListener('timeupdate', () => setCurrentTime(audio.currentTime));
    audio.addEventListener('loadedmetadata', () => setDuration(audio.duration));
    audio.addEventListener('ended', () => setIsAudioPlaying(false));
    audio.play().catch(() => {});
    setIsAudioPlaying(true);
  }, []);

  const stopAudio = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    }
  }, []);

  const toggleAudio = useCallback(() => {
    if (!audioRef.current) return;
    if (isAudioPlaying) {
      audioRef.current.pause();
      setIsAudioPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setIsAudioPlaying(true);
    }
  }, [isAudioPlaying]);

  const handleSeek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
      setCurrentTime(val);
    }
  }, []);

  useEffect(() => {
    return () => {
      audioRef.current?.pause();
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeY = e.clientY - rect.top;
    const progress = 1 - relativeY / rect.height;
    if (progress >= 0 && progress <= 1) {
      const nextIndex = Math.min(6, Math.max(1, Math.ceil(progress * 6)));
      setShelfIndex(nextIndex);
      setLastActiveSong(songsOrder[nextIndex - 1]);
    }
  };

  const handleMouseLeave = () => setShelfIndex(0);

  const handleShelfClick = () => {
    if (shelfIndex >= 1 && shelfIndex <= 6) {
      setSelectedSong(songsOrder[shelfIndex - 1]);
    }
  };

  const toggleCassettePlayer = () => {
    if (modelState === 'closed') {
      setModelState('opened');
    } else if (modelState === 'opened') {
      const songToPlay = selectedSong || lastActiveSong;
      if (songToPlay && songToPlay !== 'Не обрано') {
        setModelState('playing');
        setPlayingSong(songToPlay);
        startAudio(songToPlay);
      }
    } else if (modelState === 'playing') {
      setModelState('opened');
      stopAudio();
    }
  };

  return (
    <div className="layout-container">
      <div className="viewer-section">
        <div className="song-status-badge">
          <span>Трек:</span>
          <strong>{playingSong || lastActiveSong}</strong>
        </div>

        <div
          className="shelf-mouse-trigger"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleShelfClick}
        />

        <Canvas>
          <OrthographicCamera makeDefault position={[0, 0, 100]} near={0.1} far={2000} />
          <ambientLight intensity={0.7} />
          <directionalLight position={[10, 10, 5]} intensity={1.5} />
          <directionalLight position={[-10, -10, -5]} intensity={0.4} />

          <Suspense fallback={<Box args={[1, 1, 1]}><meshStandardMaterial wireframe /></Box>}>
            <AutoScaler modelKey={`main-${modelState}-${shelfIndex}`} zoomFactor={1.5}>
              <group>
                <Model
                  url={currentCassetteUrl}
                  onClick={toggleCassettePlayer}
                  position={[4.5, -1, 0]}
                  isPlaying={modelState === 'playing'}
                />
              </group>
              <group>
                <Model url={currentShelfUrl} position={[-4.5, 0, 0]} />
              </group>
            </AutoScaler>
          </Suspense>

          <OrbitControls enableRotate={false} enableZoom={true} enablePan={false} />
        </Canvas>

        {modelState === 'playing' && playingSong && (
          <div className="player-bar">
            <div className="player-song-name">{playingSong}</div>
            <div className="player-controls">
              <button className="player-btn" onClick={toggleAudio}>
                {isAudioPlaying ? '⏸' : '▶'}
              </button>
              <span className="player-time">{formatTime(currentTime)}</span>
              <input
                className="player-seek"
                type="range"
                min={0}
                max={duration || 1}
                step={0.1}
                value={currentTime}
                onChange={handleSeek}
              />
              <span className="player-time">{formatTime(duration)}</span>
            </div>
          </div>
        )}
      </div>

      {selectedSong && (
        <div className="fullscreen-modal-overlay" onClick={() => setSelectedSong(null)}>
          <div className="modal-canvas-container" onClick={(e) => e.stopPropagation()}>
            <Canvas>
              <OrthographicCamera makeDefault position={[0, 0, 100]} near={0.1} far={2000} />
              <ambientLight intensity={0.8} />
              <directionalLight position={[15, 15, 10]} intensity={1.6} />
              <directionalLight position={[-15, -15, -10]} intensity={0.5} />
              <Suspense fallback={<Box args={[1, 1, 1]}><meshStandardMaterial wireframe /></Box>}>
                <AutoScaler modelKey={selectedSong} zoomFactor={0.85}>
                  <Model url={`/models/cassette${selectedSong}.glb`} />
                </AutoScaler>
              </Suspense>
              <OrbitControls enableRotate={true} enableZoom={true} enablePan={false} />
            </Canvas>
          </div>
          <div className="modal-hint">Плеєр: {selectedSong}. Клікніть збоку, щоб закрити</div>
        </div>
      )}
    </div>
  );
}