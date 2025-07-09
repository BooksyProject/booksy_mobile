// import React, { useState, useRef } from "react";
// import {
//   Text,
//   TextInput,
//   NativeSyntheticEvent,
//   TextInputSelectionChangeEventData,
// } from "react-native";

// interface SelectedRange {
//   index: number;
//   start: number;
//   end: number;
//   text: string;
// }

// interface SelectableTextProps {
//   text: string;
//   onSelection: (range: SelectedRange) => void;
//   children?: React.ReactNode;
// }

// const SelectableText = ({ text, onSelection, children }: SelectableTextProps) => {
//   const textInputRef = useRef<TextInput>(null);

//   const handleSelectionChange = (e: NativeSyntheticEvent<TextInputSelectionChangeEventData>) => {
//     const { selection } = e.nativeEvent;
//     if (selection.start !== selection.end) {
//       onSelection(selection);
//     }
//   };

//   return (
//     <TextInput
//       ref={textInputRef}
//       multiline
//       editable={false}
//       selectTextOnFocus
//       onSelectionChange={handleSelectionChange}
//       value={text}
//       style={{
//         fontSize: 16,
//         lineHeight: 24,
//         padding: 0,
//         margin: 0,
//       }}
//     >
//       {children}
//     </TextInput>
//   );
// };
