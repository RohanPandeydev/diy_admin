import React from "react";
import LeftSidebar from "../common/LeftSidebar";
import Wrapper from "../layouts/Wrapper";
import MenuTree from "../component/tree/MenuTree";
import { useCustomQuery } from "../utils/QueryHooks";
import { buildQueryString } from "../utils/BuildQuery";
import CategoryServices from "../services/CategoryServices";
import Loader from "../utils/Loader/Loader";
import NoDataFound from "../utils/NoDataFound";
import { MdArrowBackIos } from "react-icons/md";
import { Button } from "reactstrap";
import { useNavigate } from "react-router-dom";

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

   const nav = useNavigate()
  
  
    const handleBack = () => {
      nav(-1)
    }

  return (
    <Wrapper>
      <div className="admin-heading-header">
        <Button className="back-button" type="click" onClick={handleBack}>
          <MdArrowBackIos />Back</Button>
        <h1>Dashboard</h1>
      </div>
      {isCategoryLoad ? <Loader /> : categoryList?.length == 0 ? <NoDataFound msg={"No Tree Found"} /> : <MenuTree isCategoryLoad={isCategoryLoad} data={categoryList} />}
    </Wrapper>
  );
};

export default Dashboard;
