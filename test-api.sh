#!/bin/bash

# Virtual Event Platform - API Test Script
# This script contains cURL commands to test all API endpoints

BASE_URL="http://localhost:5000/api"

echo "======================================"
echo "Virtual Event Platform - API Testing"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Test 1: Health Check
echo -e "${BLUE}1. Testing Health Check${NC}"
curl -X GET "$BASE_URL/health"
echo -e "\n"

# Test 2: User Registration
echo -e "${BLUE}2. Testing User Registration (Organizer)${NC}"
REGISTER_ORGANIZER=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123",
    "name": "Jane Smith",
    "role": "organizer"
  }')
echo "$REGISTER_ORGANIZER" | jq .
echo -e "\n"

# Test 3: User Registration (Attendee)
echo -e "${BLUE}3. Testing User Registration (Attendee)${NC}"
REGISTER_ATTENDEE=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "attendee"
  }')
echo "$REGISTER_ATTENDEE" | jq .
echo -e "\n"

# Test 4: User Login - Organizer
echo -e "${BLUE}4. Testing User Login (Organizer)${NC}"
LOGIN_ORGANIZER=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "password123"
  }')
echo "$LOGIN_ORGANIZER" | jq .
ORGANIZER_TOKEN=$(echo "$LOGIN_ORGANIZER" | jq -r '.token')
echo -e "${GREEN}Organizer Token: $ORGANIZER_TOKEN${NC}\n"

# Test 5: User Login - Attendee
echo -e "${BLUE}5. Testing User Login (Attendee)${NC}"
LOGIN_ATTENDEE=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "password123"
  }')
echo "$LOGIN_ATTENDEE" | jq .
ATTENDEE_TOKEN=$(echo "$LOGIN_ATTENDEE" | jq -r '.token')
echo -e "${GREEN}Attendee Token: $ATTENDEE_TOKEN${NC}\n"

# Test 6: Create Event
echo -e "${BLUE}6. Testing Event Creation (by Organizer)${NC}"
EVENT=$(curl -s -X POST "$BASE_URL/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ORGANIZER_TOKEN" \
  -d '{
    "name": "Web Development Workshop",
    "description": "Learn modern web development with React and Node.js",
    "date": "2025-12-15",
    "time": "14:00",
    "location": "Online",
    "maxParticipants": 100
  }')
echo "$EVENT" | jq .
EVENT_ID=$(echo "$EVENT" | jq -r '.event.id')
echo -e "${GREEN}Event ID: $EVENT_ID${NC}\n"

# Test 7: Get All Events
echo -e "${BLUE}7. Testing Get All Events${NC}"
curl -s -X GET "$BASE_URL/events" | jq .
echo -e "\n"

# Test 8: Get Event by ID
echo -e "${BLUE}8. Testing Get Event by ID${NC}"
curl -s -X GET "$BASE_URL/events/$EVENT_ID" | jq .
echo -e "\n"

# Test 9: Create Another Event
echo -e "${BLUE}9. Testing Create Second Event${NC}"
EVENT2=$(curl -s -X POST "$BASE_URL/events" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ORGANIZER_TOKEN" \
  -d '{
    "name": "Mobile App Development",
    "description": "Build iOS and Android apps",
    "date": "2025-12-20",
    "time": "10:00",
    "location": "Hybrid",
    "maxParticipants": 50
  }')
echo "$EVENT2" | jq .
EVENT2_ID=$(echo "$EVENT2" | jq -r '.event.id')
echo -e "\n"

# Test 10: Register Attendee for Event
echo -e "${BLUE}10. Testing Event Registration (Attendee registers for Event)${NC}"
curl -s -X POST "$BASE_URL/events/$EVENT_ID/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ATTENDEE_TOKEN" | jq .
echo -e "\n"

# Test 11: Register Another Attendee
echo -e "${BLUE}11. Testing Registration of Another Attendee${NC}"
# First register another attendee
REGISTER_ATTENDEE2=$(curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123",
    "name": "Alice Williams",
    "role": "attendee"
  }')
ATTENDEE2_TOKEN=$(curl -s -X POST "$BASE_URL/auth/login" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "alice@example.com",
    "password": "password123"
  }' | jq -r '.token')

# Register for event
curl -s -X POST "$BASE_URL/events/$EVENT_ID/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ATTENDEE2_TOKEN" | jq .
echo -e "\n"

# Test 12: Try to register same attendee again (should fail)
echo -e "${BLUE}12. Testing Duplicate Registration (Should Fail)${NC}"
curl -s -X POST "$BASE_URL/events/$EVENT_ID/register" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ATTENDEE_TOKEN" | jq .
echo -e "\n"

# Test 13: Update Event
echo -e "${BLUE}13. Testing Update Event${NC}"
curl -s -X PUT "$BASE_URL/events/$EVENT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ORGANIZER_TOKEN" \
  -d '{
    "name": "Advanced Web Development Workshop",
    "description": "Learn advanced React patterns and best practices",
    "maxParticipants": 75
  }' | jq .
echo -e "\n"

# Test 14: Get Updated Event
echo -e "${BLUE}14. Testing Get Updated Event${NC}"
curl -s -X GET "$BASE_URL/events/$EVENT_ID" | jq .
echo -e "\n"

# Test 15: Try to update as non-organizer (should fail)
echo -e "${BLUE}15. Testing Unauthorized Update (Should Fail)${NC}"
curl -s -X PUT "$BASE_URL/events/$EVENT_ID" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ATTENDEE_TOKEN" \
  -d '{"name": "Hacked Event"}' | jq .
echo -e "\n"

# Test 16: Test Invalid Token (should fail)
echo -e "${BLUE}16. Testing Invalid Token (Should Fail)${NC}"
curl -s -X GET "$BASE_URL/events" \
  -H "Authorization: Bearer invalid_token" | jq .
echo -e "\n"

# Test 17: Test Missing Required Fields (should fail)
echo -e "${BLUE}17. Testing Missing Required Fields (Should Fail)${NC}"
curl -s -X POST "$BASE_URL/auth/register" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com"}' | jq .
echo -e "\n"

# Test 18: Delete Event
echo -e "${BLUE}18. Testing Delete Event${NC}"
curl -s -X DELETE "$BASE_URL/events/$EVENT2_ID" \
  -H "Authorization: Bearer $ORGANIZER_TOKEN" | jq .
echo -e "\n"

# Test 19: Try to get deleted event (should fail)
echo -e "${BLUE}19. Testing Get Deleted Event (Should Fail)${NC}"
curl -s -X GET "$BASE_URL/events/$EVENT2_ID" | jq .
echo -e "\n"

echo -e "${GREEN}======================================"
echo "Testing Complete!"
echo "======================================${NC}"
