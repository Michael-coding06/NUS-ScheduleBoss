import { moduleTimes, moduleDetails } from "../data/data.js";
function checkOverlap(slot1, slot2){
    if (slot1.day !== slot2.day) return false;
    if (slot1.start === slot2.start || slot1.end === slot2.end) return true;
    return (
        (slot1.start > slot2.start && slot1.start < slot2.end) ||
        (slot2.start > slot1.start && slot2.start < slot1.end)
    );
}

function moduleArrangement(modulesToSchedule, busySlots){
    console.log(busySlots)
    console.log(modulesToSchedule)
    const selectedSchedule = {}
    for (const module of [...modulesToSchedule]){
        const slots = moduleTimes[module] || [];
        console.log([...busySlots, ...Object.values(selectedSchedule)])
        for (const slot of slots){
            const hasConflict = [...busySlots, ...Object.values(selectedSchedule)].some(
                (existingSlot) => checkOverlap(slot, existingSlot)
            );
            if(!hasConflict){
                const finalSlot = {...slot, 
                    name: module, 
                    subtitle: "No Exam • 4 Units",
                    type: 'module', 
                    visibility: { default: true },
                    details: moduleDetails[module]
                }
                selectedSchedule[module] = finalSlot
            }
        }
    }
    if (Object.keys(selectedSchedule).length < modulesToSchedule.length) {
        return {error: false};
    }
    return selectedSchedule;
}

export default moduleArrangement;