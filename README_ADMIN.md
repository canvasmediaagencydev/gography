# Gography Admin System - Setup Guide

ระบบหลังบ้านสำหรับจัดการทริปและรอบเดินทาง

## 🚀 การติดตั้งและตั้งค่า

### ขั้นตอนที่ 1: ติดตั้ง Dependencies

```bash
npm install
```

Dependencies ที่ติดตั้ง:
- `@supabase/supabase-js` - Supabase JavaScript client
- `@supabase/ssr` - Supabase SSR helpers for Next.js
- `zod` - Schema validation
- `date-fns` - Date utilities

### ขั้นตอนที่ 2: สร้าง Supabase Project

1. ไปที่ [Supabase Dashboard](https://supabase.com/dashboard)
2. คลิก "New Project"
3. กรอกข้อมูล:
   - Project name: `gography` (หรือชื่ออื่นที่ต้องการ)
   - Database password: (เก็บรหัสผ่านไว้ใช้ภายหลัง)
   - Region: เลือก region ที่ใกล้ที่สุด (เช่น Southeast Asia)
4. คลิก "Create new project" และรอสักครู่

### ขั้นตอนที่ 3: ตั้งค่า Environment Variables

1. Copy ไฟล์ `.env.local.example` เป็น `.env.local`:
```bash
cp .env.local.example .env.local
```

2. เปิด `.env.local` และกรอกข้อมูลจาก Supabase:

ไปที่ Supabase Dashboard → Project Settings → API

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### ขั้นตอนที่ 4: Run Database Migration

1. ไปที่ Supabase Dashboard → SQL Editor
2. คลิก "New query"
3. Copy เนื้อหาจากไฟล์ `/supabase/migrations/001_initial_schema.sql`
4. Paste ลงใน SQL Editor
5. คลิก "Run" (หรือกด Ctrl/Cmd + Enter)
6. ควรเห็นข้อความ "Success. No rows returned"

การ migration จะสร้าง:
- ✅ 4 Tables: countries, trips, trip_schedules, admin_users
- ✅ RLS Policies (Row Level Security)
- ✅ Indexes สำหรับ performance
- ✅ ข้อมูลประเทศเริ่มต้น (6 ประเทศ)

### ขั้นตอนที่ 5: สร้าง Admin User

1. ไปที่ Supabase Dashboard → Authentication → Users
2. คลิก "Add user" → "Create new user"
3. กรอก:
   - Email: `admin@gography.com` (หรืออีเมลที่ต้องการ)
   - Password: (รหัสผ่านที่ปลอดภัย)
   - Auto Confirm User: เปิด (✓)
4. คลิก "Create user"
5. Copy User ID ที่ได้

6. ไปที่ SQL Editor และ run คำสั่งนี้ (แทน `USER_ID_HERE` ด้วย User ID ที่ copy มา):

```sql
INSERT INTO admin_users (id, email, full_name, role, is_active)
VALUES (
  'USER_ID_HERE',
  'admin@gography.com',
  'Admin User',
  'admin',
  true
);
```

### ขั้นตอนที่ 6: Migrate ข้อมูลทริปเก่า (Optional)

ถ้าต้องการย้ายข้อมูลทริปที่ hardcode มาใส่ database:

```bash
npx tsx scripts/migrate-trips.ts
```

Script นี้จะ:
- อ่านข้อมูลทริปจาก hardcoded data
- แปลงและ insert เข้า database
- สร้าง trip_schedules อัตโนมัติ

### ขั้นตอนที่ 7: รัน Development Server

```bash
npm run dev
```

เปิดบราวเซอร์ไปที่:
- **Admin Panel**: http://localhost:3000/admin/login
- **Public Website**: http://localhost:3000

## 🔐 การใช้งาน Admin Panel

### Login

1. ไปที่ `/admin/login`
2. ใส่อีเมลและรหัสผ่านที่สร้างไว้
3. คลิก "เข้าสู่ระบบ"

### เมนูหลัก

- **📊 แดชบอร์ด** - ภาพรวมสถิติและ quick actions
- **🌏 จัดการทริป** - สร้าง/แก้ไข/ลบทริป
- **🌍 จัดการประเทศ** - ดูรายการประเทศปลายทาง

### สร้างทริปใหม่

1. คลิก "จัดการทริป" → "สร้างใหม่"
2. กรอกข้อมูล:
   - ชื่อทริป *
   - รายละเอียด
   - ประเทศ *
   - ประเภททริป (กรุ๊ปทัวร์/ทริปส่วนตัว) *
   - ราคาต่อคน *
   - รูปภาพปก (URL)
   - ลิงก์เอกสาร (URL)
   - สถานะ (เปิด/ปิดใช้งาน)
3. คลิก "บันทึก"

### เพิ่มรอบเดินทาง

1. ไปที่หน้ารายละเอียดทริป
2. คลิก "เพิ่มรอบเดินทาง"
3. กรอกข้อมูล:
   - วันที่เดินทาง *
   - วันที่กลับ *
   - วันปิดรับสมัคร *
   - จำนวนที่นั่งทั้งหมด *
   - ที่นั่งว่าง *
   - สถานะ
4. คลิก "บันทึก"

## 📁 โครงสร้างโปรเจกต์

```
gography/
├── app/
│   ├── admin/                    # Admin panel pages
│   │   ├── layout.tsx            # Admin layout with sidebar
│   │   ├── login/page.tsx        # Login page
│   │   ├── dashboard/page.tsx    # Dashboard
│   │   ├── trips/                # Trip management
│   │   ├── schedules/            # Schedule management
│   │   └── countries/page.tsx    # Countries list
│   ├── api/                      # API routes
│   │   ├── auth/                 # Authentication
│   │   ├── trips/                # Trips CRUD
│   │   ├── schedules/            # Schedules CRUD
│   │   └── countries/            # Countries list
│   ├── components/
│   │   └── admin/                # Admin UI components
│   ├── trips/page.tsx            # Public trips page (updated)
│   └── components/UpcomingTrips.tsx  # Homepage trips (updated)
├── lib/
│   ├── supabase/                 # Supabase clients
│   ├── thai-labels.ts            # Thai language labels
│   └── migration-helpers.ts      # Data transformation helpers
├── types/
│   └── database.types.ts         # TypeScript types
├── supabase/
│   └── migrations/               # Database migrations
├── scripts/
│   └── migrate-trips.ts          # Migration script
├── middleware.ts                 # Route protection
└── .env.local                    # Environment variables
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/login` - Admin login
- `POST /api/auth/logout` - Logout

### Trips (Admin)
- `GET /api/trips` - List all trips (with filters, pagination)
- `POST /api/trips` - Create trip
- `GET /api/trips/[id]` - Get trip details
- `PUT /api/trips/[id]` - Update trip
- `DELETE /api/trips/[id]` - Delete trip

### Trips (Public)
- `GET /api/trips/public` - Get active trips for website

### Schedules
- `GET /api/schedules` - List schedules
- `POST /api/schedules` - Create schedule
- `GET /api/schedules/[id]` - Get schedule
- `PUT /api/schedules/[id]` - Update schedule
- `DELETE /api/schedules/[id]` - Delete schedule
- `GET /api/schedules/trip/[tripId]` - Get schedules by trip

### Countries
- `GET /api/countries` - List countries

## 🗄️ Database Schema

### Tables

**countries**
- id (UUID, PK)
- code (VARCHAR(3), UNIQUE)
- name_th (VARCHAR(100))
- name_en (VARCHAR(100))
- flag_emoji (VARCHAR(10))
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMPTZ)

