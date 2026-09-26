/**
 * Where Open App Scout has been featured. Shown under the home hero and
 * on /about. Add a mention here with a link to the exact post; never
 * list one that cannot be linked.
 */
export interface PressMention {
  /** Publication, e.g. "Astro". */
  outlet: string;
  /** Title of the post or issue. */
  title: string;
  url: string;
  /** Month of publication, YYYY-MM. */
  date: string;
  /** Short label for the hero pill, e.g. "Astro’s August 2026 roundup". */
  short: string;
  /** Inline SVG path data (24×24 viewBox) for the outlet's mark, if any. */
  markPath?: string;
}

const ASTRO_MARK =
  'M8.358 20.162c-1.186-1.07-1.532-3.316-1.038-4.944.856 1.026 2.043 1.352 3.272 1.535 1.897.283 3.76.177 5.522-.678.202-.098.388-.229.608-.36.166.473.209.95.151 1.437-.14 1.185-.738 2.1-1.688 2.794-.38.277-.782.525-1.175.787-1.205.804-1.531 1.747-1.078 3.119l.044.148a3.158 3.158 0 0 1-1.407-1.188 3.31 3.31 0 0 1-.544-1.815c-.004-.32-.004-.642-.048-.958-.106-.769-.472-1.113-1.161-1.133-.707-.02-1.267.411-1.415 1.09-.012.053-.028.104-.045.165h.002zm-5.961-4.445s3.24-1.575 6.49-1.575l2.451-7.565c.092-.366.36-.614.662-.614.302 0 .57.248.662.614l2.45 7.565c3.85 0 6.491 1.575 6.491 1.575L16.088.727C15.93.285 15.663 0 15.303 0H8.697c-.36 0-.615.285-.784.727l-5.516 14.99z';

export const press: PressMention[] = [
  {
    outlet: 'Astro',
    title: 'What’s new in Astro — August 2026',
    url: 'https://astro.build/blog/whats-new-august-2026/',
    date: '2026-08',
    short: 'Featured in Astro’s August 2026 roundup',
    markPath: ASTRO_MARK,
  },
];
