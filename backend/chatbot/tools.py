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
    
    for command_type, config in COMMAND_PATTERNS.items():
        # Check keywords
        for keyword in config['keywords']:
            if keyword in user_input_lower:
                return command_type
        
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