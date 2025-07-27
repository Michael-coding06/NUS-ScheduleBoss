import { useState } from 'react';
import { days, time} from './data/data';
const GeneralSection = ({
    sectionName,
    dropdownOpen_span,
    setDropdownOpen_span,
    selectedSpans,
    setSelectedSpans,
    highlightedSpans,
    setHighlightedSpans,
    sectionColors
    // hiddenSpans,
    // setHiddenSpans,
}) => {
    const [newSpanName, setNewSpanName] = useState("");
    const [spanDay, setSpanDay] = useState(days[0]);
    const [spanStart, setSpanStart] = useState(time[0]);
    const [spanEnd, setSpanEnd] = useState(time[1]);

    const handleAddSpan = (sectionType) => {
        if(newSpanName.trim()){
            const newSpan = {
                day: spanDay,
                start: spanStart,
                end: spanEnd,
                name: newSpanName.trim(),
                type: sectionType.toLowerCase(),
                visibility: {default: true},
                details: ''
            }
            setSelectedSpans([...selectedSpans, newSpan]);
            setHighlightedSpans([...highlightedSpans, newSpan]);
        }
        setNewSpanName('');
        setDropdownOpen_span(false)
    }

    const sectionSpans = selectedSpans.filter(span => span.type === sectionName.toLowerCase())
    return (
        <div className="feature-card">
            <div className="task-section-header">
                Add your {sectionName.toLowerCase()} here
                <button className="dropdown-button"  onClick={() => setDropdownOpen_span(!dropdownOpen_span)}> ➕ </button>
            </div>

            {dropdownOpen_span && (
                <div className="dropdown-menu-task" style={{border: `2px solid ${sectionColors[sectionName]?.box}`}}>
                    <div className="task-info">
                        <div className="task-info-item">
                            <div className="task-label">Name of your {sectionName.toLowerCase()}:</div>
                                <input  type="text" className="task-input" placeholder={`E.g. ${sectionName.toLowerCase()}`}
                                value={newSpanName} onChange={(e) => setNewSpanName(e.target.value)} autoFocus />
                        </div>
                        <div className="task-info-item">
                            <div className="task-label">Day:</div>
                            <select className="task-input" value={spanDay} onChange={(e) => setSpanDay(e.target.value)}>
                            {days.map(day => (<option key={day} value={day}>{day}</option>))}
                            </select>
                        </div>
                        <div className="task-info-item">
                            <div className="task-label">Start Time:</div>
                            <select className="task-input" value={spanStart} onChange={(e) => setSpanStart(e.target.value)}>
                            {time.map(timeSlot => (<option key={timeSlot} value={timeSlot}>{timeSlot}</option>))}
                            </select>
                        </div>
                        <div className="task-info-item">
                            <div className="task-label">End Time:</div>
                            <select className="task-input" value={spanEnd} onChange={(e) => setSpanEnd(e.target.value)}>
                            {time.map(timeSlot => (<option key={timeSlot} value={timeSlot}>{timeSlot}</option>))}
                            </select>
                        </div>
                        <button onClick={() => handleAddSpan(sectionName)}> Add {sectionName} </button>
                    </div>
                </div>
            )}
            
            <div className="task-list">
                {sectionSpans.map((span, index) => (
                    <div key={index} className="task-card">
                        <div className= 'color-box' style={{backgroundColor: sectionColors[sectionName]?.box}}/>
                        <div className="task-info-2">
                            <div className="task-title">{span.name}</div>
                            <div className="task-subtitle">{span.day} • {span.start} - {span.end}</div>
                        </div>
                        <div className="mod-action">
                            <button className="icon" onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSpans(selectedSpans.filter(span_ => !(span_.name === span.name && span_.type === span.type)));
                                setHighlightedSpans(highlightedSpans.filter(span_ => !(span_.name === span.name && span_.type === span.type)));
                                }}>
                                🗑️
                            </button>
                            <button className="icon" onClick={(e) => {
                                e.stopPropagation();
                                setSelectedSpans(selectedSpans.map(span_ => {
                                    if(span_.name === span.name && span_.type === span.type){
                                        return {
                                            ...span_,
                                            visibility: {
                                                ...span_.visibility,
                                                default: !span_.visibility.default
                                            }
                                        };
                                    }
                                    return span_;
                                }));
                                setHighlightedSpans(highlightedSpans.map(span_ => {
                                    if(span_.name === span.name && span_.type === span.type){
                                        return {
                                            ...span_,
                                            visibility: {
                                                ...span_.visibility,
                                                default: !span_.visibility.default
                                            }
                                        };
                                    }
                                    return span_;
                                }));
                                
                                }}>
                                {span.visibility.default ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default  GeneralSection;

