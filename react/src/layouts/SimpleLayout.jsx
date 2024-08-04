/* eslint-disable react/prop-types */
import { DarkThemeToggle, Navbar } from "flowbite-react";

const SimpleLayout = ({
  title,
  children,
}) => {

  return (
    <div className="min-h-screen bg-gray-400 dark:bg-gray-900">
      <Navbar
        className="rounded-b-xl bg-slate-800"
        fluid
      >
        <div className="w-full p-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center">
              <Navbar.Brand className="block">
                <h2>Prueba</h2>
              </Navbar.Brand>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto dark:text-white">
              <DarkThemeToggle className="rounded-xl bg-gray-300 dark:bg-gray-900" />
            </div>
          </div>
        </div>
      </Navbar>
      <>
        {title && (
          <div className="bg-gray-300 px-2 py-4 dark:bg-gray-800">
            <h1 className="text-3xl font-semibold text-black dark:text-white">
              {title}
            </h1>
          </div>
        )}
      </>
      <div className="px-2">{children}</div>
    </div>
  );
};

export default SimpleLayout;
