import json
import re
from typing import Dict, Optional

type = {}

day_order = {'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4}

# Classification patterns
COMMAND_PATTERNS = {
    'module_arrangement': {
        'keywords': ['arrange modules', 'module arrangement', 'organize modules', 'schedule modules', 'plan modules'],
        'patterns': [r'arrange.*modules?', r'organize.*modules?', r'schedule.*modules?']
    },
    'academic_plan': {
        'keywords': ['academic plan', 'study plan', 'semester plan', 'course plan', 'academic schedule'],
        'patterns': [r'academic.*plan', r'study.*plan', r'semester.*plan', r'course.*plan']
    },
    'find_mod_time': {
        'keywords': ['module time', 'class time', 'lecture time', 'timetable for'],
        'patterns': [r'when is.*(?:CS|EE|MA|ST)\d+', r'time.*(?:CS|EE|MA|ST)\d+', r'schedule.*(?:CS|EE|MA|ST)\d+']
    },
    'add_span': {
        'keywords': ['add', 'schedule', 'book', 'create event', 'add task'],
        'patterns': [r'add.*(?:task|event|span)', r'schedule.*(?:task|event)', r'book.*time']
    },
    'find_email': {
        'keywords': ['find email', 'email for', 'contact', 'email address'],
        'patterns': [r'email.*for', r'find.*email', r'contact.*for']
    },
    'find_free_time': {
        'keywords': ['free time', 'available time', 'when free', 'open slots', 'meet', 'meeting'],
        'patterns': [r'free.*time', r'available.*time', r'when.*free', r'open.*slot', r'when.*meet', r'meeting.*time']
    },
    'send_noti': {
        'keywords': ['notification', 'notify', 'alert', 'remind'],
        'patterns': [r'send.*notification', r'notify.*me', r'alert.*me', r'remind.*me']
    }
}

def classify_command(user_input: str) -> Optional[str]:
    """
    Classify the user's command based on keywords and patterns.
    
    Args:
        user_input: The user's input string
        
    Returns:
        The classified command type or None if no match found
    """
    user_input_lower = user_input.lower()
    
    # Check for high-level commands first
    module_arrangement_patterns = [
        'arrange my modules', 'organize my schedule', 'help me plan my modules',
        'module arrangement', 'schedule my classes'
    ]
    
    academic_plan_patterns = [
        'academic plan', 'study plan', 'semester planning', 'course planning',
        'plan my semester', 'academic schedule'
    ]
    
    for pattern in module_arrangement_patterns:
        if pattern in user_input_lower:
            type['module_arrangement'] = None
            return 'module_arrangement'
    
    for pattern in academic_plan_patterns:
        if pattern in user_input_lower:
            type['academic_plan'] = None
            return 'academic_plan'
    
    # Then check for specific function commands
    for command_type, config in COMMAND_PATTERNS.items():
        # Check keywords
        for keyword in config['keywords']:
            if keyword in user_input_lower:
                return command_type
        
        # Check regex patterns
        for pattern in config['patterns']:
            if re.search(pattern, user_input_lower):
                return command_type
    
    return None

def find_mod_time(module: str) ->str:
    """
    Find the timetable for a specific module.

    Args:
        module: The module code (e.g., 'CS1010E').

    Returns:
        The timetable for the given module.
    """
    type['find_mod_time'] = None
    with open('all_modules_timetable.json', 'r') as file:
        data = json.load(file)
    module_time = data.get(module)
    sorted_data = sorted(module_time, key=lambda x: day_order[x['day']])
    return sorted_data

from pydantic import BaseModel
from typing import Union, List

class SpanInput(BaseModel):
    """
    Add either task or module spans to the timetable widgets
    
    Args:
        day: The day of the span, e.g., 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'
        start: The starting time of the span, e.g., '10:00'
        end: The ending time of the span, e.g., '15:00'
        name: Name of the span, e.g, 'CS2040C (if module), and 'Ping Pong' (if task)
        type: Either module or task
    
    """
    day: str
    start:str
    end: str
    name: str
    type: str

def add_span(span: SpanInput):
    if 'add_span' not in type:
        type['add_span'] = []
    type['add_span'].append(span.dict())

from plyer import notification

def send_noti(message: str) ->str:
    type['send_noti'] = None
    return notification.notify(
        title = 'NUS Schedule Boss',
        message = message,
        app_name='ChatBot',
        timeout = 5
    )

def find_email(name: str, data_mail = data) -> str:
    """
    Search for the part of the person's name that appears in their email address. (e.g, "Khoa" in "vietkhoaktk@gmail.com")

    Args:
        name: The substring to search for in email addresses.
        data_mail: The dictionary loaded from 'spans.json'.

    Returns:
        Email address that contains the given name as a substring.
    """
    type['find_email'] = None 
    email = [email for email in data_mail if name.lower() in email.lower()]
    return email 

def find_free_time(day: str, email: str, start = '09:00', end = '19:00', data_spans = data):
    """
    Find free time slots in the timetable for a specific day.

    Args:
        day: The day to check for free time slots (e.g., 'Mon', 'Tue', 'Wed', 'Thu', 'Fri').
        data_spans: The dictionary loaded from 'spans.json'.

    Returns:

    """
    type['find_free_time'] = None
    start = int(start.replace(':00', ''))
    end = int(end.replace(':00', ''))
    free_time = [i for i in range(start, end + 1)]
    for span in data_spans[email]:
        if(span['day'] == day):
            span_start = int(span['start'].replace(':00', ''))
            span_end = int(span['end'].replace(':00', ''))
            for i in range(span_start, span_end):
                if i in free_time:
                    free_time.remove(i)  
    return free_time