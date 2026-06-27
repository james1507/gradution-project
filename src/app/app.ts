import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID, signal } from '@angular/core';

type GalleryPhoto = {
  src: string;
  caption: string;
  fallbackSrc?: string;
};

type TimelineMoment = {
  year: string;
  title: string;
  text: string;
};

type FloatingMessage = {
  text: string;
  delay: string;
  left: string;
  duration: string;
};

type GraduationConfig = {
  loverName: string;
  eyebrow: string;
  headline: string;
  subtitle: string;
  dateLabel: string;
  primaryMessage: string;
  signature: string;
  music: {
    src: string;
    title: string;
  };
  photos: GalleryPhoto[];
  timeline: TimelineMoment[];
  wishes: string[];
};

const defaultConfig: GraduationConfig = {
  loverName: 'Em yêu',
  eyebrow: 'Graduation Day',
  headline: 'Chúc mừng em đã tốt nghiệp đại học',
  subtitle: 'Hôm nay là ngày của em, người đã đi qua rất nhiều cố gắng để chạm đến cột mốc rực rỡ này.',
  dateLabel: 'Mãi tự hào về em',
  primaryMessage:
    'Anh muốn dành trang nhỏ này để lưu lại khoảnh khắc em bước sang một chương mới. Mong em luôn tin vào chính mình, luôn được yêu thương, và luôn rực rỡ theo cách rất riêng của em.',
  signature: 'Từ người luôn thương em',
  music: {
    src: 'assets/music/graduation-song.mp3',
    title: 'Bài nhạc của chúng mình',
  },
  photos: [
    { src: 'assets/photos/photo-1.svg', caption: 'Nụ cười ngày tốt nghiệp' },
    { src: 'assets/photos/photo-2.svg', caption: 'Tất cả cố gắng đã nở hoa' },
    { src: 'assets/photos/photo-3.svg', caption: 'Chương mới bắt đầu từ hôm nay' },
  ],
  timeline: [
    {
      year: '01',
      title: 'Những ngày cố gắng',
      text: 'Có những ngày mệt, có những lần áp lực, nhưng em vẫn đi tiếp bằng sự bền bỉ rất đáng tự hào.',
    },
    {
      year: '02',
      title: 'Khoảnh khắc tỏa sáng',
      text: 'Tấm bằng này không chỉ là kết quả, mà còn là bằng chứng cho bản lĩnh và trái tim của em.',
    },
    {
      year: '03',
      title: 'Tương lai của em',
      text: 'Anh tin phía trước còn rất nhiều điều đẹp đang chờ em, và anh muốn được chứng kiến từng điều đó.',
    },
  ],
  wishes: [
    'Tự hào về em rất nhiều',
    'Cảm ơn em vì đã luôn cố gắng',
    'Chúc em một tương lai thật rực rỡ',
    'Luôn yêu nụ cười của em',
  ],
};

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit, OnDestroy {
  protected readonly config = signal<GraduationConfig>(defaultConfig);
  protected readonly activePhotoIndex = signal(0);
  protected readonly isMusicPlaying = signal(false);
  protected readonly floatingMessages = signal<FloatingMessage[]>([]);
  protected readonly sparkleItems = Array.from({ length: 34 }, (_, index) => ({
    id: index,
    left: `${(index * 19 + 7) % 100}%`,
    top: `${(index * 31 + 11) % 100}%`,
    delay: `${(index % 9) * 0.22}s`,
  }));
  protected readonly fireworkItems = Array.from({ length: 7 }, (_, index) => index);
  protected readonly confettiItems = Array.from({ length: 90 }, (_, index) => ({
    id: index,
    left: `${(index * 37) % 100}%`,
    delay: `${(index % 18) * 0.32}s`,
    duration: `${5 + (index % 7) * 0.45}s`,
    rotate: `${(index * 29) % 360}deg`,
    color: ['#f97316', '#f43f5e', '#22c55e', '#38bdf8', '#facc15', '#a855f7'][index % 6],
  }));

  private photoTimer?: number;
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: object) {
    this.isBrowser = isPlatformBrowser(platformId);
    this.floatingMessages.set(this.createFloatingMessages(defaultConfig.wishes));
  }

  ngOnInit(): void {
    if (!this.isBrowser) {
      return;
    }

    void this.loadConfig();
    this.photoTimer = window.setInterval(() => this.nextPhoto(), 4200);
  }

  ngOnDestroy(): void {
    if (this.photoTimer) {
      window.clearInterval(this.photoTimer);
    }
  }

  protected nextPhoto(): void {
    const photoCount = this.config().photos.length;
    this.activePhotoIndex.update((current) => (current + 1) % photoCount);
  }

  protected previousPhoto(): void {
    const photoCount = this.config().photos.length;
    this.activePhotoIndex.update((current) => (current - 1 + photoCount) % photoCount);
  }

  protected selectPhoto(index: number): void {
    this.activePhotoIndex.set(index);
  }

  protected useFallbackPhoto(photo: GalleryPhoto): void {
    if (!photo.fallbackSrc || photo.src === photo.fallbackSrc) {
      return;
    }

    photo.src = photo.fallbackSrc;
  }

  protected wishForPhoto(index: number): string {
    const wishes = this.config().wishes;
    return wishes[index % wishes.length] ?? this.config().primaryMessage;
  }

  protected marqueePhotos(row: number): GalleryPhoto[] {
    const photos = this.config().photos;
    if (photos.length === 0) {
      return [];
    }

    return Array.from({ length: photos.length * 3 }, (_, index) => photos[(index + row) % photos.length]);
  }

  protected toggleMusic(audio: HTMLAudioElement): void {
    if (audio.paused) {
      void audio.play().then(() => this.isMusicPlaying.set(true));
      return;
    }

    audio.pause();
    this.isMusicPlaying.set(false);
  }

  protected onMusicEnded(): void {
    this.isMusicPlaying.set(false);
  }

  private async loadConfig(): Promise<void> {
    try {
      const response = await fetch('graduation-config.json', { cache: 'no-store' });
      if (!response.ok) {
        return;
      }

      const remoteConfig = (await response.json()) as GraduationConfig;
      const mergedConfig = {
        ...defaultConfig,
        ...remoteConfig,
        music: { ...defaultConfig.music, ...remoteConfig.music },
        photos: this.withPhotoFallbacks(
          remoteConfig.photos?.length ? remoteConfig.photos : defaultConfig.photos,
        ),
        timeline: remoteConfig.timeline?.length ? remoteConfig.timeline : defaultConfig.timeline,
        wishes: remoteConfig.wishes?.length ? remoteConfig.wishes : defaultConfig.wishes,
      };

      this.config.set(mergedConfig);
      this.floatingMessages.set(this.createFloatingMessages(mergedConfig.wishes));
      this.activePhotoIndex.set(0);
    } catch {
      this.config.set(defaultConfig);
    }
  }

  private createFloatingMessages(wishes: string[]): FloatingMessage[] {
    return wishes.flatMap((wish, index) => [
      {
        text: wish,
        delay: `${index * 1.2}s`,
        left: `${10 + ((index * 23) % 76)}%`,
        duration: `${11 + (index % 4)}s`,
      },
      {
        text: wish,
        delay: `${5 + index * 1.1}s`,
        left: `${8 + ((index * 31) % 78)}%`,
        duration: `${12 + (index % 3)}s`,
      },
    ]);
  }

  private withPhotoFallbacks(photos: GalleryPhoto[]): GalleryPhoto[] {
    return photos.map((photo) => {
      if (!photo.src.endsWith('.svg')) {
        return photo;
      }

      return {
        ...photo,
        fallbackSrc: photo.src.replace(/\.svg$/, '.jpg'),
      };
    });
  }
}
