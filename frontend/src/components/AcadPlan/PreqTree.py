import asyncio
import aiohttp
import json

BASE_URL = 'https://api.nusmods.com/v2/2025-2026'

async def fetch_json(session, url):
    async with session.get(url) as response:
        return await response.json()

def clean_prereq(data):
    if isinstance(data, str):
        return data.split(':')[0]
    elif isinstance(data, list):
        return [clean_prereq(item) for item in data]
    elif isinstance(data, dict):
        return {k: clean_prereq(v) for k, v in data.items()}
    
async def fetch_module_prereq(session, code):
    try:
        module_data = await fetch_json(session, f"{BASE_URL}/modules/{code}.json")
        prereq_tree = module_data.get('prereqTree')
        if prereq_tree:
            prereq_tree = clean_prereq(prereq_tree)
        return code, prereq_tree
    except:
        return code, None

async def main():
    async with aiohttp.ClientSession() as session:
        module_list = await fetch_json(session, f"{BASE_URL}/moduleList.json")
        module_codes = [module['moduleCode'] for module in module_list]
        
        tasks = [fetch_module_prereq(session, code) for code in module_codes]
        results = await asyncio.gather(*tasks)
        
        prereq_data = {code: prereq for code, prereq in results if prereq}
        with open("module_prerequisites.json", "w") as f:
            json.dump(prereq_data, f, indent=2)

if __name__ == "__main__":
    asyncio.run(main())