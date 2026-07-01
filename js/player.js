// 音乐播放器功能
document.addEventListener('DOMContentLoaded', function() {
  // 音乐列表 - 请替换为真实音乐文件路径
  const playlist = [
    {
      title: '示例歌曲',
      artist: '艺术家',
      url: '', // 替换为实际音乐文件路径，如 '/music/song.mp3'
      cover: '' // 替换为实际封面图片路径
    }
  ];

  let currentTrack = 0;
  let isPlaying = false;
  let audio = new Audio();
  let isControlsVisible = false;
  let isPlaylistVisible = false;

  // 获取DOM元素
  const playerIcon = document.querySelector('.player-icon');
  const playerControls = document.querySelector('.player-controls');
  const playPauseBtn = document.querySelector('.play-pause-btn');
  const prevBtn = document.querySelector('.prev-btn');
  const nextBtn = document.querySelector('.next-btn');
  const progressBar = document.querySelector('.progress-bar');
  const progressFill = document.querySelector('.progress-fill');
  const currentTimeEl = document.querySelector('.current-time');
  const totalTimeEl = document.querySelector('.total-time');
  const musicTitle = document.querySelector('.music-title');
  const musicArtist = document.querySelector('.music-artist');
  const musicCover = document.querySelector('.music-cover');
  const volumeSlider = document.querySelector('.volume-slider');
  const volumeFill = document.querySelector('.volume-fill');
  const volumeIcon = document.querySelector('.volume-icon');
  const playlistBtn = document.querySelector('.playlist-btn');
  const playlistMenu = document.querySelector('.playlist-menu');

  // 初始化播放器
  function initPlayer() {
    loadTrack(currentTrack);
    updatePlaylistUI();
  }

  // 加载歌曲
  function loadTrack(index) {
    if (index < 0 || index >= playlist.length) return;
    
    currentTrack = index;
    const track = playlist[currentTrack];
    
    audio.src = track.url;
    musicTitle.textContent = track.title;
    musicArtist.textContent = track.artist;
    
    // 处理封面图片
    if (track.cover) {
      musicCover.src = track.cover;
      musicCover.style.display = 'block';
    } else {
      musicCover.style.display = 'none';
    }
    
    // 重置进度条
    progressFill.style.width = '0%';
    currentTimeEl.textContent = '0:00';
    totalTimeEl.textContent = '0:00';
    
    // 更新播放列表高亮
    updatePlaylistUI();
  }

  // 播放/暂停
  function togglePlay() {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  }

  // 播放
  function play() {
    audio.play().catch(e => console.log('播放失败:', e));
    isPlaying = true;
    playerIcon.classList.add('playing');
    updatePlayPauseIcon();
  }

  // 暂停
  function pause() {
    audio.pause();
    isPlaying = false;
    playerIcon.classList.remove('playing');
    updatePlayPauseIcon();
  }

  // 更新播放/暂停图标
  function updatePlayPauseIcon() {
    const icon = playPauseBtn.querySelector('svg');
    if (isPlaying) {
      icon.innerHTML = '<path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>';
    } else {
      icon.innerHTML = '<path d="M8 5v14l11-7z"/>';
    }
  }

  // 上一首
  function prevTrack() {
    currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) play();
  }

  // 下一首
  function nextTrack() {
    currentTrack = (currentTrack + 1) % playlist.length;
    loadTrack(currentTrack);
    if (isPlaying) play();
  }

  // 更新进度条
  function updateProgress() {
    if (audio.duration) {
      const progress = (audio.currentTime / audio.duration) * 100;
      progressFill.style.width = `${progress}%`;
      
      // 更新时间显示
      currentTimeEl.textContent = formatTime(audio.currentTime);
      totalTimeEl.textContent = formatTime(audio.duration);
    }
  }

  // 格式化时间
  function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }

  // 点击进度条
  function seek(e) {
    const rect = progressBar.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    audio.currentTime = pos * audio.duration;
  }

  // 更新音量
  function updateVolume(e) {
    const rect = volumeSlider.getBoundingClientRect();
    const pos = (e.clientX - rect.left) / rect.width;
    const volume = Math.max(0, Math.min(1, pos));
    audio.volume = volume;
    volumeFill.style.width = `${volume * 100}%`;
    updateVolumeIcon(volume);
  }

  // 更新音量图标
  function updateVolumeIcon(volume) {
    const icon = volumeIcon.querySelector('svg');
    if (volume === 0) {
      icon.innerHTML = '<path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>';
    } else if (volume < 0.5) {
      icon.innerHTML = '<path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z"/>';
    } else {
      icon.innerHTML = '<path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>';
    }
  }

  // 显示/隐藏控制面板
  function toggleControls() {
    isControlsVisible = !isControlsVisible;
    playerControls.classList.toggle('show', isControlsVisible);
    
    // 如果显示控制面板，隐藏播放列表
    if (isControlsVisible && isPlaylistVisible) {
      togglePlaylist();
    }
  }

  // 显示/隐藏播放列表
  function togglePlaylist() {
    isPlaylistVisible = !isPlaylistVisible;
    playlistMenu.classList.toggle('show', isPlaylistVisible);
  }

  // 更新播放列表UI
  function updatePlaylistUI() {
    playlistMenu.innerHTML = '';
    playlist.forEach((track, index) => {
      const item = document.createElement('div');
      item.className = `playlist-item ${index === currentTrack ? 'active' : ''}`;
      item.textContent = `${track.title} - ${track.artist}`;
      item.addEventListener('click', () => {
        loadTrack(index);
        play();
        togglePlaylist();
      });
      playlistMenu.appendChild(item);
    });
  }

  // 事件监听
  playerIcon.addEventListener('click', toggleControls);
  playPauseBtn.addEventListener('click', togglePlay);
  prevBtn.addEventListener('click', prevTrack);
  nextBtn.addEventListener('click', nextTrack);
  progressBar.addEventListener('click', seek);
  volumeSlider.addEventListener('click', updateVolume);
  playlistBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    togglePlaylist();
  });

  // 音频事件
  audio.addEventListener('timeupdate', updateProgress);
  audio.addEventListener('ended', nextTrack);
  audio.addEventListener('loadedmetadata', () => {
    totalTimeEl.textContent = formatTime(audio.duration);
  });

  // 点击外部关闭控制面板
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.music-player')) {
      if (isControlsVisible) toggleControls();
      if (isPlaylistVisible) togglePlaylist();
    }
  });

  // 初始化
  initPlayer();
});