**trips**
- id (UUID, PK)
- title (VARCHAR(255))
- description (TEXT)
- country_id (UUID, FK → countries)
- price_per_person (DECIMAL(10,2))
- cover_image_url (TEXT)
- file_link (TEXT)
- trip_type (VARCHAR(20): 'group' | 'private')
- is_active (BOOLEAN)
- created_by (UUID, FK → auth.users)
- created_at, updated_at (TIMESTAMPTZ)

**trip_schedules**
- id (UUID, PK)
- trip_id (UUID, FK → trips)
- departure_date (DATE)
- return_date (DATE)
- registration_deadline (DATE)
- total_seats (INTEGER)
- available_seats (INTEGER)
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMPTZ)

**admin_users**
- id (UUID, PK, FK → auth.users)
- email (VARCHAR(255))
- full_name (VARCHAR(255))
- role (VARCHAR(20): 'admin')
- is_active (BOOLEAN)
- created_at, updated_at (TIMESTAMPTZ)

## 🔒 Security

- **Row Level Security (RLS)** enabled on all tables
- Public can only read active trips/schedules
- Only authenticated admins can modify data
- Middleware protects all `/admin` routes
- Admin verification on every protected page

## 🐛 Troubleshooting

### ไม่สามารถ login ได้
- ตรวจสอบว่าสร้าง admin user แล้วใน `admin_users` table
- ตรวจสอบ email และ password ใน Supabase Authentication
- ดูที่ Console (F12) เช็ค error messages

### ไม่เห็นทริปบนหน้าเว็บ
- ตรวจสอบว่าทริปมี `is_active = true`
- ตรวจสอบว่ามี trip_schedules ที่ active และวันที่ในอนาคต
- เช็ค Network tab ใน DevTools ดู API response

### Database connection error
- ตรวจสอบ `.env.local` มี credentials ถูกต้อง
- ตรวจสอบว่า Supabase project ยัง active
- ลอง regenerate API keys ใน Supabase Dashboard

## 📝 Next Steps

1. ✅ Setup และ migrate ข้อมูลเสร็จแล้ว
2. 🎨 Customize UI ตามต้องการ
3. 📸 Upload รูปภาพทริปไปที่ Supabase Storage
4. 🚀 Deploy ไปยัง production (Vercel)
5. 🔐 เพิ่ม 2FA authentication (optional)

## 💡 Tips

- ใช้ Supabase Storage สำหรับเก็บรูปภาพแทน external URLs
- ตั้งค่า automated backups ใน Supabase
- เพิ่ม monitoring และ analytics
- สร้าง booking system ต่อจาก trip schedules

---

พัฒนาโดย Claude Code 🤖
