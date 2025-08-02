import requests
import json

def test_chat_endpoint():
    """Test the chat endpoint"""
    url = "http://127.0.0.1:5000/chat"
    
    test_messages = [
        "I need a video editor for entertainment content",
        "Urgent: Need experienced video editor ASAP",
        "Looking for creative team player with 3+ years experience"
    ]
    
    for message in test_messages:
        print(f"\n{'='*50}")
        print(f"Testing message: {message}")
        print(f"{'='*50}")
        
        try:
            response = requests.post(url, json={"message": message})
            print(f"Status Code: {response.status_code}")
            
            if response.status_code == 200:
                data = response.json()
                print(f"AI Response: {data.get('message', 'No message')}")
                print(f"Candidates found: {len(data.get('candidates', []))}")
                
                if data.get('candidates'):
                    for i, candidate in enumerate(data['candidates'][:2]):
                        print(f"  Candidate {i+1}: {candidate['name']} - {candidate['score']:.1%} match")
            else:
                print(f"Error: {response.text}")
                
        except Exception as e:
            print(f"Exception: {e}")

def test_health_endpoint():
    """Test the health endpoint"""
    try:
        response = requests.get("http://127.0.0.1:5000/health")
        print(f"\nHealth Check Status: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Health Data: {json.dumps(data, indent=2)}")
    except Exception as e:
        print(f"Health check failed: {e}")

if __name__ == "__main__":
    print("Testing AI Chat Service...")
    test_health_endpoint()
    test_chat_endpoint() 