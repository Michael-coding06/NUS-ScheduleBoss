import pandas as pd

import json
df = pd.read_csv('modules.csv')
module_details = {code: title for code, title in zip(df['moduleCode'], df['title'])}
with open('module_details.json', 'w') as f:
    json.dump(module_details, f, indent = 2)