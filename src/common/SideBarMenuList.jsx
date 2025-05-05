import {  FiUser } from "react-icons/fi";


const SideBarMenuList = [
    {
        parent: "CMS",
        id: 1,
        icon: <FiUser />,
        children: [
            { name: "Blog", id: 1, feature: "blog", link: "/blog" },
            // { name: "Sample Grid", id: , feature: "samplegrid", link: "/sample/grid" },
        ],
    },

    {
        parent: "SEO",
        id: 1,
        icon: <FiUser />,
        children: [
            { name: "Blog", id: 1, feature: "blog", link: "/blog" },
            // { name: "Sample Grid", id: , feature: "samplegrid", link: "/sample/grid" },
        ],
    },


    // {
    //     parent: "Sample Page",
    //     icon: <FiMessageCircle />,
    //     link: "/sample",
    //     id: 2,
    // },

];

export default SideBarMenuList;
