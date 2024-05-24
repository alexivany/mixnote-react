export default function SidebarSettings() {
  return (
    <>
      <button className="sidebar--new-note">
        <img src="./src/assets/SVG/plus.svg" alt="" />
        New Song
      </button>
      <button className="sidebar--pref">
        <img src="./src/assets/SVG/settings.svg" alt="" />
        Preferences
      </button>
      <button className="sidebar--about">
        <img src="./src/assets/SVG/info.svg" alt="" />
        About
      </button>
    </>
  );
}
