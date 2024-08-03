/* eslint-disable react/prop-types */
import { Sidebar } from "flowbite-react";
import { SidebarComponent } from "../components/ui/Index";
import { useMediaQuery } from "@/hooks/Index";

const RoaSidebar = ({
  isOpenSidebar,
  items = [],
}) => {
  const sidebarItems = [...items];

  const md = useMediaQuery("(max-width: 768px)");

  return (
    <Sidebar
      aria-label="Sidebar with multi-level dropdown example"
      collapsed={isOpenSidebar}
      collapseBehavior={md ? "hide" : "collapse"}
    >
      <div className="flex flex-col justify-between py-2">
        <div>
          <SidebarComponent sidebarItems={sidebarItems} />
        </div>
      </div>
    </Sidebar>
  );
};

export default RoaSidebar;
