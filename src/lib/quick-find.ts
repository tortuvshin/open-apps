/**
 * Quick-find — the header search modal.
 *
 * Imported on first open only (see `src/layouts/header.astro`), so no
 * page pays for search until someone searches. It then loads Pagefind's
 * Component UI from the bundle `pagefind --site dist` writes, and
 * mounts `<pagefind-modal>` with Pagefind's own input, summary and
 * keyboard hints around `<quick-find-results>` below.
 *
 * Why a custom results element: `<pagefind-results>` lists pages in rank
 * order, and quick-find groups them by type (Apps, Collections,
 * Categories, Stacks), with category and platforms on app rows, a
 * zero-results path to browse or submit, and "See all results" handing
 * the query to the directory's own filter. It registers with the
 * Pagefind instance as a keyboard-navigable results component, so ↓
 * from the input, ↑ back to it and type-to-refine behave like
 * Pagefind's own list.
 */
// `?inline`: a plain CSS import would be hoisted into every page's
// stylesheet; as a string it ships in this lazy chunk instead.
import styles from './quick-find.css?inline';

const BUNDLE_PATH = '/pagefind/';

// Pagefind ranking: title and hidden-alias matches count most, and a
// higher `termSimilarity` prefers exact words over longer words that
// merely start with the query ("finance" over "financial"). See
// `tier()` for the exact > prefix > token order on top of this.
const RANKING = {
  termSimilarity: 2,
  metaWeights: { title: 8, aliases: 4, summary: 1.5, category: 1, platforms: 0.5 },
};

const GROUPS = {
  App: { label: 'Apps', limit: 6 },
  Collection: { label: 'Collections', limit: 3 },
  Category: { label: 'Categories', limit: 3 },
  Stack: { label: 'Stacks', limit: 3 },
} as const;
type GroupType = keyof typeof GROUPS;

/**
 * How many ranked results to load before tiering, grouping and capping.
 * A short page named for the query (the "Flutter" stack) ranks around
 * 14th by score, behind long app write-ups that repeat the word in
 * their headings; 20 keeps it in reach. Each candidate is one fragment
 * request (~2 KB gzipped on average, cached for later queries).
 */
const CANDIDATES = 20;

const normalize = (value: string) => value.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, ' ').trim();

/**
 * 0 — the title is the query ("Finance"); 1 — the title starts with it
 * ("flutter_server_box"); 2 — the title contains it as a word ("Open
 * Source Granola Alternatives"); 3 — anything else, in Pagefind order.
 */
function tier(title: string, term: string): number {
  const t = normalize(title);
  const q = normalize(term);
  if (!q) return 3;
  if (t === q) return 0;
  if (t.startsWith(q)) return 1;
  return ` ${t} `.includes(` ${q} `) ? 2 : 3;
}

// ── Minimal typings for the Component UI's global ─────────────────
interface PagefindResultData {
  url: string;
  meta: Record<string, string | undefined>;
  filters?: Record<string, string[]>;
}
interface PagefindInstance {
  searchTerm: string;
  on(event: string, callback: (...args: never[]) => void, owner?: unknown): void;
  registerResults(component: HTMLElement, capabilities: Record<string, boolean>): void;
  registerShortcut(shortcut: { label: string; description: string }, owner: unknown): void;
  deregisterAllShortcuts(owner: unknown): void;
  focusPreviousInput(from: Element): void;
  focusInputAndType(from: Element, char: string): void;
  focusInputAndDelete(from: Element): void;
  announceRaw(message: string, priority?: 'polite' | 'assertive'): void;
}
interface PagefindComponents {
  configureInstance(name: string, options: Record<string, unknown>): PagefindInstance;
  getInstanceManager(): { getInstance(name: string): PagefindInstance };
}
interface PagefindModalElement extends HTMLElement {
  open(): void;
  readonly isOpen: boolean;
}
declare global {
  interface Window {
    PagefindComponents?: PagefindComponents;
  }
}

