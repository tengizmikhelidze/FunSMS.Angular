# FunSMS API Documentation

Complete API reference for sending SMS messages to Georgian phone numbers with custom sender names.

---

## 🔐 Authentication

All SMS endpoints require JWT authentication. Include the access token in the Authorization header:

```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Get access token by logging in:
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

---

## 📱 SMS Endpoints

### 1. Send SMS

Send an SMS message to a Georgian phone number with a custom sender name.

**Endpoint:** `POST /api/sms/send`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body:**
```typescript
{
  phone: string;          // Georgian phone number (+995XXXXXXXXX)
  senderName: string;     // Custom sender name (3-11 alphanumeric chars)
  message: string;        // Message text (max 1000 chars)
  scheduledAt?: string;   // Optional: ISO 8601 datetime for scheduled sending
}
```

**Example Request:**
```json
{
  "phone": "+995555123456",
  "senderName": "FunSMS",
  "message": "Hello! This is a test message from FunSMS.",
  "scheduledAt": "2026-01-15T14:30:00Z"
}
```

**Success Response:** `201 Created`
```json
{
  "success": true,
  "message": "SMS sent successfully",
  "data": {
    "sms": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "123e4567-e89b-12d3-a456-426614174000",
      "recipient_phone": "+995555123456",
      "sender_name": "FunSMS",
      "message_text": "Hello! This is a test message from FunSMS.",
      "status": "sent",
      "provider": "twilio",
      "provider_message_id": "SM1234567890abcdef",
      "cost": 0.0075,
      "sent_at": "2026-01-15T10:30:00.000Z",
      "created_at": "2026-01-15T10:30:00.000Z",
      "updated_at": "2026-01-15T10:30:00.000Z"
    },
    "messageInfo": {
      "valid": true,
      "length": 44,
      "parts": 1
    }
  }
}
```

**Error Responses:**

`400 Bad Request` - Invalid input
```json
{
  "success": false,
  "message": "Invalid Georgian phone number. Format: +995XXXXXXXXX"
}
```

`400 Bad Request` - Validation errors
```json
{
  "success": false,
  "errors": [
    {
      "msg": "Sender name must be 3-11 characters",
      "param": "senderName",
      "location": "body"
    }
  ]
}
```

`500 Internal Server Error` - SMS send failed
```json
{
  "success": false,
  "message": "Failed to send SMS",
  "error": "Insufficient balance"
}
```

---

### 2. Get SMS History

Retrieve SMS message history for authenticated user.

**Endpoint:** `GET /api/sms/history`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Query Parameters:**
- `limit` (optional): Number of messages to return (default: 50, max: 100)
- `offset` (optional): Number of messages to skip (default: 0)

**Example Request:**
```http
GET /api/sms/history?limit=20&offset=0
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "messages": [
      {
        "id": "550e8400-e29b-41d4-a716-446655440000",
        "user_id": "123e4567-e89b-12d3-a456-426614174000",
        "recipient_phone": "+995555123456",
        "sender_name": "FunSMS",
        "message_text": "Hello! This is a test message.",
        "status": "delivered",
        "provider": "twilio",
        "provider_message_id": "SM1234567890abcdef",
        "cost": 0.0075,
        "sent_at": "2026-01-15T10:30:00.000Z",
        "delivered_at": "2026-01-15T10:30:05.000Z",
        "created_at": "2026-01-15T10:30:00.000Z",
        "updated_at": "2026-01-15T10:30:05.000Z"
      }
    ],
    "pagination": {
      "total": 150,
      "limit": 20,
      "offset": 0,
      "hasMore": true
    }
  }
}
```

---

### 3. Get SMS by ID

Retrieve a specific SMS message by ID.

**Endpoint:** `GET /api/sms/:id`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Example Request:**
```http
GET /api/sms/550e8400-e29b-41d4-a716-446655440000
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "sms": {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "user_id": "123e4567-e89b-12d3-a456-426614174000",
      "recipient_phone": "+995555123456",
      "sender_name": "FunSMS",
      "message_text": "Hello!",
      "status": "sent",
      "provider": "twilio",
      "cost": 0.0075,
      "sent_at": "2026-01-15T10:30:00.000Z",
      "created_at": "2026-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**

`404 Not Found`
```json
{
  "success": false,
  "message": "SMS not found"
}
```

`403 Forbidden`
```json
{
  "success": false,
  "message": "Access denied"
}
```

---

### 4. Get SMS Statistics

Get statistics about sent messages for authenticated user.

**Endpoint:** `GET /api/sms/stats`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "stats": {
      "total": 150,
      "sent": 140,
      "failed": 5,
      "pending": 3,
      "delivered": 135
    }
  }
}
```

---

### 5. Delete SMS

Delete a pending SMS message.

**Endpoint:** `DELETE /api/sms/:id`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Example Request:**
```http
DELETE /api/sms/550e8400-e29b-41d4-a716-446655440000
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "message": "SMS deleted successfully"
}
```

**Error Responses:**

`400 Bad Request` - Can only delete pending messages
```json
{
  "success": false,
  "message": "Can only delete pending messages"
}
```

`404 Not Found`
```json
{
  "success": false,
  "message": "SMS not found"
}
```

---

### 6. Get Account Balance

Get SMS provider account balance.

**Endpoint:** `GET /api/sms/balance`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "balance": 14.25,
    "provider": "twilio"
  }
}
```

