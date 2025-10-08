import React from 'react';

const NotFoundPage = () => {

  const goBack = () => {
    window.history.back();
  };

  return (
    <section className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6 text-center">
        <div className="relative mb-8">
          <h1 className="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600 dark:text-primary-500 transition-all duration-1000 ">
            404
          </h1>
        </div>
        <p className="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl dark:text-white transition-all duration-700 delay-100">
          Oops! Page not found.
        </p>
        <p className="mb-8 text-lg font-light text-gray-500 dark:text-gray-400 max-w-md mx-auto transition-all duration-700 delay-200">
          Sorry, the page you're looking for doesn't exist or has been moved. You'll find lots to explore on the home page.
        </p>
        
        <div className="relative my-12 w-64 h-64 mx-auto transition-all duration-1000 delay-300">
          <svg className="w-full h-full" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <path fill="#ffee58" d="M44.7,-76.4C58.1,-69.8,69.2,-58.2,77.5,-44.3C85.8,-30.4,91.3,-14.2,91.2,0.1C91,14.4,85.2,28.8,75.9,40.2C66.6,51.6,53.9,60.1,40.1,67.3C26.3,74.5,11.5,80.4,-2.3,83.6C-16.1,86.8,-32.2,87.3,-44.2,80.1C-56.2,72.9,-64.1,58,-72.1,43.1C-80.1,28.2,-88.2,13.1,-89.1,-2.3C-90,-17.7,-83.8,-35.4,-73.2,-49.1C-62.6,-62.8,-47.6,-72.6,-32.3,-78.2C-17,-83.8,-1.4,-85.2,12.2,-82.4C25.8,-79.6,37.3,-72.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg className="w-32 h-32 text-white dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
        </div>
        
        <div className="transition-all duration-700 delay-500">
          <button
            onClick={goBack}
            className="inline-flex items-center text-white bg-yellow-600 hover:bg-yellow-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:focus:ring-blue-900 transition-all transform hover:-translate-y-1 shadow-lg mx-auto"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            Go Back
          </button>
        </div>
        
      </div>
    </section>
  );
};

export default NotFoundPage;