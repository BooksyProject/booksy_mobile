// import { downloadBook } from "@/lib/service/book.service";
// import React, { useState } from "react";
// import { View, Button, Alert, Text } from "react-native";
// import * as FileSystem from "expo-file-system";
// // import Pdf from "react-native-pdf"; // Cài đặt thư viện react-native-pdf

// const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

// const PdfViewer = (id: string) => {
//   const [fileUri, setFileUri] = useState<string | null>(null); // Trạng thái để lưu fileUri
//   const [loading, setLoading] = useState(false); // Trạng thái để quản lý quá trình tải

//   // Hàm tải và hiển thị file PDF
//   const downloadBook = async (bookId: string) => {
//     try {
//       setLoading(true); // Đặt trạng thái loading = true khi bắt đầu tải
//       // Giả sử bạn đã có hàm download file và nhận được fileUri từ server
//       const response = await fetch(
//         `${BASE_URL}/book/downloadBook?bookId=${bookId}`
//       );

//       if (!response.ok) {
//         throw new Error("Failed to download book");
//       }

//       const arrayBuffer = await response.arrayBuffer();
//       const base64String = arrayBufferToBase64(arrayBuffer);
//       const fileUri = FileSystem.documentDirectory + "downloadedBook.pdf";

//       // Sau khi tải về, đặt trạng thái với fileUri
//       setFileUri(fileUri);
//       Alert.alert(
//         "Download Complete",
//         "The book has been downloaded successfully!"
//       );
//     } catch (error) {
//       console.error("Download error:", error);
//       Alert.alert("Error", "Failed to download the book");
//     } finally {
//       setLoading(false); // Đặt lại trạng thái loading khi hoàn tất hoặc lỗi
//     }
//   };

//   // Helper function to convert ArrayBuffer to Base64 string
//   const arrayBufferToBase64 = (buffer: ArrayBuffer) => {
//     let binary = "";
//     const bytes = new Uint8Array(buffer);
//     for (let i = 0; i < bytes.length; i++) {
//       binary += String.fromCharCode(bytes[i]);
//     }
//     return window.btoa(binary); // Dùng btoa để mã hóa thành Base64
//   };

//   return (
//     <View style={{ flex: 1 }}>
//       <Button
//         title="Download Book"
//         onPress={() => downloadBook(id)}
//         disabled={loading}
//       />

//       {/* Hiển thị file PDF khi fileUri có giá trị */}
//       {fileUri ? (
//         <Pdf
//           source={{ uri: fileUri, cache: true }}
//           onLoadComplete={(numberOfPages, filePath) => {
//             console.log(`Loaded PDF with ${numberOfPages} pages.`);
//           }}
//           onError={(error) => {
//             console.log("PDF load error", error);
//           }}
//         />
//       ) : (
//         <View>{loading ? <Text>Loading...</Text> : null}</View>
//       )}
//     </View>
//   );
// };

// export default PdfViewer;
