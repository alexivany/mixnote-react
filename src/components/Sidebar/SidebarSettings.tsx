export default function SidebarSettings() {
  return (
    <div className="absolute inset-x-4 text-lg bottom-0 pt-4 border-t border-gray-300 mb-4 flex flex-col gap-4">
      <button className="flex gap-4 items-center hover:bg-gray-50 hover:rounded-2xl hover:outline hover:outline-4 hover:outline-gray-50">
        <img src="./src/assets/SVG/plus.svg" className="w-6" alt="" />
        New Song
      </button>
      <button className="flex gap-4 items-center hover:bg-gray-50 hover:rounded-2xl hover:outline hover:outline-4 hover:outline-gray-50">
        <img src="./src/assets/SVG/settings.svg" className="w-6" alt="" />
        Preferences
      </button>
      <button className="flex gap-4 items-center hover:bg-gray-50 hover:rounded-2xl hover:outline hover:outline-4 hover:outline-gray-50">
        <img src="./src/assets/SVG/info.svg" className="w-6" alt="" />
        About
      </button>
    </div>
  );
}
