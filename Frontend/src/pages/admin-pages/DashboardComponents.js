// // DashboardComponents.js
// import React from "react";
// import { FiArrowRight } from "react-icons/fi";

// export const Card = ({ title, children, action }) => {
//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
//         {action && (
//           <button className="text-sm text-blue-600 hover:text-blue-800 flex items-center">
//             {action} <FiArrowRight className="ml-1" />
//           </button>
//         )}
//       </div>
//       {children}
//     </div>
//   );
// };

// export const StatCard = ({ label, value, change, icon, color, loading }) => {
//   const colorClasses = {
//     blue: "bg-blue-50 text-blue-600",
//     green: "bg-green-50 text-green-600",
//     purple: "bg-purple-50 text-purple-600",
//     orange: "bg-orange-50 text-orange-600",
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
//       <div className="flex justify-between">
//         <div className={`p-3 rounded-lg ${colorClasses[color]} mb-4`}>
//           {icon}
//         </div>
//         <span
//           className={`text-xs font-medium px-2 py-1 rounded-full ${
//             change.includes("+")
//               ? "bg-green-50 text-green-600"
//               : "bg-gray-100 text-gray-600"
//           }`}
//         >
//           {change}
//         </span>
//       </div>
//       <h3 className="text-sm font-medium text-gray-500 mb-1">{label}</h3>
//       {loading ? (
//         <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
//       ) : (
//         <p className="text-2xl font-bold text-gray-800">{value}</p>
//       )}
//     </div>
//   );
// };

// export const DataTable = ({ columns, data, loading, emptyMessage }) => {
//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             {columns.map((column, index) => (
//               <th
//                 key={index}
//                 scope="col"
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//               >
//                 {column.header}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {loading ? (
//             <tr>
//               <td colSpan={columns.length} className="px-6 py-4 text-center">
//                 <div className="flex justify-center">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-400"></div>
//                 </div>
//               </td>
//             </tr>
//           ) : data.length === 0 ? (
//             <tr>
//               <td
//                 colSpan={columns.length}
//                 className="px-6 py-4 text-center text-gray-500"
//               >
//                 {emptyMessage}
//               </td>
//             </tr>
//           ) : (
//             data.map((row, rowIndex) => (
//               <tr key={rowIndex}>
//                 {columns.map((column, colIndex) => (
//                   <td
//                     key={colIndex}
//                     className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
//                   >
//                     {row[column.accessor]}
//                   </td>
//                 ))}
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// };
