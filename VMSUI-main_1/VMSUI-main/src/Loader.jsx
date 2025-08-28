// Loader component
const Loader = () => (
  <div style={loaderStyles}>
    <div style={spinnerStyles}>Wait</div>
  </div>
);

// CSS for loader (inline styles)
const loaderStyles = {
  position: "fixed",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: "1000",
};

const spinnerStyles = {
  border: "4px solid #f3f3f3",
  borderTop: "4px solid #3498db",
  borderRadius: "50%",
  width: "50px",
  height: "50px",
  animation: "spin 1s linear infinite",
  padding: "5px",
};

// CSS animation for spinner
const spinAnimation = `@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`;

// Adding the animation to the document head
const styleTag = document.createElement("style");
styleTag.innerHTML = spinAnimation;
document.head.appendChild(styleTag);

export default Loader;