---

### 7. Validate Phone Number

Validate and format a Georgian phone number.

**Endpoint:** `POST /api/sms/validate-phone`

**Headers:**
```http
Authorization: Bearer YOUR_ACCESS_TOKEN
Content-Type: application/json
```

**Request Body:**
```json
{
  "phone": "555123456"
}
```

**Success Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "isValid": true,
    "formatted": "+995555123456",
    "original": "555123456"
  }
}
```

---

## 📋 Data Models

### SMS Message Object

```typescript
interface SmsMessage {
  id: string;                    // UUID
  user_id: string;               // User who sent the SMS
  recipient_phone: string;       // Phone number (+995XXXXXXXXX)
  sender_name: string;           // Custom sender name
  message_text: string;          // Message content
  status: 'pending' | 'sent' | 'failed' | 'delivered';
  provider: string;              // SMS provider used (twilio, vonage, etc)
  provider_message_id?: string;  // Provider's message ID
  cost?: number;                 // Cost in USD/EUR
  error_message?: string;        // Error message if failed
  scheduled_at?: Date;           // Scheduled send time
  sent_at?: Date;                // Actual send time
  delivered_at?: Date;           // Delivery time
  created_at: Date;              // Record creation time
  updated_at: Date;              // Last update time
}
```

### SMS Status Values

- `pending`: Message is queued but not sent yet
- `sent`: Message has been sent to the provider
- `failed`: Message sending failed
- `delivered`: Message was delivered to recipient (if provider supports delivery reports)

---

## ✅ Validation Rules

### Phone Number
- Must be Georgian number: `+995XXXXXXXXX`
- Valid operators: 5XX (Magticom, Beeline, Geocell)
- Auto-formatting supported:
  - `+995555123456` ✅
  - `995555123456` ✅ (auto-adds +)
  - `555123456` ✅ (auto-adds +995)

### Sender Name
- Length: 3-11 characters
- Characters: Alphanumeric only (a-z, A-Z, 0-9)
- No spaces or special characters
- Examples:
  - `FunSMS` ✅
  - `MyApp123` ✅
  - `Test` ✅
  - `AB` ❌ (too short)
  - `My App` ❌ (contains space)

### Message Text
- Maximum: 1000 characters
- Minimum: 1 character
- GSM charset: 160 chars per SMS part
- Unicode/Georgian: 70 chars per SMS part

### Scheduled Sending
- Must be ISO 8601 format
- Must be future datetime
- Example: `2026-01-15T14:30:00Z`

---

## 🔧 Error Codes

| Status Code | Description |
|-------------|-------------|
| 200 | Success |
| 201 | Created (SMS sent/scheduled) |
| 400 | Bad Request (validation error) |
| 401 | Unauthorized (invalid/missing token) |
| 403 | Forbidden (access denied) |
| 404 | Not Found (SMS not found) |
| 500 | Internal Server Error |

---

## 📊 Rate Limiting

Recommended rate limits (implement in production):

- **Per User**: 10 SMS per minute
- **Per User**: 100 SMS per hour
- **Per User**: 1000 SMS per day

---

## 💡 Usage Examples

### cURL Examples

**Send SMS:**
```bash
curl -X POST http://localhost:3000/api/sms/send \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+995555123456",
    "senderName": "FunSMS",
    "message": "Hello from Georgia!"
  }'
