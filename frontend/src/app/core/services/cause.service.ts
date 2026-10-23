import { Injectable, signal, computed } from '@angular/core';
import { Cause, MOCK_CAUSES, IMPACT_STATS, FAQ_DATA, FaqItem } from '../models/cause.model';

export type NavigationTab = 
  | 'home' 
  | 'causes' 
  | 'calculator' 
  | 'rozgaar' 
  | 'about' 
  | 'volunteer' 
  | 'transparency' 
  | 'faq' 
  | 'apply' 
  | 'admin';

export type CauseCategoryFilter = 'all' | 'rozgaar' | 'medical' | 'education' | 'emergency';

/**
 * Service managing causes, categories, impact statistics, and active navigation tab state.
 */
@Injectable({
  providedIn: 'root'
})
export class CauseService {
  // Navigation State
  readonly activeTab = signal<NavigationTab>('home');
  readonly selectedCategory = signal<CauseCategoryFilter>('all');

  // Causes Store
  readonly causes = signal<Cause[]>(MOCK_CAUSES);

  // Filtered Causes computed based on selected category
  readonly filteredCauses = computed(() => {
    const cat = this.selectedCategory();
    if (cat === 'all') return this.causes();
    return this.causes().filter(c => c.category === cat);
  });

  // Active Rozgaar Case for Highlight / Spotlight view
  readonly activeRozgaarCase = computed(() => {
    return this.causes().find(c => c.category === 'rozgaar') || this.causes()[0];
  });

  // Impact Statistics
  readonly stats = signal(IMPACT_STATS);

  // FAQs
  readonly faqs = signal<FaqItem[]>(FAQ_DATA);
  readonly expandedFaqIndex = signal<number | null>(0);

  /**
   * Navigate to a specific section or tab.
   */
  navigateTo(tab: NavigationTab): void {
    this.activeTab.set(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  /**
   * Set the active cause category filter.
   */
  setCategory(category: CauseCategoryFilter): void {
    this.selectedCategory.set(category);
  }

  /**
   * Toggle accordion expansion state for FAQ items.
   */
  toggleFaq(index: number): void {
    this.expandedFaqIndex.set(this.expandedFaqIndex() === index ? null : index);
  }
}
