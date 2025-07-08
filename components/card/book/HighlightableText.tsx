// import { useReaderSettings } from "@/contexts/ReaderSettingContext";
// import { useRef, useState } from "react";
// import { NativeSyntheticEvent, Text, TextLayoutEventData, ViewStyle, TextStyle } from "react-native";
// import { SelectableText } from "./SelectableText";

// interface Bookmark {
//   index: number;
//   start: number;
//   end: number;
//   note?: string;
// }

// interface SelectedRange {
//   index: number;
//   start: number;
//   end: number;
//   text: string;
// }

// interface HighlightableTextProps {
//   html: string;
//   index: number;
//   bookmarks: Array<{
//     index: number;
//     start: number;
//     end: number;
//   }>;
//   setSelectedRange: (range: {
//     index: number;
//     start: number;
//     end: number;
//     text: string;
//   } | null) => void;
//   themeStyles: {
//     content: string;
//   };
//   getCurrentFontFamily: () => string;
// }

// const HighlightableText = ({
//   html,
//   index,
//   bookmarks,
//   setSelectedRange,
//   themeStyles,
//   getCurrentFontFamily,
//   settings
// }: {
//   html: string;
//   index: number;
//   bookmarks: Bookmark[];
//   setSelectedRange: (range: SelectedRange | null) => void;
//   themeStyles: any;
//   getCurrentFontFamily: () => string;
//   settings: any;
// }) => {
//   const renderHighlightedText = () => {
//     const plainText = html.replace(/<[^>]*>/g, ''); // Remove HTML tags
//     const segments: {text: string, highlighted: boolean}[] = [];
//     let currentSegment = {
//       text: '',
//       highlighted: false
//     };

//     // Initialize all as not highlighted
//     for (let i = 0; i < plainText.length; i++) {
//       const shouldHighlight = bookmarks.some(
//         b => b.index === index && i >= b.start && i < b.end
//       );

//       if (shouldHighlight !== currentSegment.highlighted) {
//         if (currentSegment.text) {
//           segments.push(currentSegment);
//         }
//         currentSegment = {
//           text: plainText[i],
//           highlighted: shouldHighlight
//         };
//       } else {
//         currentSegment.text += plainText[i];
//       }
//     }

//     if (currentSegment.text) {
//       segments.push(currentSegment);
//     }

//     return segments.map((segment, i) => (
//       <Text
//         key={i}
//         style={{
//           backgroundColor: segment.highlighted ? "#e1cf2c" : "transparent",
//           fontSize: settings.fontSize,
//           color: themeStyles.content,
//           fontFamily: getCurrentFontFamily(),
//         }}
//       >
//         {segment.text}
//       </Text>
//     ));
//   };

//   return (
//     <SelectableText
//       text={html.replace(/<[^>]*>/g, '')}
//       onSelection={(selection) => {
//         setSelectedRange({
//           index,
//           start: selection.start,
//           end: selection.end,
//           text: html.replace(/<[^>]*>/g, '').substring(selection.start, selection.end)
//         });
//       }}
//     >
//       {renderHighlightedText()}
//     </SelectableText>
//   );
// };

// export default HighlightableText;
