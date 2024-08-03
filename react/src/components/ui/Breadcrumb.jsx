/* eslint-disable react/prop-types */
import { Breadcrumb as FBBreadcrumb } from "flowbite-react";
import { Link } from "react-router-dom";

const Breadcrumb = ({ breadcrumbs }) => {
  return (
    <>
      {breadcrumbs.map((breadcrumb, index) => (
        <FBBreadcrumb
          key={index}
          aria-label="Solid background breadcrumb example"
          className="bg-gray-50 px-5 py-3 dark:bg-gray-800"
        >
          {breadcrumb.items.map((item, itemIndex) => (
            <FBBreadcrumb.Item key={itemIndex} icon={() => item.icon ?? <></>}>
              <Link to={item.to ?? "#"}>{item.text}</Link>
            </FBBreadcrumb.Item>
          ))}
        </FBBreadcrumb>
      ))}
    </>
  );
};

export { Breadcrumb };
