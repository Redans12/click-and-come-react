import React from 'react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    company: [
      { name: 'Sobre nosotros', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Carreras', href: '#' }
    ],
    support: [
      { name: 'Ayuda', href: '#' },
      { name: 'Contáctanos', href: '#' },
      { name: 'Políticas', href: '#' }
    ],
    restaurants: [
      { name: 'Asóciate con nosotros', href: '#' }
    ]
  };

  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Sección Compañía */}
          <div>
            <h4 className="text-sm font-semibold text-gray-100 tracking-wider uppercase">
              Compañía
            </h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.company.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-base text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sección Soporte */}
          <div>
            <h4 className="text-sm font-semibold text-gray-100 tracking-wider uppercase">
              Soporte
            </h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.support.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-base text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Sección Para Restaurantes */}
          <div className="col-span-2 md:col-span-1">
            <h4 className="text-sm font-semibold text-gray-100 tracking-wider uppercase">
              Para Restaurantes
            </h4>
            <ul className="mt-4 space-y-2">
              {footerLinks.restaurants.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-base text-gray-400 hover:text-white transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 border-t border-gray-700 pt-8 text-center">
          <p className="text-base text-gray-400">
            &copy; {currentYear} ClickAndCome. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;