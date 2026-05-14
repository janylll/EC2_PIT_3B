export function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto py-6 shrink-0">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4">
        
        <div className="flex items-center gap-2">
          <img src="/icon.png" alt="CDO MedGuide" className="w-6 h-6 opacity-80 grayscale" />
          <span className="text-gray-500 font-medium text-sm">
            © 2026 CDO MedGuide. All rights reserved.
          </span>
        </div>

        <div className="flex gap-6 text-sm text-gray-500 font-medium">
          <a href="#" className="hover:text-green-600 transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-green-600 transition-colors">Terms of Service</a>
          <a href="#" className="hover:text-green-600 transition-colors">Contact Support</a>
        </div>

      </div>
    </footer>
  );
}