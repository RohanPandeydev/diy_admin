import React from "react";
import LeftSidebar from "../common/LeftSidebar";
import Wrapper from "../layouts/Wrapper";
import MenuTree from "../component/tree/MenuTree";
import { useCustomQuery } from "../utils/QueryHooks";
import { buildQueryString } from "../utils/BuildQuery";
import CategoryServices from "../services/CategoryServices";
import Loader from "../utils/Loader/Loader";

const Dashboard = () => {
  // Fetch root-level SEO categories
  const {
    data: categoryList,
    isLoading: isCategoryLoad,
  } = useCustomQuery({
    queryKey: ['parent-category-list-tree'],
    service: CategoryServices.categoryListTree,
    params: buildQueryString([
      { key: "page", value: 1 },
      { key: "limit", value: 10 },
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

  return (
    <Wrapper>
      {isCategoryLoad?<Loader/>:<MenuTree data={categoryList}/>}
    </Wrapper>
  );
};

export default Dashboard;
