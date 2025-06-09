import requests
import pandas as pd
import json
import asyncio
import aiohttp

url_moduleList = 'https://api.nusmods.com/v2/2024-2025/moduleList.json'
url_module_path = 'https://api.nusmods.com/v2/2024-2025/modules'

day_mapping = {
    "Monday": "Mon",
    "Tuesday": "Tue",
    "Wednesday": "Wed",
    "Thursday": "Thu",
    "Friday": "Fri",
    "Saturday": "Sat",
    "Sunday": "Sun"
}

def format_time(t):
    t = str(t).zfill(4)
    return f"{t[:2]}:{t[2:]}"

async def fetch_module_data(session, code):
    module_url = f"{url_module_path}/{code}.json"
    async with session.get(module_url) as response:
        return await response.json()

async def main():
    async with aiohttp.ClientSession() as session:
        response_moduleList = await session.get(url_moduleList)
        module_codes = [module['moduleCode'] for module in await response_moduleList.json()]

        result = {}
        tasks = [fetch_module_data(session, code) for code in module_codes]
        modules_data = await asyncio.gather(*tasks)

        for code, module_data in zip(module_codes, modules_data):
            semester_data = module_data.get('semesterData', [])
            result[code] = set()  

            for semester in semester_data:
                timetable = semester.get('timetable', [])
                for row in timetable:
                    time_slot = (
                        day_mapping.get(row["day"], row["day"]),
                        format_time(row['startTime']),
                        format_time(row['endTime']),
                    )
                    result[code].add(time_slot)  

            result[code] = [dict(day=day, start=start, end=end) for day, start, end in result[code]]

        with open("all_modules_timetable.json", "w") as f:
            json.dump(result, f)

if __name__ == "__main__":
    asyncio.run(main())