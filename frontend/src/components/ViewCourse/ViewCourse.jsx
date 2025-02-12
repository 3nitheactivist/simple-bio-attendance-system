// // import React, { useEffect, useState } from "react";
// // import { collection, getDocs, where, query, deleteDoc, doc } from "firebase/firestore";
// // import { db, auth } from "../../utils/firebase/firebase";
// // import { clearIndexedDbPersistence } from "firebase/firestore";
// // import "../ViewCourse/ViewCourse.css";
// // import { useNavigate } from "react-router-dom"; // Import useNavigate
// // import {
// //   Table,
// //   TableBody,
// //   TableCell,
// //   TableContainer,
// //   TableHead,
// //   TableRow,
// //   Paper,
// //   CircularProgress,
// //   TablePagination,
// //   Menu,
// //   MenuItem,
// //   IconButton,
// //   Dialog,
// //   DialogActions,
// //   DialogContent,
// //   DialogTitle,
// //   Button,
// // } from "@mui/material";
// // import { MoreVert } from "@mui/icons-material";
// // import Backbtn from "../../utils/Backbutton/backbutton";

// // function ViewCourse() {
// //   const [courses, setCourses] = useState([]);
// //   const [loading, setLoading] = useState(true);
// //   const [alert, setAlert] = useState({ type: "", message: "" });
// //   const [anchorEl, setAnchorEl] = useState(null); // For menu
// //   const [selectedCourse, setSelectedCourse] = useState(null); // Track the selected course for actions

// //   const [openDialog, setOpenDialog] = useState(false); // For the success/error alert dialog
// //   const [dialogMessage, setDialogMessage] = useState(""); // For dialog message

// //   const [openConfirmation, setOpenConfirmation] = useState(false); // For delete confirmation dialog

// //   // Pagination state
// //   const [page, setPage] = useState(0);
// //   const [rowsPerPage, setRowsPerPage] = useState(5);

// //   const navigate = useNavigate(); // Initialize useNavigate

  


// //   useEffect(() => {
// //     const fetchCourses = async () => {
// //       setLoading(true);

// //       try {
// //         const userId = auth.currentUser?.uid;
// //         if (!userId) {
// //           throw new Error("User is not authenticated.");
// //         }

// //         const coursesCollection = collection(db, "courses");
// //         const q = query(coursesCollection, where("userId", "==", userId));
// //         const courseSnapshot = await getDocs(q);

// //         const courseList = courseSnapshot.docs.map((doc) => {
// //           const data = doc.data();
// //           return {
// //             id: doc.id,
// //             ...data,
// //             timeCreated:
// //               data.timeCreated instanceof Object && typeof data.timeCreated.toMillis === "function"
// //                 ? data.timeCreated.toMillis()
// //                 : typeof data.timeCreated === "number"
// //                 ? data.timeCreated
// //                 : new Date(data.timeCreated).getTime() || 0,
// //           };
// //         });

// //         setCourses(courseList);
// //       } catch (error) {
// //         setAlert({
// //           type: "error",
// //           message: "An error occurred while fetching courses. Please try again.",
// //         });
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchCourses();
// //   }, []);

// //   // Handle pagination change
// //   const handleChangePage = (event, newPage) => {
// //     setPage(newPage);
// //   };

// //   const handleChangeRowsPerPage = (event) => {
// //     setRowsPerPage(parseInt(event.target.value, 10));
// //     setPage(0);
// //   };

// //   // Handle menu actions
// //   const handleMenuOpen = (event, course) => {
// //     setAnchorEl(event.currentTarget);
// //     setSelectedCourse(course);
// //   };

// //   const handleMenuClose = () => {
// //     setAnchorEl(null);
// //     setSelectedCourse(null);
// //   };

// //   const handleDeleteConfirmation = (course) => {
// //     setSelectedCourse(course); // Set the course to be deleted
// //     setOpenConfirmation(true); // Open the confirmation dialog
// //   };

// //   const handleCancelDelete = () => {
// //     setOpenConfirmation(false);
// //     setSelectedCourse(null);
// //   };

  

  

// //   const handleConfirmDelete = async () => {
// //     try {
// //       if (!selectedCourse) {
// //         console.error("No course selected for deletion.");
// //         return;
// //       }
  
// //       // Reference to the course document in Firestore
// //       const courseDocRef = doc(db, "course", selectedCourse.id);
  
