import { Component, ElementRef, HostListener, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CauseService, NavigationTab } from '../../../core/services/cause.service';
import { DonationService } from '../../../core/services/donation.service';
import { Programme, Collection } from '../../../core/models/public-catalogue';
interface NavItem {
  label: string;
  description: string;
  icon: string;
  tab?: NavigationTab;
  programme?: Programme;
  collection?: Collection;
  info?: string;
}
interface NavGroup {
  id: string;
  label: string;
  items: NavItem[];
}
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  private host: ElementRef<HTMLElement> = inject(ElementRef);
  readonly mobileOpen = signal(false);
  readonly openGroup = signal<string | null>(null);
  private trigger: HTMLButtonElement | null = null;
  readonly groups: NavGroup[] = [
    {
      id: 'programs',
      label: 'Programs',
      items: [
        {
          label: 'All programme guides',
          description: 'Understand the need and the approach',
          icon: 'grid_view',
          tab: 'categories',
        },
        {
          label: 'Rozgaar & livelihoods',
          description: 'Our main mission: a way to earn',
          icon: 'handyman',
          programme: 'rozgaar',
        },
        {
          label: 'Medical support',
          description: 'A supporting programme guide',
          icon: 'health_and_safety',
          programme: 'medical',
        },
        {
          label: 'Emergency assistance',
          description: 'A responsible response to hardship',
          icon: 'emergency',
          programme: 'emergency',
        },
      ],
    },
    {
      id: 'explore',
      label: 'Explore',
      items: [
        {
          label: 'All causes',
          description: 'Search, filter and understand examples',
          icon: 'travel_explore',
          collection: 'all',
        },
        {
          label: 'Trending causes',
          description: 'Example activity-based discovery',
          icon: 'trending_up',
          collection: 'trending',
        },
        {
          label: 'Featured causes',
          description: 'An editorial preview collection',
          icon: 'star',
          collection: 'featured',
        },
        {
          label: 'Latest causes',
          description: 'Newly published illustrative examples',
          icon: 'schedule',
          collection: 'latest',
        },
      ],
    },
    {
      id: 'about',
      label: 'About',
      items: [
        {
          label: 'Our story',
          description: 'One purpose, more opportunities',
          icon: 'diversity_1',
          info: 'about',
        },
        {
          label: 'Our process',
          description: 'Listen, review and follow through',
          icon: 'route',
          info: 'process',
        },
        {
          label: 'Advisory board',
          description: 'Appointments and public disclosures',
          icon: 'groups',
          info: 'advisory',
        },
        {
          label: 'Our council',
          description: 'Governance and responsibilities',
          icon: 'account_balance',
          info: 'council',
        },
        {
          label: 'Legal & finance',
          description: 'Roles, evidence and approvals',
          icon: 'balance',
          info: 'legal',
        },
        {
          label: 'Volunteer with us',
          description: 'Share your time and skills',
          icon: 'volunteer_activism',
          tab: 'volunteer',
        },
      ],
    },
    {
      id: 'resources',
      label: 'Resources',
      items: [
        {
          label: 'Audit & reports',
          description: 'Evidence before a claim',
          icon: 'receipt_long',
          info: 'audit',
        },
        {
          label: 'Public dashboard',
          description: 'Approved reporting availability',
          icon: 'monitoring',
          info: 'dashboard',
        },
        {
          label: 'Zakat calculator',
          description: 'A transparent planning estimate',
          icon: 'calculate',
          tab: 'calculator',
        },
        {
          label: 'Common questions',
          description: 'Current availability and mission',
          icon: 'help_outline',
          info: 'faq',
        },
        {
          label: 'Policies & contact',
          description: 'Approved information and safe channels',
          icon: 'policy',
          info: 'policies',
        },
      ],
    },
  ];
  constructor(
    public causeService: CauseService,
    public donationService: DonationService,
  ) {}
  navigate(tab: NavigationTab) {
    this.close();
    this.causeService.navigateTo(tab);
    setTimeout(() => document.getElementById('main-content')?.focus({ preventScroll: true }));
  }
  skipToContent(event: Event) {
    event.preventDefault();
    this.close();
    const main = document.getElementById('main-content');
    main?.focus();
    main?.scrollIntoView?.({ block: 'start', behavior: 'auto' });
  }
  mission() {
    this.navigate('home');
    setTimeout(() =>
      document
        .getElementById('monthly-mission')
        ?.scrollIntoView({ block: 'start', behavior: 'auto' }),
    );
  }
  explore() {
    this.close();
    this.causeService.explore();
  }
  select(item: NavItem) {
    this.close();
    if (item.programme) this.causeService.openCategory(item.programme);
    else if (item.collection) this.causeService.explore(item.collection);
    else if (item.info) this.causeService.openInfo(item.info);
    else if (item.tab) this.causeService.navigateTo(item.tab);
    setTimeout(() => document.getElementById('main-content')?.focus({ preventScroll: true }));
  }
  toggleMobile() {
    this.mobileOpen.update((value) => !value);
    this.openGroup.set(null);
  }
  toggleGroup(id: string, event: Event) {
    this.trigger = event.currentTarget as HTMLButtonElement;
    this.openGroup.set(this.openGroup() === id ? null : id);
  }
  openWithKeyboard(id: string, event: KeyboardEvent) {
    if (event.key !== 'ArrowDown') return;
    event.preventDefault();
    this.trigger = event.currentTarget as HTMLButtonElement;
    this.openGroup.set(id);
    setTimeout(() =>
      this.host.nativeElement
        .querySelector<HTMLButtonElement>('#submenu-' + id + ' button')
        ?.focus(),
    );
  }
  groupActive(group: NavGroup) {
    const tab = this.causeService.activeTab();
    return group.id === 'programs'
      ? ['categories', 'category'].includes(tab)
      : group.id === 'explore'
        ? ['causes', 'cause'].includes(tab)
        : group.id === 'about'
          ? tab === 'info' &&
            ['about', 'process', 'advisory', 'council', 'legal'].includes(
              this.causeService.infoPage(),
            )
          : tab === 'calculator' ||
            (tab === 'info' &&
              ['audit', 'dashboard', 'faq', 'policies', 'contact'].includes(
                this.causeService.infoPage(),
              ));
  }
  close() {
    this.mobileOpen.set(false);
    this.openGroup.set(null);
  }
  openDonate() {
    this.close();
    this.donationService.openDonateModal();
  }
  onFocusOut(event: FocusEvent) {
    if (
      event.relatedTarget instanceof Node &&
      !this.host.nativeElement.contains(event.relatedTarget)
    )
      this.close();
  }
  @HostListener('document:click', ['$event']) outside(event: MouseEvent) {
    if (event.target instanceof Node && !this.host.nativeElement.contains(event.target))
      this.close();
  }
  @HostListener('document:keydown.escape') escape() {
    if (this.openGroup()) {
      this.openGroup.set(null);
      this.trigger?.focus();
    } else if (this.mobileOpen()) {
      this.close();
      this.host.nativeElement.querySelector<HTMLButtonElement>('.mobile-toggle')?.focus();
    }
  }
  @HostListener('window:resize') resize() {
    if (window.innerWidth > 1150) this.mobileOpen.set(false);
  }
}
