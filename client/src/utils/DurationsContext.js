import { createContext } from "react";

const DurationsContext = createContext({
    durations: {
        phase1duration: 0,
        phase2duration: 0,
        phase3duration: 0,
    }
})

export default DurationsContext;