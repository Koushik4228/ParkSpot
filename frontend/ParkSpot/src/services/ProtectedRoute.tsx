import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { UserRole } from "../Components/Accounts/Service/Role"; // Adjust path as needed
 
interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}
 
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, children }) => {
  const userRole = useSelector((state: any) => state.user.role);
 
  if (!allowedRoles.includes(userRole)) {
    return <p>You don’t have permission to view this page.</p>;
  }
 
  return <>{children || <Outlet />}</>;
};
 
export default ProtectedRoute;

