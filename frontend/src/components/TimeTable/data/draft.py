import requests
import re
from typing import Set, Optional

class NUSModsAPI:    
    def __init__(self, academic_year: str = "2025-2026"):
        self.base_url = f"https://api.nusmods.com/v2/{academic_year}"
        self.session = requests.Session()
        
    def get_module_prerequisites(self, module_code: str) -> Optional[str]:
        """Get prerequisite string for a module"""
        url = f"{self.base_url}/modules/{module_code}.json"
        
        try:
            response = self.session.get(url)
            response.raise_for_status()
            data = response.json()
            return data.get('prerequisite', '')
        except requests.exceptions.RequestException:
            return None
    
    def parse_module_codes(self, prereq_string: str) -> Set[str]:
        """Extract module codes from prerequisite string"""
        if not prereq_string:
            return set()
        
        # Find module codes like CS1010, MA1521, etc.
        print(prereq_string)
        pattern = r'\b[A-Z]{2,4}\d{4}[A-Z]?\b'
        modules = re.findall(pattern, prereq_string.upper())
        print(set(modules))
        return set(modules)
    
    def get_all_prerequisites(self, module_code: str) -> Set[str]:
        """Get all prerequisites (including indirect ones) as a flat set"""
        all_prereqs = set()
        to_process = {module_code}
        processed = set()
        
        while to_process:
            current = to_process.pop()
            if current in processed:
                continue
                
            processed.add(current)
            prereq_text = self.get_module_prerequisites(current)
            
            if prereq_text:
                direct_prereqs = self.parse_module_codes(prereq_text)
                all_prereqs.update(direct_prereqs)
                to_process.update(direct_prereqs - processed)
        
        # Remove the original module if it was included
        all_prereqs.discard(module_code)
        return all_prereqs

# Example usage
def main():
    api = NUSModsAPI("2023-2024")
    
    module = "CS3241"
    prereqs = api.get_all_prerequisites(module)
    print(f"All prerequisites for {module}:")
    print(prereqs)
    
    print(f"\nTotal: {len(prereqs)} prerequisite modules")

if __name__ == "__main__":
    main()