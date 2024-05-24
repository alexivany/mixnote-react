import SidebarSettings from "./SidebarSettings";

export default function Sidebar() {
  return (
    <div className="sidebar">
      <div className="sidebar--title">
        <h1>MixNote</h1>
        <div className="icon-navbar-container">
          <img src="./src/assets/SVG/music-slider.svg" alt="" />
          <img
            src="./src/assets/SVG/hamburger.svg"
            className="hamburger-menu"
            alt=""
          />
        </div>
      </div>
      <div>
        <div className="sidebar--song-list"></div>
        <div className="sidebar--settings">
          <SidebarSettings />
        </div>
      </div>
    </div>
  );
}
