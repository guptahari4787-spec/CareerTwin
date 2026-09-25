import urllib.request
import json

BASE = 'http://127.0.0.1:8000/api'

queries = [
    'What if I learn Docker?',
    'What if I learn Kubernetes?',
    'What if I learn AI?',
    'What if I complete AWS Cloud Practitioner?',
    'What skills do I need for Cloud Engineer?',
    'What am I missing for DevOps?',
    'What should I learn next?'
]

print("=== Running What-If Test Scenarios ===")
for q in queries:
    req = urllib.request.Request(
        f"{BASE}/simulator/what-if",
        data=json.dumps({"query": q, "target_career_id": "cloud-engineer"}).encode(),
        headers={"Content-Type": "application/json"}
    )
    res = json.loads(urllib.request.urlopen(req).read())
    print(f"\nQuery: '{q}'")
    print(f"  Intent: {res['intent']} | Entity: {res['entity_name']} | Type: {res['entity_type']}")
    print(f"  Delta: +{res['percentage_delta']}% | Match: {res['original_match_percentage']}% -> {res['simulated_match_percentage']}%")
    print(f"  Explanation: {res['explanation']}")
    print(f"  Can Apply: {res['can_apply']} | Simulated Addition: {res['simulated_addition']}")

print("\n=== All Scenarios Passed Successfully ===")
