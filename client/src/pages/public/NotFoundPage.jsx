import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/common/Button';
import { Compass, Home, Search } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-[#F7F9F8] px-4 py-16">
      <div className="text-center max-w-md mx-auto space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-[#E6F4F2] text-[#0F766E] flex items-center justify-center mx-auto shadow-sm">
          <Compass className="w-8 h-8 animate-spin" style={{ animationDuration: '10s' }} />
        </div>
        <span className="text-xs font-bold text-[#0F766E] uppercase tracking-wider block">
          404 Error
        </span>
        <h1 className="text-3xl font-extrabold text-[#17211F] font-display">
          Page Not Found
        </h1>
        <p className="text-xs sm:text-sm text-[#64716D] leading-relaxed">
          The opportunity, listing, or page you were looking for doesn't exist or may have been moved.
        </p>

        <div className="pt-2 flex items-center justify-center gap-3">
          <Link to="/">
            <Button variant="primary" size="md">
              <Home className="w-4 h-4 mr-1" />
              Return Home
            </Button>
          </Link>
          <Link to="/jobs">
            <Button variant="outline" size="md">
              <Search className="w-4 h-4 mr-1" />
              Explore Jobs
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