// //       // Deleting the course document
// //       await deleteDoc(courseDocRef);
// //       console.log("Course deleted successfully");
  
// //       // Remove the deleted course from the local state
// //       setCourses((prevCourses) =>
// //         prevCourses.filter((course) => course.id !== selectedCourse.id)
// //       );
  
// //       // Close the menu and confirmation dialog
// //       handleMenuClose(); // Explicitly close the Menu
// //       setOpenConfirmation(false);
  
// //       // Show success dialog
// //       setDialogMessage("Course deleted successfully.");
// //       setOpenDialog(true);
// //     } catch (error) {
// //       console.error("Error deleting course:", error);
// //       setDialogMessage("An error occurred while deleting the course. Please try again.");
// //       setOpenDialog(true);
// //     }
// //   };
  

// //   const handleCloseDialog = () => {
// //     setOpenDialog(false);
// //   };

// //   const handleRegisterStudent = () => {
// //     console.log("Register student for course:", selectedCourse);
// //     if (!selectedCourse) return;

// //     // Navigate to Register Student page with selected course ID
// //     navigate(`/registerStudent?courseId=${selectedCourse.id}&courseTitle=${selectedCourse.courseTitle}`);
  
// //     handleMenuClose();
// //   };

// //   const handleViewEnrolledStudents = () => {
// //     if (!selectedCourse) return;
// //     navigate(`/viewStudent?courseId=${selectedCourse.id}&courseTitle=${selectedCourse.courseTitle}`);
// //     handleMenuClose();
// //   };
  

// //   // const handleTakeAttendance = () => {
// //   //   console.log("Take attendance for course:", selectedCourse);
  
// //   //     if (!selectedCourse) {
// //   //       console.error("No course selected");
// //   //       return;
// //   //     }
// //   //     navigate(`/takeAttendance?courseId=${selectedCourse}`);
 
// //   // };

// //   const handleTakeAttendance = () => {
// //     console.log("Take attendance for course:", selectedCourse);
    
// //     if (!selectedCourse) {
// //       console.error("No course selected");
// //       return;
// //     }
// //     // Pass just the course ID instead of the entire course object
// //     navigate(`/takeAttendance?courseId=${selectedCourse.id}`);
// //   };

// //   return (
// //     <div className="container-2">
// //       <div className="head">
// //         <div className="head-text">
// //           <Backbtn />
// //           <p>
// //             {new Date().toLocaleDateString("en-GB", {
// //               day: "numeric",
// //               month: "long",
// //               year: "numeric",
// //             })}
// //           </p>
// //           <h1>Hello, {auth.currentUser.displayName}.👋</h1>
// //           <span style={{ color: "white", fontSize: "15px", }} >
// //             Kindly, View your registered course below. <br />
// //             Click on the action button to view the course functions.
// //           </span>
// //         </div>
// //       </div>

// //       <div className="vc-table-container">
// //         {loading ? (
// //           <div style={{ textAlign: "center", padding: "20px" }}>
// //             <CircularProgress />
// //           </div>
// //         ) : courses.length > 0 ? (
// //           <Paper className="vc-table">
// //             <div className="table-scrollable">
// //               <Table>
// //                 <TableHead>
// //                   <TableRow>
// //                     <TableCell>Course Title</TableCell>
// //                     <TableCell>Course Code</TableCell>
// //                     <TableCell>Class Level</TableCell>
// //                     <TableCell>Time Created</TableCell>
// //                     <TableCell>Actions</TableCell>
// //                   </TableRow>
// //                 </TableHead>
// //                 <TableBody>
// //                   {courses
// //                     .sort((a, b) => b.timeCreated - a.timeCreated)
// //                     .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
// //                     .map((course) => (
// //                       <TableRow key={course.id}>
// //                         <TableCell>{course.courseTitle}</TableCell>
// //                         <TableCell>{course.courseCode}</TableCell>
// //                         <TableCell>{course.classLevel}</TableCell>
// //                         <TableCell>
// //                           {course.timeCreated
// //                             ? new Date(course.timeCreated).toLocaleString()
// //                             : "Not available"}
// //                         </TableCell>
// //                         <TableCell>
// //                           <IconButton
// //                             onClick={(event) => handleMenuOpen(event, course)}
// //                           >
// //                             <MoreVert />
// //                           </IconButton>
// //                         </TableCell>
// //                       </TableRow>
// //                     ))}
// //                 </TableBody>
// //               </Table>
// //             </div>
// //             <TablePagination
// //               rowsPerPageOptions={[5, 10, 25]}
// //               component="div"
// //               count={courses.length}
// //               rowsPerPage={rowsPerPage}
// //               page={page}
// //               onPageChange={handleChangePage}
// //               onRowsPerPageChange={handleChangeRowsPerPage}
// //             />
// //           </Paper>
// //         ) : (
// //           <p style={{ textAlign: "center", padding: "20px" }}>
// //             No courses available.
// //           </p>
// //         )}
// //       </div>

