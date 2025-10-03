import { Link, useLocation } from 'react-router-dom';
import { ChevronRight, Home } from 'lucide-react';
import StructuredData, { BreadcrumbSchema } from './StructuredData';

const Breadcrumbs = () => {
  const location = useLocation();
  const pathnames = location.pathname.split('/').filter((x) => x);

  if (pathnames.length === 0) return null;

  const breadcrumbItems = [
    { name: 'Home', url: window.location.origin },
    ...pathnames.map((name, index) => {
      const url = `${window.location.origin}/${pathnames.slice(0, index + 1).join('/')}`;
      return {
        name: name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' '),
        url,
      };
    }),
  ];

  return (
    <>
      <StructuredData data={BreadcrumbSchema(breadcrumbItems)} />
      <nav aria-label="Breadcrumb" className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-muted-foreground">
          <li>
            <Link
              to="/"
              className="hover:text-primary transition-colors duration-200 flex items-center"
              aria-label="Home"
            >
              <Home className="w-4 h-4" />
            </Link>
          </li>
          {pathnames.map((name, index) => {
            const routeTo = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            const displayName = name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, ' ');

            return (
              <li key={routeTo} className="flex items-center space-x-2">
                <ChevronRight className="w-4 h-4" />
                {isLast ? (
                  <span className="text-foreground font-medium" aria-current="page">
                    {displayName}
                  </span>
                ) : (
                  <Link
                    to={routeTo}
                    className="hover:text-primary transition-colors duration-200"
                  >
                    {displayName}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
};

export default Breadcrumbs;
