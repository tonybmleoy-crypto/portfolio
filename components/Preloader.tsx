/**
 * The name on a black screen while the page opens, about 1.3s in all.
 *
 * Plain CSS (see .preloader in globals.css), no JavaScript: it starts with the
 * first paint and ends on time however long the scripts take to load. It lives
 * in the root layout, so it plays on a full page load only, never on in-app
 * navigation.
 *
 * One root layout serves both languages. The head script sets <html lang="en">
 * on /en pages before the first paint, and CSS shows the matching name.
 */
export function Preloader({ text }: { text: { ru: string; en: string } }) {
  return (
    <div className="preloader" aria-hidden>
      <span className="preloader-text preloader-text-ru">{text.ru}</span>
      <span className="preloader-text preloader-text-en">{text.en}</span>
    </div>
  );
}