// //       {/* Menu for actions */}
// //       <Menu
// //         anchorEl={anchorEl}
// //         open={Boolean(anchorEl)}
// //         onClose={handleMenuClose}
// //       >
// //         <MenuItem onClick={handleRegisterStudent}>Register Student</MenuItem>
// //         <MenuItem onClick={handleTakeAttendance}>Take Attendance</MenuItem>
// //         <MenuItem onClick={handleViewEnrolledStudents}>View Enrolled Students</MenuItem>
// //         <MenuItem
// //           onClick={() => handleDeleteConfirmation(selectedCourse)}
// //           style={{ color: "red" }}
// //         >
// //           Delete Course
// //         </MenuItem>
// //       </Menu>

// //       {/* Confirmation Dialog */}
// //       <Dialog open={openConfirmation} onClose={handleCancelDelete}>
// //         <DialogTitle>Confirm Deletion</DialogTitle>
// //         <DialogContent>
// //           <p>Are you sure you want to delete the course "{selectedCourse?.courseTitle}"?</p>
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={handleCancelDelete} style={{color: "blue"}}>
// //             Cancel
// //           </Button>
// //           <Button onClick={handleConfirmDelete} style={{color: "red"}}>
// //             Confirm
// //           </Button>
// //         </DialogActions>
// //       </Dialog>

// //       {/* Success/Error Alert Dialog */}
// //       <Dialog open={openDialog} onClose={handleCloseDialog}>
// //         <DialogTitle>{alert.type === "success" ? "Success" : "Success!"}</DialogTitle>
// //         <DialogContent>
// //           <p>{dialogMessage}</p>
// //         </DialogContent>
// //         <DialogActions>
// //           <Button onClick={handleCloseDialog} color="primary">
// //             Close
// //           </Button>
// //         </DialogActions>
// //       </Dialog>
// //     </div>
// //   );
// // }

// // export default ViewCourse;


// import React, { useEffect, useState } from "react";
// import { collection, getDocs, where, query, deleteDoc, doc } from "firebase/firestore";
// import { db, auth } from "../../utils/firebase/firebase";
// import "../ViewCourse/ViewCourse.css";
// import { useNavigate } from "react-router-dom";

// // Ant Design components and icons
// import { Table, Dropdown, Menu, Button, Modal, message } from "antd";
// import { MoreOutlined } from "@ant-design/icons";
// import Backbtn from "../../utils/Backbutton/backbutton";
// import "antd/dist/reset.css";

// function ViewCourse() {
//   const [courses, setCourses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [selectedCourse, setSelectedCourse] = useState(null); // For actions
//   const [deleteModalVisible, setDeleteModalVisible] = useState(false);
//   const navigate = useNavigate();

//   // Fetch courses for the current user
//   useEffect(() => {
//     const fetchCourses = async () => {
//       setLoading(true);
//       try {
//         const userId = auth.currentUser?.uid;
//         if (!userId) throw new Error("User is not authenticated.");
//         const coursesCollection = collection(db, "courses");
//         const q = query(coursesCollection, where("userId", "==", userId));
//         const courseSnapshot = await getDocs(q);
//         const courseList = courseSnapshot.docs.map((doc) => {
//           const data = doc.data();
//           return {
//             id: doc.id,
//             ...data,
//             timeCreated:
//               data.timeCreated instanceof Object &&
//               typeof data.timeCreated.toMillis === "function"
//                 ? data.timeCreated.toMillis()
//                 : typeof data.timeCreated === "number"
//                 ? data.timeCreated
//                 : new Date(data.timeCreated).getTime() || 0,
//           };
//         });
//         setCourses(courseList);
//       } catch (error) {
//         console.error(error);
//         message.error("An error occurred while fetching courses. Please try again.");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchCourses();
//   }, []);

