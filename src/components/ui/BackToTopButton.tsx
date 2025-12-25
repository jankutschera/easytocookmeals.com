'use client';

export function BackToTopButton() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-8 right-8 z-30">
      <button
        onClick={scrollToTop}
        className="p-4 bg-terracotta-500 hover:bg-terracotta-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-110"
        aria-label="Back to top"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      </button>
    </div>
  );
}
