import json
import re
from typing import Dict, Optional
import time

type = {}

day_order = {'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4}
with open('all_modules_timetable.json', 'r') as file:
    data = json.load(file)

def classify_command(user_input: str) -> Optional[str]:
    """
    Classify the user's command based on keywords and patterns to determine which tool should be used.
    
    Args:
        user_input: The user's input string
        
    Returns:
        The classified command type matching available tools or None if no match found
    """
    user_input_lower = user_input.lower().strip()
    add_span_patterns = [
        r'add.*(?:to|into).*(?:timetable|schedule|calendar)',
        r'schedule.*(?:task|event|module|meeting|class)',
        r'book.*(?:time|slot|room)',
        r'create.*(?:event|task|appointment)',
        r'put.*(?:in|on).*(?:timetable|schedule|calendar)',
        r'insert.*(?:into|in).*(?:timetable|schedule)'
    ]
    
    add_span_keywords = [
        'add to timetable', 'add to schedule', 'add to calendar',
        'schedule task', 'schedule event', 'schedule meeting',
        'book time', 'book slot', 'create event', 'create task',
        'add assignment', 'add homework', 'add meeting',
        'put in schedule', 'insert into timetable', 'add'
    ]
    
    review_module_patterns = [
        # Direct review questions
        r'(?:review|opinion|experience).*(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+',
        r'(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+.*(?:review|opinion|experience|feedback)',
        
        # Difficulty/workload questions
        r'(?:how|is).*(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+.*(?:hard|difficult|easy|tough)',
        r'(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+.*(?:difficult|easy|hard|workload|heavy)',
        
        # Should I take questions
        r'should.*(?:take|enroll).*(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+',
        r'(?:worth|recommend).*(?:taking|enrolling).*(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+',
        
        # Professor/content questions
        r'(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+.*(?:professor|prof|lecturer|teacher)',
        r'(?:professor|prof).*(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+',
        r'(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+.*(?:content|syllabus|topics|material)',
        
        # General opinion patterns
        r'what.*(?:think|say|feel).*(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+',
        r'(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+.*(?:good|bad|worth|recommend)',
        r'(?:experience|feedback).*(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+',
    ]
    
    review_module_keywords = [
        'module review', 'course review', 'class review',
        'how difficult', 'how hard', 'how easy', 'difficulty level',
        'workload heavy', 'workload light', 'much work',
        'should i take', 'worth taking', 'recommend taking',
        'what do people say', 'what do students think',
        'professor rating', 'lecturer review', 'teacher review',
        'course content', 'module content', 'syllabus review',
        'tips for', 'advice for', 'experience with'
    ]
    
    find_mod_time_patterns = [
        r'(?:when|what time).*(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+',
        r'(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+.*(?:time|schedule|timetable)',
        r'(?:schedule|timetable).*(?:for|of).*(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+',
        
        # Class timing patterns
        r'(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+.*(?:class|lecture|tutorial|lab).*(?:time|when)',
        r'(?:class|lecture|tutorial|lab).*(?:time|schedule).*(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+',
        
        # General timing questions
        r'(?:cs|ee|ma|st|ge|is|bz|acc|fin|mkt)\d+.*(?:held|conducted|scheduled).*(?:when|time)',
    ]
    
    find_mod_time_keywords = [
        'module time', 'class time', 'lecture time', 'tutorial time',
        'timetable for', 'schedule for', 'timing for',
        'when is', 'what time is', 'time for'
    ]
    
    send_noti_patterns = [
        r'send.*(?:notification|alert|reminder)',
        r'(?:notify|alert|remind).*me',
        r'pop.*up.*(?:notification|message)',
        r'show.*(?:notification|alert|popup)',
    ]
    
    send_noti_keywords = [
        'send notification', 'send alert', 'send reminder',
        'notify me', 'alert me', 'remind me',
        'popup notification', 'show notification', 'display alert'
    ]
    
    module_arrangement_patterns = [
        r'arrange.*modules?', r'organize.*(?:modules?|schedule|timetable)',
        r'plan.*(?:modules?|schedule|timetable)', r'module.*arrangement',
        r'help.*(?:plan|organize|arrange).*(?:modules?|schedule)',
    ]
    
    academic_plan_patterns = [
        r'academic.*plan', r'study.*plan', r'semester.*plan',
        r'course.*plan', r'academic.*schedule', r'degree.*plan',
        r'plan.*(?:semester|academic|study|course)',
    ]
    # 1. Check add_span
    for pattern in add_span_patterns:
        if re.search(pattern, user_input_lower):
            type['add_span'] = []
            return 'add_span'
    
    for keyword in add_span_keywords:
        if keyword in user_input_lower:
            type['add_span'] = []
            return 'add_span'
    
    # 2. Check review_module
    for pattern in review_module_patterns:
        if re.search(pattern, user_input_lower):
            type['review_module'] = None
            return 'review_module'
    
    for keyword in review_module_keywords:
        if keyword in user_input_lower:
            type['review_module'] = None
            return 'review_module'
    
    # 3. Check find_mod_time
    for pattern in find_mod_time_patterns:
        if re.search(pattern, user_input_lower):
            type['find_mod_time'] = None
            return 'find_mod_time'
    
    for keyword in find_mod_time_keywords:
        if keyword in user_input_lower:
            type['find_mod_time'] = None
            return 'find_mod_time'
    
    # 4. Check send_noti
    for pattern in send_noti_patterns:
        if re.search(pattern, user_input_lower):
            type['send_noti'] = None
            return 'send_noti'
    
    for keyword in send_noti_keywords:
        if keyword in user_input_lower:
            type['send_noti'] = None
            return 'send_noti'
    
    # 5. Check high-level commands
    for pattern in module_arrangement_patterns:
        if re.search(pattern, user_input_lower):
            type['module_arrangement'] = None
            return 'module_arrangement'
    
    for pattern in academic_plan_patterns:
        if re.search(pattern, user_input_lower):
            type['academic_plan'] = None
            return 'academic_plan'
    
    module_arrangement_keywords = [
        'arrange my modules', 'organize my schedule', 'help me plan my modules',
        'module arrangement', 'schedule my classes', 'organize my timetable'
    ]
    
    academic_plan_keywords = [
        'academic plan', 'study plan', 'semester planning', 'course planning',
        'plan my semester', 'academic schedule', 'degree planning'
    ]
    
    for keyword in module_arrangement_keywords:
        if keyword in user_input_lower:
            type['module_arrangement'] = None
            return 'module_arrangement'
    
    for keyword in academic_plan_keywords:
        if keyword in user_input_lower:
            type['academic_plan'] = None
            return 'academic_plan'
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
    Add a span (module, task, meeting, etc.) to the timetable widget.

    Args:
        day (str): The day of the span, e.g., 'Mon', 'Tue', 'Wed', 'Thu', 'Fri'.
        start (str): The starting time of the span, e.g., '10:00'.
        end (str): The ending time of the span, e.g., '15:00'.
        name (str): The name of the span, e.g., 'CS2040C' (if it's a module).
        type (str): The category of the span. This is inferred based on the content of the user's message. Examples:
            - 'Module': When the name is a known module code, e.g., 'CS1010E', 'CS2040C'.
            - 'Task': Example user input: "Add a task named chores to my timetable."
            - 'Meeting': Example user input: "Add a meeting with John to my timetable."
            - Other custom types may be used depending on the user’s phrasing or system logic.
    """
    day: str
    start:str
    end: str
    name: str
    type: str

def add_span(span: SpanInput):
    """
    Add a span (module, task, meeting, etc.) to the internal timetable data structure.

    This function validates and appends the provided span based on its type.
    For 'module' type, it checks whether the span matches any known slots in the module data before adding.

    Args:
        span (SpanInput): A validated input object containing the span details
            including day, start time, end time, name, and type.
    """
    if 'add_span' not in type:
        type['add_span'] = []
    if span.type == 'module':
        if span.name not in data:
            return False
        matching_slot = next(
            (slot for slot in data[span.name] 
             if slot['day'] == span.day 
             and slot['start'] == span.start 
             and slot['end'] == span.end), 
            None
        )
        if matching_slot:
            type['add_span'].append(span.dict())
            return True
        return False
    type['add_span'].append(span.dict())
    print(span.dict())
    return True

from plyer import notification
from datetime import datetime, timedelta
def send_noti(message: str, delay_input: str = None) -> bool:

    """
    Send a notification after a specified delay.
    Args:
        message (str): The notification message to display
        delay_input (str, optional): Delay specification like '2 mins", 5 min", "30 sec", "2 hours"
                                   If None, extracts delay from the message itself
    Returns:
        bool: True if notification was sent successfully, False otherwise
    
    Examples:
        send_notification("Meeting in 15 minutes", "15 min")
        send_notification("Remember to take a break in 30 min")
        send_notification("Lunch time!", "1 hour")
    """
    if delay_input is not None:
        print(delay_input)
        delay_match = re.search(r'(\d+)\s*(m|min|mins|minute|minutes|sec|secs|s|second|seconds|hour|hours)', delay_input.lower())
        if delay_match:
            delay_value = int(delay_match.group(1))
            delay_unit = delay_match.group(2)
            delay_seconds = convert_to_seconds(delay_value, delay_unit)
        else:
            delay_seconds = 10
            print(f"Could not parse delay from input: {delay_input}")
            # return False
    else:
        delay_match = re.search(r'(\d+)\s*(m|min|mins|minute|minutes|sec|secs|s|second|seconds|hour|hours)', message.lower())
        if delay_match:
            delay_value = int(delay_match.group(1))
            delay_unit = delay_match.group(2)
            delay_seconds = convert_to_seconds(delay_value, delay_unit)
        else:
            print("No delay found in message and no delay_input provided")
            return False
    if delay_seconds > 0:
        send_time = datetime.now() + timedelta(seconds=delay_seconds)
        print(f"Notification scheduled for: {send_time.strftime('%H:%M:%S')}")
        print(f"Waiting {delay_seconds} seconds...")
        time.sleep(delay_seconds)
    notification.notify(
        title='NUS Schedule Boss',
        message=message,
        app_name='ChatBot',
        timeout=10  
    )
    print(f"Notification sent: {message}")
    return True

def convert_to_seconds(value: int, unit: str) -> int:
    """Convert time value to seconds based on unit."""
    unit = unit.lower()
    if unit in ['s','sec','secs', 'second', 'seconds']:
        return value
    elif unit in ['m', 'min','mins', 'minute', 'minutes']:
        return value * 60
    elif unit in ['hour', 'hours', 'h']:
        return value * 3600
    else:
        return value * 60  

import praw
import os
from dotenv import load_dotenv


from typing import List, Dict
load_dotenv()
class NUSModuleReview:
    def __init__(self):
        self.reddit = praw.Reddit(
            client_id=os.getenv('REDDIT_ID'),
            client_secret=os.getenv('REDDIT_SECRET'),
            user_agent='NUSModuleReview'
        )
    def search_module(self, module_code: str) -> str:
        """
        Search r/nus for information about a specific module
        
        Args:
            module_code: NUS module code (e.g., "CS2103T", "MA1521")
            
        Returns:
            Summary of what people say about the module
        """
        try:
            subreddit = self.reddit.subreddit('nus')
            posts = list(subreddit.search(module_code, limit =20, time_filter='all'))
            insights = {
                'difficulty': [],
                'workload': [],
                'professor': [],
                'content': [],
                'tips': [],
                'general': []
            }
            for post in posts:
                # text_content = f"{post.title} {post.selftext}".lower()
                post.comments.replace_more(limit = 0)
                for comment in post.comments[:10]:
                    if(hasattr(comment, 'body') and len(comment.body) > 20):
                        comment_text = comment.body.lower()
                        if any(word in comment_text for word in ['hard', 'difficult', 'easy', 'tough', 'simple']):
                                insights['difficulty'].append(comment.body[:200])
                        elif any(word in comment_text for word in ['workload', 'heavy', 'light', 'assignments', 'homework']):
                            insights['workload'].append(comment.body[:200])
                        elif any(word in comment_text for word in ['prof', 'professor', 'lecturer', 'teacher']):
                            insights['professor'].append(comment.body[:200])
                        elif any(word in comment_text for word in ['content', 'topics', 'syllabus', 'learn']):
                            insights['content'].append(comment.body[:200])
                        elif any(word in comment_text for word in ['tip', 'advice', 'recommend', 'suggest']):
                            insights['tips'].append(comment.body[:200])
                        else:
                            insights['general'].append(comment.body[:150])
            summary = self.create_summary(module_code, insights)
            return summary
        except Exception as e:
            return f'Error searching {module_code}'
    def create_summary(self, module_code: str, insights: Dict[str, List[str]]):
        summary = f'Reviews for {module_code}\n\n'
        if insights['difficulty']:
            summary += "🎯 **Difficulty Level:**\n"
            for comment in insights['difficulty'][:3]:  # Top 3 comments
                summary += f"• {comment.strip()}\n"
            summary += "\n"
        
        if insights['workload']:
            summary += "⏰ **Workload:**\n"
            for comment in insights['workload'][:3]:
                summary += f"• {comment.strip()}\n"
            summary += "\n"
        
        if insights['professor']:
            summary += "👨‍🏫 **About Professors:**\n"
            for comment in insights['professor'][:3]:
                summary += f"• {comment.strip()}\n"
            summary += "\n"
        
        if insights['content']:
            summary += "📖 **Course Content:**\n"
            for comment in insights['content'][:3]:
                summary += f"• {comment.strip()}\n"
            summary += "\n"
        
        if insights['tips']:
            summary += "💡 **Tips & Advice:**\n"
            for comment in insights['tips'][:3]:
                summary += f"• {comment.strip()}\n"
            summary += "\n"
        
        if insights['general']:
            summary += "💬 **General Comments:**\n"
            for comment in insights['general'][:5]:
                summary += f"• {comment.strip()}\n"
            summary += "\n"
        
        summary += "⚠️ *Experiences may vary.*"
        
        return summary


def review_module(module_code: str) -> str:
    """
    Get review of NUS module from reddit
    
    Args:
        module_code: NUS module code (e.g., "CS2103T")
        
    Returns:
        Summary of what students say about the module
    """
    review = NUSModuleReview()
    return review.search_module(module_code.upper())


# def find_free_time(day: str, email: str, start = '09:00', end = '19:00', data_spans = data):
#     """
#     Find free time slots in the timetable for a specific day.

#     Args:
#         day: The day to check for free time slots (e.g., 'Mon', 'Tue', 'Wed', 'Thu', 'Fri').
#         data_spans: The dictionary loaded from 'spans.json'.

#     Returns:

#     """
#     type['find_free_time'] = None
#     start = int(start.replace(':00', ''))
#     end = int(end.replace(':00', ''))
#     free_time = [i for i in range(start, end + 1)]
#     for span in data_spans[email]:
#         if(span['day'] == day):
#             span_start = int(span['start'].replace(':00', ''))
#             span_end = int(span['end'].replace(':00', ''))
#             for i in range(span_start, span_end):
#                 if i in free_time:
#                     free_time.remove(i)  
#     return free_time