import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import CustomEventForm from '../Component/Pages/Analytics/CustomEventForm';

const Layout = ({ children }) => {
  const [collapsed, setCollapsed] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false); // for mobile sidebar toggle
  const [customEventPopupOpen, setCustomEventPopupOpen] = useState(false);

  const hideScrollbarStyle = {
    height: '100%',
    overflowY: 'auto',
    scrollbarWidth: 'none',
    msOverflowStyle: 'none',
  };

  const hideScrollbarWebkit = `
    ::-webkit-scrollbar {
      display: none;
    }
  `;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white relative">
      {/* Sidebar */}
      <div
        className={`
          fixed z-50 md:static h-full flex flex-col
          transition-all duration-300 ease-in-out
          ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
          ${collapsed ? 'md:w-[65px]' : 'md:w-[260px]'}
        `}
        style={{
          transitionProperty: 'width, transform',
          overflow: 'visible', // ✅ allow submenu to overflow
        }}
      >
        <style>{hideScrollbarWebkit}</style>
        <div style={{ ...hideScrollbarStyle, overflow: 'visible' }}>
          <Sidebar
            collapsed={collapsed}
            onToggleCollapse={() => setCollapsed(!collapsed)}
            onMobileMenuClick={() => setShowSidebar(false)}
            onCustomEventClick={() => setCustomEventPopupOpen(true)}
          />
        </div>
      </div>

      {/* Mobile Backdrop */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setShowSidebar(false)}
        />
      )}

      {/* Main Content */}
      <div
        className={`flex flex-col flex-1 z-10 transition-all duration-300 ease-in-out bg-white text-[#E6E6FA] ${
          showSidebar ? 'blur-sm select-none pointer-events-none md:pointer-events-auto md:blur-0' : ''
        }`}
      >
        <Header onToggle={() => setShowSidebar(!showSidebar)} />
        <main className="flex-1 pl-1 overflow-y-auto bg-white text-black rounded-tl-md rounded-tr-md">
          {children}
        </main>
        
        {/* Custom Event Popup */}
        {customEventPopupOpen && (
          <div style={{ position: 'fixed', left: 65, top: 0, width: 'calc(100vw - 65px)', height: '100vh', zIndex: 99999, background: 'rgba(0,0,0,0.38)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: 16, boxShadow: '0 4px 24px #9164d966', padding: 32, minWidth: 600, maxWidth: '80vw' }}>
              <h2 className="text-xl font-bold mb-4 text-black">Create Custom Event</h2>
              <CustomEventForm onClose={() => setCustomEventPopupOpen(false)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Layout;


// import React, { useState } from 'react';
// import Sidebar from './Sidebar';
// import Header from './Header';

// const Layout = ({ children }) => {
//   const [collapsed, setCollapsed] = useState(false);
//   const [showSidebar, setShowSidebar] = useState(false); // For mobile

//   const hideScrollbarStyle = {
//     height: '100%',
//     overflowY: 'auto',
//     scrollbarWidth: 'none',
//     msOverflowStyle: 'none',
//   };

//   const hideScrollbarWebkit = `::-webkit-scrollbar { display: none; }`;

//   return (
//     <div className="flex h-screen w-screen overflow-hidden relative bg-[#FFFFFF]">
//       {/* Sidebar */}
//       <div
//         className={`
//           fixed z-40 md:static
//           transition-all duration-300 ease-in-out
//           h-full
//           ${showSidebar ? 'translate-x-0' : '-translate-x-full'}
//           md:translate-x-0
//           ${collapsed ? 'md:w-[64px]' : 'md:w-[260px]'}
//           flex flex-col
//         `}
//         style={{ transitionProperty: 'width, transform' }}
//       >
//         <div style={hideScrollbarStyle}>
//           <style>{hideScrollbarWebkit}</style>
//           <Sidebar
//             collapsed={collapsed}
//             onToggleCollapse={() => setCollapsed(!collapsed)}
//             onMobileMenuClick={() => setShowSidebar(false)} // <-- Important
//           />
//         </div>
//       </div>

//       {/* Mobile Overlay */}
//       {showSidebar && (
//         <div
//           className="fixed inset-0 z-30 bg-black bg-opacity-50 md:hidden"
//           onClick={() => setShowSidebar(false)}
//         />
//       )}

//       {/* Main Content */}
//       <div className="flex flex-col flex-1 z-10 transition-all duration-300 ease-in-out">
//         <Header onToggle={() => setShowSidebar(!showSidebar)} />
//         <main className="flex-1 overflow-y-auto rounded-tl-2xl bg-[#EEF2F6] text-black">
//           {children}
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Layout;
