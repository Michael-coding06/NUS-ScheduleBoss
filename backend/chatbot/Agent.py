import google.generativeai as genai
from dotenv import load_dotenv
from pydantic_ai import Agent, Tool
from pydantic_ai.messages import ModelMessage, ModelRequest
import os
import tools
from pydantic_ai.models.openai import OpenAIModel
from pydantic_ai.providers.openai import OpenAIProvider

load_dotenv()

system_prompt = """\
You are a helpful, friendly and concise scheduling assistant.
When the user's message includes a valid module code (e.g., CS1010E) and seems to be asking about its timetable, call the find_mod_time tool.
When the user wants to send a notification, use the send_noti tool.
When the user wants to add a module or task to the timetable, use the add_span tool with the appropriate details.
For the add_span tool, always use the following abbreviations for the day parameter: 'Mon', 'Tue', 'Wed', 'Thu', 'Fri' (not full names like 'Monday')
and use 24-hour format for the start and end parameters (e.g., 10:00 or 15:00).
When the user asks for module reviews, use the module_review tool to find and summarize reviews from Reddit.
When the user wants to send a notification, use the send_noti tool.
For general queries about modules or scheduling, provide helpful responses.
Be helpful and concise in your responses.
"""

def message_filter(messages: list[ModelMessage]) -> list[ModelMessage]:
    """Simple message filter - keep last 15 messages and remove orphaned tool messages"""
    recent_messages = messages[-15:] if len(messages) > 15 else messages

    filtered = []
    for i, msg in enumerate(recent_messages):
        if hasattr(msg, 'role') and msg.role == 'tool':
            if i > 0 and hasattr(recent_messages[i-1], 'role'):
                prev_msg = recent_messages[i-1]
                if prev_msg.role == 'assistant' and hasattr(prev_msg, 'tool_calls'):
                    filtered.append(msg)
            continue
        else:
            filtered.append(msg)
    
    return filtered

agent = Agent(
    'openai:gpt-4o',
    deps_type=str,
    system_prompt=system_prompt,
    history_processors=[message_filter],
    tools=[
        Tool(tools.find_mod_time, require_parameter_descriptions=True),
        Tool(tools.add_span,
             name="add_span",
             description="Adds a span to the timetable. Input: day (string), start (string), end (string), name (string), type (string).",
             require_parameter_descriptions=True
             ),
        Tool(tools.review_module,
             name="module_review",
             description="Find reviews of module on Reddit and summarize to user in terms of difficulty, workload, professor, content, tips and general. Input: String"
             ),
        Tool(tools.send_noti,
             name="send_noti",
             description="Sends a pop-up notification to the user with a given message. Input: string."
             ),
    ]
)

def bot_response(message): 
    tools.type.clear()
    classified_message = tools.classify_command(message)
    print(classified_message)
    ans = agent.run_sync(message)
    if classified_message in ['module_arrangement', 'academic_plan']:
        ans.output = 'OKAY'
    return {
        'classified': classified_message,
        'type': tools.type,
        'response': ans.output,
    }