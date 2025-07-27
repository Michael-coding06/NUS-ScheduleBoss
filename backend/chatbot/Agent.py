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
For general queries about modules or scheduling, provide helpful responses.
Note: You do not handle adding spans to timetables or module reviews and send notification - those are handled by a specialized agent.
"""

ollama_system_prompt = """\
You are a specialized assistant for module management and reviews.
When the user wants to add a module or task to the timetable, use the add_span tool with the appropriate details.
For the add_span tool, always use the following abbreviations for the day parameter: 'Mon', 'Tue', 'Wed', 'Thu', 'Fri' (not full names like 'Monday')
and use 24-hour format for the start and end parameters (e.g., 10:00 or 15:00).
When the user asks for module reviews, use the module_review tool to find and summarize reviews from Reddit.
When the user wants to send a notification, use the send_noti tool.
Be helpful and concise in your responses.
"""

def filter_responses(messages: list[ModelMessage]) -> list[ModelMessage]:
    return [msg for msg in messages if isinstance(msg, ModelRequest)]

def summarize_old_messages(messages: list[ModelMessage]) -> list[ModelMessage]:
    return messages[-20:]

api_key = os.getenv("GEMINI_API_KEY")
ollama_model = OpenAIModel(
    model_name='llama3.1',
    provider=OpenAIProvider(base_url='http://localhost:11434/v1')
)

ollama_Agent = Agent(
    ollama_model,
    deps_type=str,
    system_prompt=ollama_system_prompt,
    history_processors=[filter_responses, summarize_old_messages],
    tools=[
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

gemini_agent = Agent(
    'gemini-2.0-flash',
    deps_type=str,
    system_prompt=system_prompt,
    history_processors=[filter_responses, summarize_old_messages],
    tools=[
        Tool(tools.find_mod_time, require_parameter_descriptions=True),
    ]
)

def bot_response(message): 
    tools.type.clear()
    classified_message = tools.classify_command(message)
    print(classified_message)
    if classified_message in ['add_span', 'review_module', 'send_noti']:
        ans = ollama_Agent.run_sync(message)
        agent_used = 'ollama'
    else:
        ans = gemini_agent.run_sync(message)
        agent_used = 'gemini'
        if classified_message in ['module_arrangement', 'academic_plan']:
            ans.output = 'OKAY'
    return {
        'classified': classified_message,
        'agent_used': agent_used,
        'type': tools.type,
        'response': ans.output,
    }