//   // Handle action menu clicks
//   const handleMenuClick = ({ key }, course) => {
//     if (key === "register") {
//       navigate(`/registerStudent?courseId=${course.id}&courseTitle=${course.courseTitle}`);
//     } else if (key === "attendance") {
//       navigate(`/takeAttendance?courseId=${course.id}`);
//     } else if (key === "view") {
//       navigate(`/viewStudent?courseId=${course.id}&courseTitle=${course.courseTitle}`);
//     } else if (key === "delete") {
//       setSelectedCourse(course);
//       setDeleteModalVisible(true);
//     }
//   };

//   // Create the actions menu for each course
//   const menu = (course) => (
//     <Menu onClick={(info) => handleMenuClick(info, course)}>
//       <Menu.Item key="register">Register Student</Menu.Item>
//       <Menu.Item key="attendance">Take Attendance</Menu.Item>
//       <Menu.Item key="view">View Enrolled Students</Menu.Item>
//       <Menu.Item key="delete" style={{ color: "red" }}>
//         Delete Course
//       </Menu.Item>
//     </Menu>
//   );

//   // Handle course deletion
//   const handleDeleteCourse = async () => {
//     try {
//       if (!selectedCourse) return;
//       const courseDocRef = doc(db, "courses", selectedCourse.id);
//       await deleteDoc(courseDocRef);
//       setCourses(courses.filter((course) => course.id !== selectedCourse.id));
//       message.success("Course deleted successfully.");
//       setDeleteModalVisible(false);
//     } catch (error) {
//       console.error("Error deleting course:", error);
//       message.error("Failed to delete course. Please try again.");
//     }
//   };

