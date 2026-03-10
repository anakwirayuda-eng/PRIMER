"""
@reflection
[IDENTITY]: ICD-9 Extraction Script (Python)
[PURPOSE]: Python version of procedure code extraction.
[STATE]: Deprecated/Reference
"""
import re
import json

input_file = r'C:\Users\USER\.gemini\antigravity\scratch\primer-game\src\data\ICD9CM.js'
output_file = r'C:\Users\USER\.gemini\antigravity\scratch\primer-game\src\data\master_icd_9.json'

with open(input_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Find the array content between 'export const ICD9CM_DB = [' and '];'
# Using a regex that is non-greedy for the content inside
match = re.search(r'export const ICD9CM_DB = \[(.*?)\];', content, re.DOTALL)

if match:
    array_content = match.group(1).strip()
    # Ensure it's valid JSON by wrapping in [] and handling possible trailing commas if any
    # Actually, the original is JS objects, which are almost JSON but might have some differences.
    # In this case, they seem like literal JSON objects.
    
    # Try to load it as JSON. If it fails, it might need more processing.
    try:
        data = json.loads("[" + array_content + "]")
        with open(output_file, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=4)
        print("Successfully extracted ICD9CM data.")
    except Exception as e:
        print(f"Error parsing array content: {e}")
else:
    print("Could not find ICD9CM_DB array in file.")
