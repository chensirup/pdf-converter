import { useState, useEffect } from 'react';
import { FileText, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? 'bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-100'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => scrollToSection('hero')}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#6b8cff] to-[#a3b7ff] flex items-center justify-center shadow-lg shadow-blue-200">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
              PDF转换器
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-8">
            <button
              onClick={() => scrollToSection('tools')}
              className="text-gray-600 hover:text-[#6b8cff] transition-colors font-medium"
            >
              转换工具
            </button>
            <button
              onClick={() => scrollToSection('features')}
              className="text-gray-600 hover:text-[#6b8cff] transition-colors font-medium"
            >
              功能特性
            </button>
            <button
              onClick={() => scrollToSection('cta')}
              className="text-gray-600 hover:text-[#6b8cff] transition-colors font-medium"
            >
              定价方案
            </button>
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-[#6b8cff] hover:bg-blue-50"
            >
              登录
            </Button>
            <Button className="bg-gradient-to-r from-[#6b8cff] to-[#a3b7ff] text-white hover:opacity-90 shadow-lg shadow-blue-200">
              免费注册
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-600" />
            ) : (
              <Menu className="w-6 h-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 animate-in slide-in-from-top-2">
            <div className="flex flex-col gap-2">
              <button
                onClick={() => scrollToSection('tools')}
                className="px-4 py-3 text-left text-gray-600 hover:text-[#6b8cff] hover:bg-blue-50 rounded-lg transition-colors"
              >
                转换工具
              </button>
              <button
                onClick={() => scrollToSection('features')}
                className="px-4 py-3 text-left text-gray-600 hover:text-[#6b8cff] hover:bg-blue-50 rounded-lg transition-colors"
              >
                功能特性
              </button>
              <button
                onClick={() => scrollToSection('cta')}
                className="px-4 py-3 text-left text-gray-600 hover:text-[#6b8cff] hover:bg-blue-50 rounded-lg transition-colors"
              >
                定价方案
              </button>
              <div className="flex gap-2 mt-2 pt-2 border-t border-gray-100">
                <Button variant="outline" className="flex-1">
                  登录
                </Button>
                <Button className="flex-1 bg-gradient-to-r from-[#6b8cff] to-[#a3b7ff] text-white">
                  注册
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
