import { useState, useMemo } from "react";

export default function useUI (){
    const [highlightedSpans, setHighlightedSpans] = useState([]);
    const [selectedSpans, setSelectedSpans] = useState([]);
    const [previewSpans, setPreviewSpans] = useState([]);
    const [activeSection, setActiveSection] = useState("Module"); //for sectionName
    const [dropdownOpen_span, setDropdownOpen_span] = useState(false);
    const [sectionVisibility, setSectionVisibility] = useState({
        'Module': true,
        'Task': true
    });  
    const [customSections, setCustomSections] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [newSectionName, setNewSectionName] = useState("");
    const [modules, setModules] = useState([]);
    const [spanDetails, setSpanDetails] = useState('');
    const [moduleArrange, setModuleArrange] = useState(false);
    const [academicPlan, setAcademicPlan] = useState(false)
    const [showSlots, setShowSlots] = useState(false)
    const colorPalette = [
        { box: '#f37335', span: 'linear-gradient(90deg, #ffb347 0%, #f37335 100%)' },
        { box: '#ffcc80', span: 'linear-gradient(90deg, #ffcc80 0%, #ffb347 100%)' },
        { box: '#ff7043', span: 'linear-gradient(90deg, #ffab91 0%, #ff7043 100%)' },
        { box: '#ffab40', span: 'linear-gradient(90deg, #ffd180 0%, #ffab40 100%)' },
        { box: '#ffa726', span: 'linear-gradient(90deg, #ffd54f 0%, #ffa726 100%)' },
        { box: '#ff8a65', span: 'linear-gradient(90deg, #ffccbc 0%, #ff8a65 100%)' },
        { box: '#ffb74d', span: 'linear-gradient(90deg, #ffe082 0%, #ffb74d 100%)' },
        { box: '#ff9800', span: 'linear-gradient(90deg, #ffc107 0%, #ff9800 100%)' },
        { box: '#ff6f00', span: 'linear-gradient(90deg, #ff9800 0%, #ff6f00 100%)' },
        { box: '#ffcc02', span: 'linear-gradient(90deg, #fff176 0%, #ffcc02 100%)' }
    ];

    const[usedColors, setUsedColors] = useState([
        { box: '#f37335', span: 'linear-gradient(90deg, #ffb347 0%, #f37335 100%)' },
        { box: '#ffcc80', span: 'linear-gradient(90deg, #ffcc80 0%, #ffb347 100%)' },
    ]);
    const [sectionColors, setSectionColors] = useState({
        'Module': { box: '#f37335', span: 'linear-gradient(90deg, #ffb347 0%, #f37335 100%)' },
        'Task': { box: '#ffcc80', span: 'linear-gradient(90deg, #ffcc80 0%, #ffb347 100%)' },
    });

    const visibleHighlightedSpans = highlightedSpans.filter(span => {
        const sectionKey = span.type.charAt(0).toUpperCase() + span.type.slice(1);
        const isSectionVisible = sectionVisibility[sectionKey];
        const isSpanVisible = span.visibility?.default !==false;
        return isSectionVisible && isSpanVisible;
    });
    const isTimeInSpan = (day, time, span) => (
        span.day === day && time >= span.start && time < span.end
    );
    const findSpanForCell = (day, time) => {
        return visibleHighlightedSpans.find(span => isTimeInSpan(day, time, span));
    };


    const isSpanSelected = (span) => {
        return selectedSpans.some(sel =>
            sel.day === span.day &&
            sel.start === span.start &&
            sel.end === span.end &&
            sel.name === span.name &&
            sel.type === span.type
        );
    };
    const isSpanPreviewed = (span) => {
        return previewSpans.some(sel =>
            sel.day === span.day &&
            sel.start === span.start &&
            sel.end === span.end &&
            sel.name === span.name &&
            sel.type === span.type
        );
    };

    const isModuleSelected = (name) => {
        return selectedSpans.some(s => s.name === name)
    }

    const allSections = useMemo(() => {
        return ['Module', 'Task', ...customSections];
    }, [customSections]); // lower case will happen here
    
    const toggleSectionVisibility = (sectionName) => {
        setSectionVisibility(prev => ({...prev, [sectionName]: !prev[sectionName]}))
    }

    const addCustomSection = (sectionName) =>{
        const newSection = sectionName.trim() || '';
        if (newSection == 'Module' || newSection == 'Task') {
            return
        }
        if(newSection && !customSections.includes(newSection)){
            const availableColors = colorPalette.filter(color => !usedColors.includes(color));
            let selectedColor;
            if (availableColors.length === 0) {
                // Reset used colors except for Module and Task
                setUsedColors([
                    { box: '#f37335', span: 'linear-gradient(90deg, #ffb347 0%, #f37335 100%)' },
                    { box: '#ffcc80', span: 'linear-gradient(90deg, #ffcc80 0%, #ffb347 100%)' },
                ]);
                selectedColor = colorPalette.find(color => color.box !== '#f37335' && color.box !== '#ffcc80');
            } else {
                // Pick a random color from available colors
                selectedColor = availableColors[Math.floor(Math.random() * availableColors.length)];
            }
            setCustomSections([...customSections, newSection]);
            setSectionVisibility(prev => ({...prev, [newSection]: true}));
            setUsedColors(prev => [...prev, selectedColor.box]);
            setSectionColors(prev => ({...prev, [newSection]: selectedColor}));
        }
        setNewSectionName("");
        // setAddingNewSection(false); think this is useless
    }

    const deleteSection = (sectionName) => {
        if (sectionName === 'Module' || sectionName === 'Task') {
            console.warn('Cannot delete default sections');
            return;
        }
        setCustomSections(prev => prev.filter(section => section !== sectionName));
        setUsedColors(prev => prev.filter(color => color !== sectionColors[sectionName].box));
        setSectionVisibility(prev => {
            const newVisibility = { ...prev };
            delete newVisibility[sectionName];
            return newVisibility;
        });
        setSectionColors(prev => {
            const newColors = { ...prev };
            delete newColors[sectionName];
            return newColors;
        });
        setHighlightedSpans(prev => prev.filter(span => {
            const spanSectionKey = span.type.charAt(0).toUpperCase() + span.type.slice(1);
            return spanSectionKey !== sectionName;
        }))
        setSelectedSpans(prev => prev.filter(span => {
            const spanSectionKey = span.type.charAt(0).toUpperCase() + span.type.slice(1);
            return spanSectionKey !== sectionName;
        }))
        setActiveSection('Module')
    }
    return {
        highlightedSpans,
        setHighlightedSpans,
        selectedSpans,
        setSelectedSpans,
        activeSection,
        setActiveSection,
        dropdownOpen_span,
        setDropdownOpen_span,
        sectionColors,

        findSpanForCell,
        isSpanSelected,
        isSpanSelected,
        isModuleSelected,
        allSections,
        sectionVisibility,
        setSectionVisibility,
        toggleSectionVisibility,

        dropdownOpen,
        setDropdownOpen,
        addCustomSection,
        newSectionName,
        setNewSectionName,

        modules,
        setModules,

        setCustomSections,
        deleteSection,
        setSectionColors,
        spanDetails,
        setSpanDetails,

        moduleArrange,
        setModuleArrange,

        previewSpans,
        setPreviewSpans,
        isSpanPreviewed,

        academicPlan,
        setAcademicPlan,
        showSlots,
        setShowSlots
    }
}