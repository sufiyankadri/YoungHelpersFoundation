import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauseService, CauseCategoryFilter, NavigationTab } from '../../../core/services/cause.service';
import { DonationService } from '../../../core/services/donation.service';

interface NavItem { label: string; description: string; icon: string; tab: NavigationTab; category?: CauseCategoryFilter; }
interface NavGroup { id: string; label: string; items: NavItem[]; }

@Component({
  selector: 'app-navbar', standalone: true, imports: [CommonModule],
  templateUrl: './navbar.component.html', styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  private host: ElementRef<HTMLElement> = inject(ElementRef);
  readonly mobileOpen = signal(false);
  readonly openGroup = signal<string | null>(null);
  private trigger: HTMLButtonElement | null = null;
  readonly groups: NavGroup[] = [
    { id: 'programs', label: 'Programs', items: [
      { label: 'Ek Zakat → Ek Rozgaar', description: 'Skills, tools and a path to earning', icon: 'handyman', tab: 'rozgaar' },
      { label: 'Medical support', description: 'Understanding treatment-related needs', icon: 'health_and_safety', tab: 'causes', category: 'medical' },
      { label: 'Emergency assistance', description: 'Support when circumstances change', icon: 'emergency', tab: 'causes', category: 'emergency' }
    ] },
    { id: 'about', label: 'About us', items: [
      { label: 'Our foundation', description: 'Our purpose and approach', icon: 'diversity_1', tab: 'about' },
      { label: 'Become a volunteer', description: 'Give your time and share your skills', icon: 'volunteer_activism', tab: 'volunteer' }
    ] },
    { id: 'resources', label: 'Resources', items: [
      { label: 'Zakat calculator', description: 'An estimate to help you plan', icon: 'calculate', tab: 'calculator' },
      { label: 'Transparency', description: 'Explore reporting and fund information', icon: 'receipt_long', tab: 'transparency' },
      { label: 'Common questions', description: 'Find an answer before you begin', icon: 'help_outline', tab: 'faq' }
    ] }
  ];
  constructor(public causeService: CauseService, public donationService: DonationService) {}
  navigate(tab: NavigationTab): void {
    this.close();
    this.causeService.navigateTo(tab);
    setTimeout(() => document.getElementById('main-content')?.focus({ preventScroll: true }));
  }
  explore(): void { this.causeService.setCategory('all'); this.navigate('causes'); }
  select(item: NavItem): void {
    if (item.category) this.causeService.setCategory(item.category);
    this.navigate(item.tab);
  }
  toggleMobile(): void { this.mobileOpen.update(value => !value); this.openGroup.set(null); }
  toggleGroup(id: string, event: Event): void {
    this.trigger = event.currentTarget as HTMLButtonElement;
    this.openGroup.set(this.openGroup() === id ? null : id);
  }
  openWithKeyboard(id: string, event: KeyboardEvent): void {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    this.trigger = event.currentTarget as HTMLButtonElement;
    this.openGroup.set(id);
    setTimeout(() => this.host.nativeElement.querySelector<HTMLButtonElement>('#submenu-' + id + ' button')?.focus());
  }
  groupActive(group: NavGroup): boolean {
    return group.items.some(item => item.tab === this.causeService.activeTab() &&
      (!item.category || item.category === this.causeService.selectedCategory()));
  }
  close(): void { this.mobileOpen.set(false); this.openGroup.set(null); }
  openDonate(): void { this.close(); this.donationService.openDonateModal(); }
  onFocusOut(event: FocusEvent): void {
    if (event.relatedTarget instanceof Node && !this.host.nativeElement.contains(event.relatedTarget)) this.close();
  }
  @HostListener('document:click', ['$event'])
  outside(event: MouseEvent): void {
    if (event.target instanceof Node && !this.host.nativeElement.contains(event.target)) this.close();
  }
  @HostListener('document:keydown.escape')
  escape(): void {
    if (this.openGroup()) { this.openGroup.set(null); this.trigger?.focus(); }
    else if (this.mobileOpen()) {
      this.close();
      this.host.nativeElement.querySelector<HTMLButtonElement>('.mobile-toggle')?.focus();
    }
  }
  @HostListener('window:resize')
  resize(): void { if (window.innerWidth > 1150) this.mobileOpen.set(false); }
}
