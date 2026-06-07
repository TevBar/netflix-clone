import { Globe } from 'lucide-react'

// Netflix-style footer: 4-column link grid, language selector, copyright.
// Placed in __root.tsx so it renders once on every page without repeating the import.

const LINK_COLUMNS = [
  ['FAQ', 'Help Center', 'Account', 'Media Center'],
  ['Investor Relations', 'Jobs', 'Cookie Preferences', 'Privacy'],
  ['Legal Notices', 'Corporate Information', 'Contact Us', 'Speed Test'],
  ['Terms of Use', 'Do Not Sell My Personal Information', 'Ad Choices', 'Gift Cards'],
]

const Footer = () => (
  <footer className="bg-black border-t border-white/10 text-gray-400 mt-16 px-8 md:px-14 py-12">
    <p className="text-sm mb-6">
      Questions? Call{' '}
      <a href="tel:1-844-505-2993" className="underline hover:text-white transition-colors">
        1-844-505-2993
      </a>
    </p>

    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-x-4 gap-y-3 mb-8">
      {LINK_COLUMNS.map((column, ci) => (
        <ul key={ci} className="space-y-3">
          {column.map(link => (
            <li key={link}>
              <a
                href="#"
                onClick={e => e.preventDefault()}
                className="text-sm hover:text-white transition-colors underline underline-offset-2"
              >
                {link}
              </a>
            </li>
          ))}
        </ul>
      ))}
    </div>

    {/* Language selector — cosmetic, no real locale switching needed */}
    <button className="flex items-center gap-2 border border-gray-500 text-gray-400 text-sm px-4 py-1.5 mb-5 hover:border-white hover:text-white transition-colors rounded">
      <Globe size={14} />
      English
    </button>

    <p className="text-xs text-gray-600">Netflix Clone &copy; 2026</p>
  </footer>
)

export default Footer