function loadStylesheet(href: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const link = Object.assign(document.createElement('link'), { rel: 'stylesheet', href });
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Could not load ${href}`));
    document.head.append(link);
  });
}

function loadScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = Object.assign(document.createElement('script'), { src, type: 'module' });
    script.onload = () => resolve();
    script.onerror = () => reject(new Error(`Could not load ${src}`));
    document.head.append(script);
  });
}

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  className: string,
  text?: string,
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  node.className = className;
  if (text) node.textContent = text;
  return node;
}

function defineResults(pagefind: PagefindComponents, directory: string, submit: string) {
  class QuickFindResults extends HTMLElement {
    private instance: PagefindInstance | null = null;
    private renderId = 0;

    connectedCallback() {
      if (this.instance) return; // registered once, even if re-connected
      const instance = pagefind.getInstanceManager().getInstance('default');
      this.instance = instance;
      instance.registerResults(this, { keyboardNavigation: true, announcements: true });
      instance.on('loading', () => this.setAttribute('aria-busy', 'true'), this);
      instance.on('results', (result: { results: { data(): Promise<PagefindResultData> }[] }) => {
        void this.renderResults(result.results);
      }, this);
      this.addEventListener('keydown', (e) => this.onKeydown(e));
      this.addEventListener('focusin', () => {
        instance.registerShortcut({ label: '↑↓', description: 'navigate' }, this);
        instance.registerShortcut({ label: '↵', description: 'open' }, this);
      });
      this.addEventListener('focusout', (e) => {
        if (!this.contains(e.relatedTarget as Node | null)) instance.deregisterAllShortcuts(this);
      });
    }

    private async renderResults(results: { data(): Promise<PagefindResultData> }[]) {
      const instance = this.instance;
      if (!instance) return;
      const id = ++this.renderId;
      const term = instance.searchTerm.trim();
      if (!term) {
        this.replaceChildren();
        this.removeAttribute('aria-busy');
        return;
      }
      const loaded = await Promise.all(results.slice(0, CANDIDATES).map((r) => r.data()));
      if (id !== this.renderId) return;
      // Stable sort: Pagefind's order survives within each tier.
      const pages = loaded
        .map((page, rank) => ({ page, rank, tier: tier(page.meta.title ?? '', term) }))
        .sort((a, b) => a.tier - b.tier || a.rank - b.rank)
        .map(({ page }) => page);

      // Group in rank order; a group sits where its best result ranked.
      const groups = new Map<GroupType, PagefindResultData[]>();
      for (const page of pages) {
        const raw = page.filters?.type?.[0];
        const type: GroupType = raw && raw in GROUPS ? (raw as GroupType) : 'App';
        const list = groups.get(type) ?? [];
        if (list.length < GROUPS[type].limit) list.push(page);
        groups.set(type, list);
      }

      const root = el('div', 'qf');
      const shown = [...groups.values()].reduce((sum, list) => sum + list.length, 0);
      if (shown === 0) {
        const empty = el('div', 'qf-empty');
        empty.append(el('p', 'qf-empty-title', `Nothing matches “${term}”.`));
        const actions = el('p', 'qf-empty-actions');
        const browse = el('a', 'qf-action', 'Browse all apps');
        browse.href = directory;
        const add = el('a', 'qf-action', 'Submit an app');
        add.href = submit;
        actions.append(browse, add);
        empty.append(actions);
        root.append(empty);
      } else {
        for (const [type, list] of groups) {
          const section = el('section', 'qf-group');
          const heading = el('h2', 'qf-heading', GROUPS[type].label);
          heading.id = `qf-group-${type.toLowerCase()}`;
          section.setAttribute('aria-labelledby', heading.id);
          const ul = el('ul', 'qf-list');
          for (const page of list) ul.append(this.row(type, page));
          section.append(heading, ul);
          root.append(section);
        }
        const all = el('a', 'qf-all', `See all results for “${term}”`);
        all.href = `${directory}?q=${encodeURIComponent(term)}`;
        root.append(all);
      }
      this.replaceChildren(root);
      this.removeAttribute('aria-busy');
      instance.announceRaw(
        shown === 0
          ? `No results for ${term}`
          : `${shown} result${shown === 1 ? '' : 's'} for ${term}`,
        shown === 0 ? 'assertive' : 'polite',
      );
    }

    private row(type: GroupType, page: PagefindResultData): HTMLLIElement {
      const li = el('li', 'qf-item');
      const link = el('a', 'qf-link');
      link.href = page.meta.url || page.url;
      link.append(el('span', 'qf-title', page.meta.title || page.url));
      if (page.meta.summary) link.append(el('span', 'qf-summary', page.meta.summary));
      if (type === 'App') {
        const facts = [page.meta.category, page.meta.platforms].filter(Boolean).join(' · ');
        if (facts) link.append(el('span', 'qf-facts', facts));
      }
      li.append(link);
      return li;
    }

    private onKeydown(e: KeyboardEvent) {
      const instance = this.instance;
      const current = (e.target as Element).closest('a');
      if (!instance || !current) return;
      const links = [...this.querySelectorAll('a')];
      const index = links.indexOf(current);
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        const next = links[index + (e.key === 'ArrowDown' ? 1 : -1)];
        if (next) next.focus();
        else if (e.key === 'ArrowUp') instance.focusPreviousInput(current);
      } else if (e.key === 'Home' || e.key === 'End') {
        e.preventDefault();
        links[e.key === 'Home' ? 0 : links.length - 1]?.focus();
      } else if (e.key === 'Backspace') {
        e.preventDefault();
        instance.focusInputAndDelete(current);
      } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        if (e.key === '/') instance.focusPreviousInput(current);
        else instance.focusInputAndType(current, e.key);
      }
    }
  }
  if (!customElements.get('quick-find-results')) {
    customElements.define('quick-find-results', QuickFindResults);
  }
}

async function mount(trigger: HTMLButtonElement): Promise<PagefindModalElement> {
  document.head.append(Object.assign(document.createElement('style'), { textContent: styles }));
  await Promise.all([
    loadStylesheet(`${BUNDLE_PATH}pagefind-component-ui.css`),
    loadScript(`${BUNDLE_PATH}pagefind-component-ui.js`),
  ]);
  const pagefind = window.PagefindComponents;
  if (!pagefind) throw new Error('Pagefind Component UI did not load');

  // Must run before any component connects, or the defaults win.
  pagefind.configureInstance('default', {
    bundlePath: BUNDLE_PATH,
    excerptLength: 20,
    ranking: RANKING,
  });
  const directory = trigger.dataset.directory ?? '/';
  defineResults(pagefind, directory, '/submit/');

  // `<pagefind-modal>` moves its children into a <dialog> when it
  // connects, and a moved component initialises twice (two close
  // buttons in the header). So it mounts around a plain placeholder,
  // and the components are swapped in once, into the dialog itself.
  const modal = document.createElement('pagefind-modal') as PagefindModalElement;
  modal.setAttribute('reset-on-close', '');
  const placeholder = document.createElement('div');
  modal.append(placeholder);
  document.body.append(modal);
  const parts = document.createElement('div');
  parts.innerHTML = `
    <pagefind-modal-header>
      <pagefind-input placeholder="Search apps, collections, categories, stacks" debounce="150"></pagefind-input>
    </pagefind-modal-header>
    <pagefind-modal-body>
      <pagefind-summary></pagefind-summary>
      <quick-find-results></quick-find-results>
    </pagefind-modal-body>
    <pagefind-modal-footer>
      <pagefind-keyboard-hints></pagefind-keyboard-hints>
    </pagefind-modal-footer>`;
  placeholder.replaceWith(...parts.children);

  const dialog = modal.querySelector('dialog');
  if (dialog) {
    trigger.setAttribute('aria-controls', dialog.id);
    // Pagefind returns focus to its own trigger element; this header
    // uses a plain button, so hand focus back to it here. Capture phase
    // on the host runs this before Pagefind's own close handler, whose
    // `reset-on-close` only clears the input once it has lost focus.
    modal.addEventListener(
      'close',
      () => {
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      },
      true,
    );
    // Enter in the input opens the top result.
    dialog.addEventListener('keydown', (e) => {
      if (e.key !== 'Enter' || e.isComposing) return;
      if (!(e.target instanceof HTMLInputElement)) return;
      const first = modal.querySelector<HTMLAnchorElement>('quick-find-results a');
      if (first) {
        e.preventDefault();
        first.click();
      }
    });
  }
  return modal;
}

let ready: Promise<PagefindModalElement> | null = null;

export async function openQuickFind(trigger: HTMLButtonElement): Promise<void> {
  if (!ready) {
    trigger.setAttribute('aria-busy', 'true');
    ready = mount(trigger).finally(() => trigger.removeAttribute('aria-busy'));
    ready.catch(() => {
      ready = null;
    });
  }
  const modal = await ready;
  if (modal.isOpen) return;
  modal.open();
  trigger.setAttribute('aria-expanded', 'true');
}
