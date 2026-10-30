import { Component, input, signal } from '@angular/core';

/** Galerie interactive : image principale, miniatures et flèches (adaptées au RTL). */
@Component({
  selector: 'app-image-gallery',
  standalone: true,
  template: `
  <div class="space-y-3">
    <div class="relative bg-stone-100 rounded-xl overflow-hidden aspect-4/3">
      @if (images().length) {
        <img [src]="images()[selected()]" alt="" class="w-full h-full object-cover">
      }
      @if (images().length > 1) {
        <button type="button" class="absolute top-1/2 -translate-y-1/2 start-2 w-9 h-9 rounded-full bg-white/90 shadow cursor-pointer rtl:rotate-180" (click)="go(-1)" aria-label="Previous">‹</button>
        <button type="button" class="absolute top-1/2 -translate-y-1/2 end-2 w-9 h-9 rounded-full bg-white/90 shadow cursor-pointer rtl:rotate-180" (click)="go(1)" aria-label="Next">›</button>
        <span class="absolute bottom-2 end-3 text-xs bg-black/60 text-white rounded-full px-2 py-0.5">{{ selected() + 1 }} / {{ images().length }}</span>
      }
    </div>
    @if (images().length > 1) {
      <div class="flex gap-2 overflow-x-auto">
        @for (img of images(); track $index) {
          <button type="button" (click)="selected.set($index)"
                  class="shrink-0 w-20 h-16 rounded-lg overflow-hidden border-2 cursor-pointer"
                  [class]="$index === selected() ? 'border-amber-600' : 'border-transparent opacity-70'">
            <img [src]="img" alt="" class="w-full h-full object-cover">
          </button>
        }
      </div>
    }
  </div>`,
})
export class ImageGalleryComponent {
  images = input.required<string[]>();
  selected = signal(0);
  go(step: number) {
    const n = this.images().length;
    this.selected.update(i => (i + step + n) % n);
  }
}