```

**Get History:**
```bash
curl -X GET "http://localhost:3000/api/sms/history?limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Get Stats:**
```bash
curl -X GET http://localhost:3000/api/sms/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### JavaScript/TypeScript Example

```typescript
import axios from 'axios';

const API_URL = 'http://localhost:3000/api';
const token = 'YOUR_ACCESS_TOKEN';

// Send SMS
async function sendSms() {
  try {
    const response = await axios.post(
      `${API_URL}/sms/send`,
      {
        phone: '+995555123456',
        senderName: 'FunSMS',
        message: 'Hello from TypeScript!'
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log('SMS sent:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}

// Get SMS History
async function getHistory() {
  try {
    const response = await axios.get(
      `${API_URL}/sms/history?limit=20&offset=0`,
      {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      }
    );
    
    console.log('History:', response.data);
  } catch (error) {
    console.error('Error:', error.response.data);
  }
}
```

### Angular Service Example

```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

interface SendSmsRequest {
  phone: string;
  senderName: string;
  message: string;
  scheduledAt?: string;
}

@Injectable({ providedIn: 'root' })
export class SmsService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}

  sendSms(data: SendSmsRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/sms/send`, data);
  }

  getHistory(limit = 50, offset = 0): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/sms/history?limit=${limit}&offset=${offset}`
    );
  }

  getStats(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sms/stats`);
  }

  getBalance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/sms/balance`);
  }

  validatePhone(phone: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/sms/validate-phone`, { phone });
  }
}
```

---

## 🧪 Testing

### Test with Mock Provider

Set in `.env`:
```env
SMS_PROVIDER=mock
```

This will simulate SMS sending without actually sending messages or charging your account.

### Test Endpoints with Postman

1. Import the collection from `TESTING_GUIDE.md`
2. Set environment variable: `token` = your JWT access token
3. Test each endpoint

---

## 🚀 Deployment

### Environment Variables

Make sure to set in production:

```env
# Choose your SMS provider
SMS_PROVIDER=twilio  # or vonage

# Twilio Configuration
TWILIO_ACCOUNT_SID=your_account_sid
TWILIO_AUTH_TOKEN=your_auth_token
TWILIO_PHONE_NUMBER=your_phone_number

# OR Vonage Configuration
VONAGE_API_KEY=your_api_key
VONAGE_API_SECRET=your_api_secret
```

### Security Considerations

1. **Always use HTTPS** in production
2. **Implement rate limiting** to prevent abuse
3. **Monitor SMS usage** to prevent cost overruns
4. **Validate all inputs** server-side
5. **Log all SMS sends** for audit purposes
6. **Set up alerts** for unusual activity

---

## 📞 Support

For issues or questions:
- Check `SMS_PROVIDER_GUIDE.md` for provider setup
- Review `TESTING_GUIDE.md` for testing examples
- Check server logs for detailed error messages

---

**API Version**: 1.0.0  
**Last Updated**: January 2026  
**Supported Regions**: Georgia 🇬🇪

