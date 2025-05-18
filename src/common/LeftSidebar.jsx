import React, { useEffect, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { FiChevronRight, FiPlus, FiMinus } from "react-icons/fi";
import { RxDashboard } from "react-icons/rx";
import { FiUser } from "react-icons/fi";
import { useCustomQuery } from "../utils/QueryHooks";
import { buildQueryString } from "../utils/BuildQuery";
import CategoryServices from "../services/CategoryServices";
import Swal from "sweetalert2";
import useCustomContext from "../contexts/Context";

const LeftSidebar = ({ toggleMenu }) => {
  const location = useLocation();
  const [activeParent, setActiveParent] = useState(null);
  const [menuList, setMenuList] = useState([]);
  const [openSubMenus, setOpenSubMenus] = useState({}); // Track open submenus by ID
  const { userPermission, adminId } = useCustomContext()

  console.log(userPermission, "userPermission")

  const {
    data: categoryList,
  } = useCustomQuery({
    queryKey: ['parent-category-list'],
    service: CategoryServices.categoryListTree,
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

  const cmsSection = {
    parent: "CMS",
    id: 1,
    icon: <FiUser />,
    children: [
      { name: "Blog", id: 1, rbac: "blog", feature: "blog", link: "/cms/blog" }
    ],

  };
  const staffManagementSection = {
    parent: "Staff Management",
    id: 1,
    icon: <FiUser />,
    children: [
      { name: "Staff", id: 1, rbac: "staff", feature: "staff", link: "/management/staff" },
      // { name: "Sample Grid", id: , feature: "samplegrid", link: "/sample/grid" },
    ],
  };

  useEffect(() => {
    const buildSeoChildren = (categories, parentSlug = "") => {
      return categories.map((cat) => {
        const currentSlugPath = parentSlug ? `${parentSlug}/${cat.slug}` : cat.slug;

        return {
          name: cat.name,
          id: cat.id,
          feature: cat.slug,
          rbac: "seo",
          link: `/seo/${currentSlugPath}`,
          subMenu: cat.subMenu ? buildSeoChildren(cat.subMenu, currentSlugPath) : [],
        };
      });
    };

    const seoSection = {
      parent: "SEO",
      id: 2,
      icon: <FiUser />,
      children: buildSeoChildren(categoryList || []),
    };



    setMenuList([cmsSection, staffManagementSection, seoSection]);
  }, [categoryList]);

  useEffect(() => {
    const buildPermissionMap = () => {
      const map = {};
      userPermission?.forEach((perm) => {
        const moduleName = perm?.permission?.module?.name?.toLowerCase();
        const action = perm?.permission?.action;
        if (moduleName) {
          if (!map[moduleName]) {
            map[moduleName] = [];
          }
          map[moduleName].push(action);
        }
      });
      return map;
    };

    const permissionMap = buildPermissionMap();

    const filterChildrenByPermission = (children) => {
      if (adminId) return children;
      return children.filter((item) => {
        const rbacKey = item.rbac?.toLowerCase();
        return permissionMap[rbacKey] && permissionMap[rbacKey].length > 0;
      });
    };

    const cmsSection = {
      parent: "CMS",
      id: 1,
      icon: <FiUser />,
      children: filterChildrenByPermission([
        { name: "Blog", id: 1, rbac: "blog", feature: "blog", link: "/cms/blog" }
      ]),
    };

    const staffManagementSection = {
      parent: "Staff Management",
      id: 2,
      icon: <FiUser />,
      children: filterChildrenByPermission([
        { name: "Staff", id: 1, rbac: "staff", feature: "staff", link: "/management/staff" },
      ]),
    };

    const buildSeoChildren = (categories, parentSlug = "") => {
      if (adminId || permissionMap["seo"]) {
        return categories.map((cat) => {
          const currentSlugPath = parentSlug ? `${parentSlug}/${cat.slug}` : cat.slug;

          return {
            name: cat.name,
            id: cat.id,
            feature: cat.slug,
            rbac: "seo",
            link: `/seo/${currentSlugPath}`,
            subMenu: cat.subMenu ? buildSeoChildren(cat.subMenu, currentSlugPath) : [],
          };
        });
      }
      return [];
    };

    const seoSection = {
      parent: "SEO",
      id: 3,
      icon: <FiUser />,
      children: buildSeoChildren(categoryList || []),
    };

    const updatedMenuList = [cmsSection, staffManagementSection, seoSection].filter(
      (section) => section.children?.length
    );

    setMenuList(updatedMenuList);
  }, [categoryList, userPermission]);

  const handleParentClick = (parent) => {
    setActiveParent((prev) => (prev === parent ? null : parent));
  };

  const toggleSubMenu = (id) => {
    setOpenSubMenus((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const renderChildren = (items, depth = 0) => {
    return items.map((item) => {
      const hasSubMenu = item.subMenu?.length > 0;
      const isSubMenuOpen = openSubMenus[item.id] || false;

      const link = item.link || `/seo/${item.slug || item.feature}`;

      return (
        <li className="nav-item" key={item.id}>
          <div className="d-flex justify-content-between align-items-center">
            <NavLink
              className="nav-link flex-grow-1"
              to={link}
              style={({ isActive }) => ({
                color: isActive ? "#F8615E" : "#000",
              })}
            >
              {item.name}
            </NavLink>

            {/* Toggle icon if submenu exists */}
            {hasSubMenu && (
              <span
                className="toggle-submenu"
                onClick={() => toggleSubMenu(item.id)}
                style={{ cursor: "pointer", paddingRight: "10px" }}
              >
                {isSubMenuOpen ? <FiMinus /> : <FiPlus />}
              </span>
            )}
          </div>

          {/* Recursive rendering of nested submenus */}
          {hasSubMenu && isSubMenuOpen && (
            <ul className="nav flex-column sub-menu ms-3">
              {renderChildren(item.subMenu, depth + 1)}
            </ul>
          )}
        </li>
      );
    });
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

        {menuList.map((section) => {
          const isParentActive =
            activeParent === section.parent ||
            section.children?.some((child) =>
              location.pathname.toLowerCase().startsWith(child.link.toLowerCase())
            );

          return (
            <li className="nav-item" key={section.parent}>
              <a
                className="nav-link"
                data-bs-toggle="collapse"
                href={`#${section.parent.replace(/\s+/g, "-")}`}
                aria-expanded={isParentActive}
                aria-controls={section.parent.replace(/\s+/g, "-")}
                onClick={() => handleParentClick(section.parent)}
              >
                <span className="menu-icon">{section.icon}</span>
                <span className="menu-title">{section.parent}</span>
                <i className="menu-arrow">
                  <FiChevronRight />
                </i>
              </a>
              <div
                className={`collapse ${isParentActive ? "show" : ""}`}
                id={section.parent.replace(/\s+/g, "-")}
              >
                <ul className="nav flex-column sub-menu">
                  {renderChildren(section.children, 0)}
                </ul>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LeftSidebar;
