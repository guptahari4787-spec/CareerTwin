from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

endpoints = [
    '/api/overview',
    '/api/data-quality',
    '/api/market/overview',
    '/api/market/skills',
    '/api/market/roles',
    '/api/market/salary',
    '/api/market/experience',
    '/api/market/locations',
    '/api/market/companies',
    '/api/market/cooccurrence',
    '/api/jds/overview',
    '/api/jds/descriptive',
    '/api/jds/statistics',
    '/api/jds/logistic',
    '/api/jds/random-forest',
    '/api/jds/model-comparison',
    '/api/sds/overview',
    '/api/sds/descriptive',
    '/api/sds/statistics',
    '/api/sds/logistic',
    '/api/sds/random-forest',
    '/api/alignment',
    '/api/evidence/dashboard_and_storytelling_skills',
    '/api/workforce-decisions',
    '/api/methodology',
    # also test existing endpoints to guarantee backward compatibility
    '/api/profile',
    '/api/careers',
    '/api/recommendations',
    '/api/courses',
    '/api/certifications'
]

print("=== TESTING ALL CAREERTWIN API ENDPOINTS ===")
all_ok = True
for ep in endpoints:
    res = client.get(ep)
    if res.status_code == 200:
        print(f"[OK 200] {ep}")
    else:
        print(f"[FAIL {res.status_code}] {ep}: {res.text}")
        all_ok = False

# Test what-if POST
post_res = client.post('/api/what-if', json={'coding_skills': 4.0, 'baseline_coding': 3.0})
if post_res.status_code == 200:
    data = post_res.json()
    b_prob = data.get("baseline_probability_pct")
    s_prob = data.get("scenario_probability_pct")
    d_prob = data.get("delta_percentage_points")
    print(f"[OK 200] POST /api/what-if -> Baseline: {b_prob}%, Scenario: {s_prob}%, Delta: {d_prob} pts")
else:
    print(f"[FAIL {post_res.status_code}] POST /api/what-if: {post_res.text}")
    all_ok = False

if all_ok:
    print("\n>>> ALL API CHECKS PASSED PERFECTLY! <<<")
else:
    print("\n>>> SOME API CHECKS FAILED! <<<")
