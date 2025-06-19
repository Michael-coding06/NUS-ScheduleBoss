import google.generativeai as genai
from dotenv import load_dotenv
from pydantic_ai import Agent, Tool
from pydantic_core import to_jsonable_python
from pydantic_ai.messages import ModelMessagesTypeAdapter
load_dotenv()
import os
import json

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
"""

day_order = {'Mon': 0, 'Tue': 1, 'Wed': 2, 'Thu': 3, 'Fri': 4}
def find_mod_time(module: str) ->str:
    """
    Find the timetable for a specific module.

    Args:
        module: The module code (e.g., 'CS1010E').

    Returns:
        The timetable for the given module.
    """
    with open('all_modules_timetable.json', 'r') as file:
        data = json.load(file)
    module_time = data.get(module)
    sorted_data = sorted(module_time, key=lambda x: day_order[x['day']])

    # formatted_output = {}
    # for timeslot in sorted_data:
    #     if timeslot['day'] not in formatted_output: formatted_output[timeslot['day']] =[]
    #     formatted_output[timeslot['day']].append(f"{timeslot['start']}-{timeslot['end']}")
    return sorted_data

api_key = os.getenv("GEMINI_API_KEY")
model = Agent(  
    'gemini-2.0-flash',
    deps_type= str,
    # output_type= str,
    system_prompt= system_prompt,
    tools = [
        Tool(find_mod_time, require_parameter_descriptions=True)
    ]
)

def bot_response(message, data_2 = ModelMessagesTypeAdapter.validate_python(data2)):
    data.append({'sender': 'user', 'text': message})
    ans = model.run_sync(message, message_history=data_2)
    data.append({'sender': 'bot', 'text': ans.output})
    with open('data.json', 'w') as file:
        json.dump(data, file, indent = 2)
        
    #testing
    data2 = to_jsonable_python(ans.all_messages())
    with open('data2.json', 'w') as file:
        json.dump(data2, file, indent =2)

    return ans.output