//   // Define columns for the Ant Design table
//   const columns = [
//     {
//       title: "Course Title",
//       dataIndex: "courseTitle",
//       key: "courseTitle",
//     },
//     {
//       title: "Course Code",
//       dataIndex: "courseCode",
//       key: "courseCode",
//     },
//     {
//       title: "Class Level",
//       dataIndex: "classLevel",
//       key: "classLevel",
//     },
//     {
//       title: "Time Created",
//       dataIndex: "timeCreated",
//       key: "timeCreated",
//       render: (time) => (time ? new Date(time).toLocaleString() : "Not available"),
//       sorter: (a, b) => a.timeCreated - b.timeCreated,
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_, record) => (
//         <Dropdown overlay={menu(record)} trigger={["click"]}>
//           <Button icon={<MoreOutlined />} />
//         </Dropdown>
//       ),
//     },
//   ];

//   return (
//     <div className="container-2">
//       <div className="head">
//         <div className="head-text">
//           <Backbtn />
//           <p>
//             {new Date().toLocaleDateString("en-GB", {
//               day: "numeric",
//               month: "long",
//               year: "numeric",
//             })}
//           </p>
//           <h1>Hello, {auth.currentUser?.displayName}.👋</h1>
//           <span style={{ color: "white", fontSize: "15px" }}>
//             Kindly, view your registered courses below. <br />
//             Click on the action button to view the course functions.
//           </span>
//         </div>
//       </div>

//       <div className="vc-table-container">
//         {loading ? (
//           <div style={{ textAlign: "center", padding: "20px" }}>
//             <CircularProgress />
//           </div>
//         ) : courses.length > 0 ? (
//           <Table
//             dataSource={courses.sort((a, b) => b.timeCreated - a.timeCreated)}
//             columns={columns}
//             rowKey="id"
//             pagination={{ pageSize: 5 }}
//           />
//         ) : (
//           <p style={{ textAlign: "center", padding: "20px" }}>No courses available.</p>
//         )}
//       </div>

//       <Modal
//         title="Confirm Deletion"
//         visible={deleteModalVisible}
//         onOk={handleDeleteCourse}
//         onCancel={() => setDeleteModalVisible(false)}
//         okText="Confirm"
//         cancelText="Cancel"
//       >
//         <p>
//           Are you sure you want to delete the course "{selectedCourse?.courseTitle}"?
//         </p>
//       </Modal>
//     </div>
//   );
// }

// export default ViewCourse;

import React, { useEffect, useState } from "react";
import { collection, getDocs, where, query, deleteDoc, doc } from "firebase/firestore";
import { db, auth } from "../../utils/firebase/firebase";
import "../ViewCourse/ViewCourse.css";
import { useNavigate } from "react-router-dom";

// Ant Design components and icons
import { Table, Dropdown, Menu, Button, Modal, Spin, message } from "antd";
import { MoreOutlined } from "@ant-design/icons";
import Backbtn from "../../utils/Backbutton/backbutton";

function ViewCourse() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const navigate = useNavigate();

  // Fetch courses for the current user
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const userId = auth.currentUser?.uid;
        if (!userId) throw new Error("User is not authenticated.");
        const coursesCollection = collection(db, "courses");
        const q = query(coursesCollection, where("userId", "==", userId));
        const courseSnapshot = await getDocs(q);
        const courseList = courseSnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            timeCreated:
              data.timeCreated instanceof Object &&
              typeof data.timeCreated.toMillis === "function"
                ? data.timeCreated.toMillis()
                : typeof data.timeCreated === "number"
                ? data.timeCreated
                : new Date(data.timeCreated).getTime() || 0,
          };
        });
        setCourses(courseList);
      } catch (error) {
        console.error(error);
        message.error("An error occurred while fetching courses. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  // Define the menu for course actions
  const handleMenuClick = ({ key }, course) => {
    if (key === "takeAttendance") {
      navigate(`/takeAttendance?courseId=${course.id}`);
    } else if (key === "viewAttendance") {
      navigate(`/viewAttendance?courseId=${course.id}`);
    } else if (key === "delete") {
      setSelectedCourse(course);
      setDeleteModalVisible(true);
    }
  };

  const menu = (course) => (
    <Menu onClick={(info) => handleMenuClick(info, course)}>
      <Menu.Item key="takeAttendance">Take Attendance</Menu.Item>
      <Menu.Item key="viewAttendance">View Attendance</Menu.Item>
      <Menu.Item key="delete" style={{ color: "red" }}>
        Delete Course
      </Menu.Item>
    </Menu>
  );

  // Handle course deletion
  const handleDeleteCourse = async () => {
    try {
      if (!selectedCourse) return;
      const courseDocRef = doc(db, "courses", selectedCourse.id);
      await deleteDoc(courseDocRef);
      setCourses(courses.filter((course) => course.id !== selectedCourse.id));
      message.success("Course deleted successfully.");
      setDeleteModalVisible(false);
    } catch (error) {
      console.error("Error deleting course:", error);
      message.error("Failed to delete course. Please try again.");
    }
  };

  // Define columns for Ant Design Table
  const columns = [
    {
      title: "Course Title",
      dataIndex: "courseTitle",
      key: "courseTitle",
    },
    {
      title: "Course Code",
      dataIndex: "courseCode",
      key: "courseCode",
    },
    {
      title: "Class Level",
      dataIndex: "classLevel",
      key: "classLevel",
    },
    {
      title: "Time Created",
      dataIndex: "timeCreated",
      key: "timeCreated",
      render: (time) => (time ? new Date(time).toLocaleString() : "Not available"),
      sorter: (a, b) => a.timeCreated - b.timeCreated,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Dropdown overlay={menu(record)} trigger={["click"]}>
          <Button icon={<MoreOutlined />} />
        </Dropdown>
      ),
    },
  ];

  return (
    <div className="container-2">
      <div className="head">
        <div className="head-text">
          <Backbtn />
          <p>
            {new Date().toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          <h1>Hello, {auth.currentUser?.displayName}.👋</h1>
          <span style={{ color: "white", fontSize: "15px" }}>
            Kindly, view your registered courses below. <br />
            Click on the action button to access course functions.
          </span>
        </div>
      </div>

      <div className="vc-table-container">
        {loading ? (
          <div style={{ textAlign: "center", padding: "20px" }}>
            <Spin />
          </div>
        ) : courses.length > 0 ? (
          <Table
            dataSource={courses.sort((a, b) => b.timeCreated - a.timeCreated)}
            columns={columns}
            rowKey="id"
            pagination={{ pageSize: 5 }}
          />
        ) : (
          <p style={{ textAlign: "center", padding: "20px" }}>
            No courses available.
          </p>
        )}
      </div>

      <Modal
        title="Confirm Deletion"
        visible={deleteModalVisible}
        onOk={handleDeleteCourse}
        onCancel={() => setDeleteModalVisible(false)}
        okText="Confirm"
        cancelText="Cancel"
      >
        <p>
          Are you sure you want to delete the course "{selectedCourse?.courseTitle}"?
        </p>
      </Modal>
    </div>
  );
}

export default ViewCourse;
