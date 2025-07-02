import google.generativeai as genai
from dotenv import load_dotenv
from pydantic_ai import Agent, Tool
from pydantic_core import to_jsonable_python
from pydantic_ai.messages import ModelMessagesTypeAdapter
load_dotenv()
import os
import json
import tools
DATA_FILE = 'data.json'
if os.path.exists(DATA_FILE):
    with open(DATA_FILE, 'r') as file:
        data = json.load(file)
else:
    data = []

# testing
DATA_FILE_2 = 'data2.json'
if os.path.exists(DATA_FILE_2):
    with open(DATA_FILE_2, 'r') as file:
        data2 = json.load(file)
else:
    data2 = []

system_prompt = """\
You are a helpful, friendly and concise scheduling assistant.
When the user's message includes a valid module code (e.g., CS1010E) and seems to be asking about its timetable, call the find_mod_time tool.
When the user wants to add a module or task to the timetable, use the add_span tool with the appropriate details.
For the add_span tool, always use the following abbreviations for the day parameter: 'Mon', 'Tue', 'Wed', 'Thu', 'Fri' (not full names like 'Monday')
and 10:00 or 15:00 for the start and end parameters.

==== CALENDAR AVAILABILITY AND MEETING SCHEDULING ====
When a user asks to find a time for them to meet with someone (e.g "when can Khoa and Minh meet tomorow?", "when should Khoa and Minh play table tennis on Tuesday?") follow this workflow:
1. Identify the names of the people involved in the meeting (e.g., Khoa and Minh).
2. Use the find_email tool to get their email addresses.
3. Use the find_free_time tool to find mutual available time slots between both of them.
4. If there are available time slots, suggest them to the user.
"""

    
api_key = os.getenv("GEMINI_API_KEY")
model = Agent(  
    'gemini-2.0-flash',
    deps_type= str,
    # output_type= str,
    system_prompt= system_prompt,
    tools = [
        Tool(tools.find_mod_time, require_parameter_descriptions=True),
        Tool(tools.send_noti, 
             name="send_noti",
             description="Sends a pop-up notification to the user with a given message. Input: string."
            ),
        Tool(tools.add_span,
             name = "add_span",
             description = "Adds a span to the timetable. Input: day (string), start (string), end (string), name (string), type (string)."
            ),
        Tool(tools.find_free_time,
             name = "find_free_time",
             description = "Finds free time slots in the timetable. Input: day (string), start (string), end (string)."
            ),
        Tool(tools.find_email,
             name = "find_email",
             description = "Finds the email address of a person. Input: name (string)."
            ),
    ]
)

def bot_response(message, data_2 = ModelMessagesTypeAdapter.validate_python(data2)):
    tools.type.clear()
    print(tools.data)
    data.append({'sender': 'user', 'text': message})
    ans = model.run_sync(message, message_history=data_2)
    data.append({'sender': 'bot', 'text': ans.output})
    with open('data.json', 'w') as file:
        json.dump(data, file, indent = 2)
        
    #testing
    data2 = to_jsonable_python(ans.all_messages())
    with open('data2.json', 'w') as file:
        json.dump(data2, file, indent =2)

    return {
        'type': tools.type,
        'response': ans.output,
    }

