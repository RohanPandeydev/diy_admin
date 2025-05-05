import React, { useEffect, useState, useMemo } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FiChevronRight } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { FiUser } from "react-icons/fi";
import { useCustomQuery } from "../utils/QueryHooks";
import { buildQueryString } from "../utils/BuildQuery";
import CategoryServices from "../services/CategoryServices";
import Swal from "sweetalert2";

const LeftSidebar = ({ toggleMenu }) => {
  const location = useLocation();
  const [activeParent, setActiveParent] = useState(null);
  const [menuList, setMenuList] = useState([]);

  // Fetch root-level SEO categories
  const {
    data: categoryList,
    isLoading: isCategoryLoad,
  } = useCustomQuery({
    queryKey: ['parent-category-list'],
    service: CategoryServices.categoryList,
    params: buildQueryString([
      { key: "page", value: 1 },
      { key: "limit", value: 10 },
      { key: "parent_null", value: true }
    ]),
    select: (data) => {
      if (!data?.data?.status) {
        Swal.fire({
          title: "Error",
          text: data?.data?.message,
          icon: "error",
        });
        return [];
      }
      return data?.data?.data || [];
    },
    errorMsg: "",
  });

  // Static CMS section
  const cmsSection = {
    parent: "CMS",
    id: 1,
    icon: <FiUser />,
    children: [
      { name: "Blog", id: 1, feature: "cms-blog", link: "/cms/blog" }
    ],
  };

  useEffect(() => {
    // Build menu list once categories are loaded
    const seoSection = {
      parent: "SEO",
      id: 2,
      icon: <FiUser />,
      children: (categoryList || []).map((cat) => ({
        name: cat.name,
        id: cat.id,
        feature: "seo-category",
        link: `/seo/${cat.slug || 'home'}`
      })),
    };

    setMenuList([cmsSection, seoSection]);
  }, [categoryList]);

  // Set active parent on route change
  useEffect(() => {
    menuList?.forEach((item) => {
      if (item.children) {
        item.children.forEach((child) => {
          if (child.link === location.pathname) {
            setActiveParent(item.parent);
          }
        });
      } else if (item.link === location.pathname) {
        setActiveParent(item.parent);
      }
    });
  }, [location.pathname, menuList]);

  const handleParentClick = (parent) => {
    setActiveParent((prev) => (prev === parent ? null : parent));
  };

  return (
    <div className={toggleMenu ? "left-sidebar open" : "left-sidebar"}>
      <ul className="sidebarnav">
        <li className="nav-item">
          <NavLink
            className="nav-link"
            to="/"
            style={({ isActive }) => ({
              backgroundColor: isActive ? "#F8615E" : "",
              color: isActive ? "#fff" : "#000",
            })}
          >
            <span className="menu-icon">
              <RxDashboard />
            </span>{" "}
            Dashboard
          </NavLink>
        </li>

        {menuList.map((item) => {
          const isParentActive =
            activeParent === item.parent ||
            (item.children &&
              item.children.some((child) =>
                location.pathname.toLowerCase().includes(child.link.toLowerCase())
              ));

          return (
            <li className="nav-item" key={item.parent}>
              {item.children ? (
                <>
                  <a
                    className="nav-link"
                    data-bs-toggle="collapse"
                    href={`#${item.parent.replace(/\s+/g, "-")}`}
                    aria-expanded={isParentActive}
                    aria-controls={item.parent.replace(/\s+/g, "-")}
                    onClick={() => handleParentClick(item.parent)}
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-title">{item.parent}</span>
                    <i className="menu-arrow">
                      <FiChevronRight />
                    </i>
                  </a>
                  <div
                    className={`collapse ${isParentActive ? "show" : ""}`}
                    id={item.parent.replace(/\s+/g, "-")}
                  >
                    <ul className="nav flex-column sub-menu">
                      {item.children.map((child) => (
                        <li className="nav-item" key={child.id}>
                          <NavLink
                            className="nav-link"
                            to={child.link}
                            style={({ isActive }) => ({
                              color: isActive ? "#F8615E" : "#000",
                            })}
                          >
                            {child.name}
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <NavLink
                  className="nav-link"
                  to={item.link}
                  style={({ isActive }) => ({
                    backgroundColor: isActive ? "#F8615E" : "",
                    color: isActive ? "#fff" : "#000",
                  })}
                >
                  <span className="menu-icon">{item.icon}</span>
                  <span className="menu-title">{item.parent}</span>
                </NavLink>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LeftSidebar;
