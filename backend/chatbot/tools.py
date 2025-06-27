import json
type = {}

day_order = {'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4}

with open('spans.json', 'r') as file:
        data = json.load(file)

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
    # formatted_output = {}
    # for timeslot in sorted_data:
    #     if timeslot['day'] not in formatted_output: formatted_output[timeslot['day']] =[]
    #     formatted_output[timeslot['day']].append(f"{timeslot['start']}-{timeslot['end']}")
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
