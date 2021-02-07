import { Message } from "@/components/Barrage";
import React, { useEffect, useRef } from "react";


function usePrevious(list: Message[]) {
    const listRef = useRef<Message[]>([]);

    useEffect(() => {
        listRef.current = list;
    });

    return listRef.current;
};


export default usePrevious;